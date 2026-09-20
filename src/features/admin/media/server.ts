import "server-only";

import { del, get, head } from "@vercel/blob";

import { getMediaUploadRules, getUploadPathPrefix } from "@/features/admin/media/config";
import type { MediaUploadIntent, UploadedBlobInput } from "@/features/admin/media/validation";

export type VerifiedUploadedBlob = {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
};

function isPublicBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

function startsWithBytes(value: Uint8Array, expected: readonly number[]): boolean {
  if (value.length < expected.length) {
    return false;
  }

  return expected.every((byte, index) => value[index] === byte);
}

function isWebp(value: Uint8Array): boolean {
  if (value.length < 12) {
    return false;
  }

  const riff = String.fromCharCode(...value.slice(0, 4));

  const webp = String.fromCharCode(...value.slice(8, 12));

  return riff === "RIFF" && webp === "WEBP";
}

function hasValidMagicBytes(contentType: string, value: Uint8Array): boolean {
  switch (contentType) {
    case "image/jpeg":
      return startsWithBytes(value, [0xff, 0xd8, 0xff]);

    case "image/png":
      return startsWithBytes(value, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    case "image/webp":
      return isWebp(value);

    case "application/pdf":
      return startsWithBytes(value, [0x25, 0x50, 0x44, 0x46, 0x2d]);

    default:
      return false;
  }
}

async function readBlobPrefix(url: string): Promise<Uint8Array> {
  const result = await get(url, {
    access: "public",
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    throw new Error("Uploaded file could not be read.");
  }

  const reader = result.stream.getReader();

  const bytes: number[] = [];

  try {
    while (bytes.length < 32) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      for (let index = 0; index < value.length && bytes.length < 32; index += 1) {
        bytes.push(value[index]);
      }
    }
  } finally {
    await reader.cancel();
  }

  return Uint8Array.from(bytes);
}

export async function verifyUploadedBlob(
  upload: UploadedBlobInput,
  intent: MediaUploadIntent,
): Promise<VerifiedUploadedBlob> {
  if (!isPublicBlobUrl(upload.url)) {
    throw new Error("Uploaded file is not from a public Vercel Blob store.");
  }

  const metadata = await head(upload.url);

  if (metadata.url !== upload.url) {
    throw new Error("Uploaded Blob URL is not canonical.");
  }

  if (metadata.pathname !== upload.pathname) {
    throw new Error("Uploaded Blob pathname is invalid.");
  }

  const targetId = "targetId" in intent ? intent.targetId : undefined;

  const expectedPrefix = getUploadPathPrefix(intent.kind, targetId);

  if (!metadata.pathname.startsWith(expectedPrefix)) {
    throw new Error("Uploaded Blob pathname does not match its target.");
  }

  const rules = getMediaUploadRules(intent.kind);

  const allowed = rules.allowedContentTypes.some(
    (contentType) => contentType === metadata.contentType,
  );

  if (!allowed) {
    throw new Error("Uploaded file type is not allowed.");
  }

  if (metadata.size > rules.maximumSizeInBytes) {
    throw new Error("Uploaded file exceeds the allowed size.");
  }

  const prefixBytes = await readBlobPrefix(metadata.url);

  if (!hasValidMagicBytes(metadata.contentType, prefixBytes)) {
    throw new Error("Uploaded file content does not match its declared type.");
  }

  return {
    url: metadata.url,
    pathname: metadata.pathname,
    contentType: metadata.contentType,
    size: metadata.size,
  };
}

export async function safeDeletePublicBlob(url: string): Promise<void> {
  if (!isPublicBlobUrl(url)) {
    return;
  }

  await del(url);
}

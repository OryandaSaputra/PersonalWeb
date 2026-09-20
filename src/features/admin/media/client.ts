"use client";

import { getUploadPathPrefix } from "@/features/admin/media/config";
import type { MediaUploadIntent } from "@/features/admin/media/validation";

function extensionForContentType(contentType: string): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "application/pdf":
      return "pdf";

    default:
      throw new Error("Unsupported file type.");
  }
}

export function buildMediaUploadPath(intent: MediaUploadIntent, file: File): string {
  const extension = extensionForContentType(file.type);

  const prefix = getUploadPathPrefix(
    intent.kind,
    "targetId" in intent ? intent.targetId : undefined,
  );

  return `${prefix}${crypto.randomUUID()}.${extension}`;
}

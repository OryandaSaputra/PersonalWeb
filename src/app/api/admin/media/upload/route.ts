import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getMediaUploadRules, getUploadPathPrefix } from "@/features/admin/media/config";
import { mediaUploadIntentSchema, type MediaUploadIntent } from "@/features/admin/media/validation";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { certifications, profiles, projects } from "@/server/db/schema";

export const runtime = "nodejs";

function parseClientPayload(clientPayload: string | null | undefined): MediaUploadIntent {
  if (!clientPayload) {
    throw new Error("Upload intent is missing.");
  }

  let raw: unknown;

  try {
    raw = JSON.parse(clientPayload);
  } catch {
    throw new Error("Upload intent is invalid.");
  }

  const parsed = mediaUploadIntentSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("Upload intent is invalid.");
  }

  return parsed.data;
}

async function assertTargetExists(intent: MediaUploadIntent): Promise<void> {
  if (intent.kind === "profile-image" || intent.kind === "cv") {
    const [profile] = await db
      .select({
        id: profiles.id,
      })
      .from(profiles)
      .limit(1);

    if (!profile) {
      throw new Error("Profile must exist before uploading media.");
    }

    return;
  }

  if (intent.kind === "certification-image") {
    const [certification] = await db
      .select({
        id: certifications.id,
      })
      .from(certifications)
      .where(eq(certifications.id, intent.targetId))
      .limit(1);

    if (!certification) {
      throw new Error("Certification was not found.");
    }

    return;
  }

  const [project] = await db
    .select({
      id: projects.id,
    })
    .from(projects)
    .where(eq(projects.id, intent.targetId))
    .limit(1);

  if (!project) {
    throw new Error("Project was not found.");
  }
}

function assertSafePathname(pathname: string, intent: MediaUploadIntent): void {
  const targetId = "targetId" in intent ? intent.targetId : undefined;

  const prefix = getUploadPathPrefix(intent.kind, targetId);

  if (
    !pathname.startsWith(prefix) ||
    pathname.includes("..") ||
    pathname.length > 500 ||
    !/^[a-zA-Z0-9/_\-.]+$/.test(pathname)
  ) {
    throw new Error("Upload pathname is invalid.");
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const response = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (pathname, clientPayload) => {
        await requireAdmin();

        const intent = parseClientPayload(clientPayload);

        await assertTargetExists(intent);

        assertSafePathname(pathname, intent);

        const rules = getMediaUploadRules(intent.kind);

        return {
          allowedContentTypes: [...rules.allowedContentTypes],

          maximumSizeInBytes: rules.maximumSizeInBytes,

          addRandomSuffix: true,

          allowOverwrite: false,

          cacheControlMaxAge: 31_536_000,

          tokenPayload: JSON.stringify(intent),
        };
      },

      onUploadCompleted: async () => {
        /*
         * Registration happens in an authenticated
         * Server Action immediately after upload().
         *
         * This callback intentionally has no database
         * side effect so local development does not
         * depend on an externally reachable localhost.
         */
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Media upload authorization failed.", error);

    return NextResponse.json(
      {
        error: "Upload authorization failed.",
      },
      {
        status: 400,
      },
    );
  }
}

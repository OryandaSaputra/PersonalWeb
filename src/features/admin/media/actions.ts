"use server";

import { and, eq, inArray, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminMutationResult } from "@/features/admin/content/types";
import { toNullableText } from "@/features/admin/content/utils";
import {
  safeDeletePublicBlob,
  verifyUploadedBlob,
  type VerifiedUploadedBlob,
} from "@/features/admin/media/server";
import {
  createProjectImageSchema,
  mediaIdSchema,
  projectImageMetadataSchema,
  uploadedBlobSchema,
  type CreateProjectImageInput,
  type ProjectImageMetadataInput,
  type UploadedBlobInput,
} from "@/features/admin/media/validation";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { certifications, mediaAssets, profiles, projectImages, projects } from "@/server/db/schema";

function revalidateMediaPaths() {
  revalidatePath("/admin/media");

  revalidatePath("/admin/profile");

  revalidatePath("/admin/certifications");

  revalidatePath("/admin/projects");

  revalidatePath("/admin/dashboard");
}

async function insertMediaAsset(
  verified: VerifiedUploadedBlob,
  originalFilename: string,
): Promise<string> {
  const [created] = await db
    .insert(mediaAssets)
    .values({
      provider: "vercel_blob",

      storageKey: verified.url,

      originalFilename,

      mimeType: verified.contentType,

      sizeBytes: verified.size,

      width: null,
      height: null,

      visibility: "public",
    })
    .returning({
      id: mediaAssets.id,
    });

  if (!created) {
    throw new Error("Media record could not be created.");
  }

  return created.id;
}

async function getMediaUsage(mediaId: string): Promise<string[]> {
  const [profileImageUsage, cvUsage, certificationUsage, projectUsage] = await Promise.all([
    db
      .select({
        id: profiles.id,
      })
      .from(profiles)
      .where(eq(profiles.profileImageMediaId, mediaId))
      .limit(1),

    db
      .select({
        id: profiles.id,
      })
      .from(profiles)
      .where(eq(profiles.cvMediaId, mediaId))
      .limit(1),

    db
      .select({
        id: certifications.id,
      })
      .from(certifications)
      .where(eq(certifications.certificateMediaId, mediaId))
      .limit(1),

    db
      .select({
        id: projectImages.id,
      })
      .from(projectImages)
      .where(eq(projectImages.mediaAssetId, mediaId))
      .limit(1),
  ]);

  const usages: string[] = [];

  if (profileImageUsage.length > 0) {
    usages.push("profile-image");
  }

  if (cvUsage.length > 0) {
    usages.push("cv");
  }

  if (certificationUsage.length > 0) {
    usages.push("certification-image");
  }

  if (projectUsage.length > 0) {
    usages.push("project-image");
  }

  return usages;
}

type CleanupResult = "deleted" | "in-use" | "missing" | "storage-failed";

async function cleanupOrphanedMediaAsset(mediaId: string | null): Promise<CleanupResult> {
  if (!mediaId) {
    return "missing";
  }

  const usages = await getMediaUsage(mediaId);

  if (usages.length > 0) {
    return "in-use";
  }

  const [asset] = await db
    .select({
      id: mediaAssets.id,
      storageKey: mediaAssets.storageKey,
    })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, mediaId))
    .limit(1);

  if (!asset) {
    return "missing";
  }

  try {
    await safeDeletePublicBlob(asset.storageKey);
  } catch (error) {
    console.error("Blob cleanup failed.", error);

    return "storage-failed";
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, mediaId));

  return "deleted";
}

async function rollbackNewMedia(mediaId: string, blobUrl: string): Promise<void> {
  try {
    await safeDeletePublicBlob(blobUrl);
  } catch (error) {
    console.error(
      "Blob rollback failed. The unused media record is retained for manual cleanup.",
      error,
    );

    return;
  }

  try {
    await db.delete(mediaAssets).where(eq(mediaAssets.id, mediaId));
  } catch (error) {
    console.error("Media record rollback failed after Blob cleanup.", error);
  }
}

async function deleteUnregisteredBlob(upload: UploadedBlobInput): Promise<void> {
  try {
    await safeDeletePublicBlob(upload.url);
  } catch (error) {
    console.error("Unregistered Blob cleanup failed.", error);
  }
}

export async function registerProfileImageAction(
  input: UploadedBlobInput,
): Promise<AdminMutationResult> {
  await requireAdmin();

  const parsed = uploadedBlobSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Uploaded image metadata is invalid.",
    };
  }

  const upload = parsed.data;

  const [profile] = await db
    .select({
      id: profiles.id,
      oldMediaId: profiles.profileImageMediaId,
    })
    .from(profiles)
    .limit(1);

  if (!profile) {
    await deleteUnregisteredBlob(upload);

    return {
      ok: false,
      message: "Profile was not found.",
    };
  }

  let mediaId: string | null = null;

  try {
    const verified = await verifyUploadedBlob(upload, {
      kind: "profile-image",
    });

    mediaId = await insertMediaAsset(verified, upload.originalFilename);

    const updated = await db
      .update(profiles)
      .set({
        profileImageMediaId: mediaId,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id))
      .returning({
        id: profiles.id,
      });

    if (updated.length === 0) {
      throw new Error("Profile update failed.");
    }

    const cleanup = await cleanupOrphanedMediaAsset(profile.oldMediaId);

    if (cleanup === "storage-failed") {
      console.error("Old profile image remains in media registry because Blob cleanup failed.");
    }

    revalidateMediaPaths();

    return {
      ok: true,
      message: "Profile image updated successfully.",
    };
  } catch (error) {
    console.error("Failed to register profile image.", error);

    if (mediaId) {
      await rollbackNewMedia(mediaId, upload.url);
    } else {
      await deleteUnregisteredBlob(upload);
    }

    return {
      ok: false,
      message: "Profile image could not be saved.",
    };
  }
}

export async function removeProfileImageAction(): Promise<AdminMutationResult> {
  await requireAdmin();

  const [profile] = await db
    .select({
      id: profiles.id,
      mediaId: profiles.profileImageMediaId,
    })
    .from(profiles)
    .limit(1);

  if (!profile) {
    return {
      ok: false,
      message: "Profile was not found.",
    };
  }

  if (!profile.mediaId) {
    return {
      ok: true,
      message: "Profile image is already empty.",
    };
  }

  await db
    .update(profiles)
    .set({
      profileImageMediaId: null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profile.id));

  const cleanup = await cleanupOrphanedMediaAsset(profile.mediaId);

  revalidateMediaPaths();

  return {
    ok: true,
    message:
      cleanup === "storage-failed"
        ? "Profile image was detached. The unused media record remains for cleanup."
        : "Profile image removed successfully.",
  };
}

export async function registerCvAction(input: UploadedBlobInput): Promise<AdminMutationResult> {
  await requireAdmin();

  const parsed = uploadedBlobSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Uploaded CV metadata is invalid.",
    };
  }

  const upload = parsed.data;

  const [profile] = await db
    .select({
      id: profiles.id,
      oldMediaId: profiles.cvMediaId,
    })
    .from(profiles)
    .limit(1);

  if (!profile) {
    await deleteUnregisteredBlob(upload);

    return {
      ok: false,
      message: "Profile was not found.",
    };
  }

  let mediaId: string | null = null;

  try {
    const verified = await verifyUploadedBlob(upload, {
      kind: "cv",
    });

    mediaId = await insertMediaAsset(verified, upload.originalFilename);

    const updated = await db
      .update(profiles)
      .set({
        cvMediaId: mediaId,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id))
      .returning({
        id: profiles.id,
      });

    if (updated.length === 0) {
      throw new Error("Profile CV update failed.");
    }

    await cleanupOrphanedMediaAsset(profile.oldMediaId);

    revalidateMediaPaths();

    return {
      ok: true,
      message: "CV updated successfully.",
    };
  } catch (error) {
    console.error("Failed to register CV.", error);

    if (mediaId) {
      await rollbackNewMedia(mediaId, upload.url);
    } else {
      await deleteUnregisteredBlob(upload);
    }

    return {
      ok: false,
      message: "CV could not be saved.",
    };
  }
}

export async function removeCvAction(): Promise<AdminMutationResult> {
  await requireAdmin();

  const [profile] = await db
    .select({
      id: profiles.id,
      mediaId: profiles.cvMediaId,
    })
    .from(profiles)
    .limit(1);

  if (!profile) {
    return {
      ok: false,
      message: "Profile was not found.",
    };
  }

  if (!profile.mediaId) {
    return {
      ok: true,
      message: "CV is already empty.",
    };
  }

  await db
    .update(profiles)
    .set({
      cvMediaId: null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profile.id));

  const cleanup = await cleanupOrphanedMediaAsset(profile.mediaId);

  revalidateMediaPaths();

  return {
    ok: true,
    message:
      cleanup === "storage-failed"
        ? "CV was detached. The unused media record remains for cleanup."
        : "CV removed successfully.",
  };
}

export async function registerCertificationImageAction(
  certificationId: string,
  input: UploadedBlobInput,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(certificationId).success) {
    return {
      ok: false,
      message: "Certification identifier is invalid.",
    };
  }

  const parsed = uploadedBlobSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Uploaded certificate metadata is invalid.",
    };
  }

  const upload = parsed.data;

  const [certification] = await db
    .select({
      id: certifications.id,
      oldMediaId: certifications.certificateMediaId,
    })
    .from(certifications)
    .where(eq(certifications.id, certificationId))
    .limit(1);

  if (!certification) {
    await deleteUnregisteredBlob(upload);

    return {
      ok: false,
      message: "Certification was not found.",
    };
  }

  let mediaId: string | null = null;

  try {
    const verified = await verifyUploadedBlob(upload, {
      kind: "certification-image",
      targetId: certificationId,
    });

    mediaId = await insertMediaAsset(verified, upload.originalFilename);

    const updated = await db
      .update(certifications)
      .set({
        certificateMediaId: mediaId,
        updatedAt: new Date(),
      })
      .where(eq(certifications.id, certificationId))
      .returning({
        id: certifications.id,
      });

    if (updated.length === 0) {
      throw new Error("Certification image update failed.");
    }

    await cleanupOrphanedMediaAsset(certification.oldMediaId);

    revalidateMediaPaths();

    revalidatePath(`/admin/certifications/${certificationId}/media`);

    return {
      ok: true,
      message: "Certificate image updated successfully.",
    };
  } catch (error) {
    console.error("Failed to register certificate image.", error);

    if (mediaId) {
      await rollbackNewMedia(mediaId, upload.url);
    } else {
      await deleteUnregisteredBlob(upload);
    }

    return {
      ok: false,
      message: "Certificate image could not be saved.",
    };
  }
}

export async function removeCertificationImageAction(
  certificationId: string,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(certificationId).success) {
    return {
      ok: false,
      message: "Certification identifier is invalid.",
    };
  }

  const [certification] = await db
    .select({
      id: certifications.id,
      mediaId: certifications.certificateMediaId,
    })
    .from(certifications)
    .where(eq(certifications.id, certificationId))
    .limit(1);

  if (!certification) {
    return {
      ok: false,
      message: "Certification was not found.",
    };
  }

  if (!certification.mediaId) {
    return {
      ok: true,
      message: "Certificate image is already empty.",
    };
  }

  await db
    .update(certifications)
    .set({
      certificateMediaId: null,
      updatedAt: new Date(),
    })
    .where(eq(certifications.id, certificationId));

  const cleanup = await cleanupOrphanedMediaAsset(certification.mediaId);

  revalidateMediaPaths();

  revalidatePath(`/admin/certifications/${certificationId}/media`);

  return {
    ok: true,
    message:
      cleanup === "storage-failed"
        ? "Certificate image was detached. The unused media record remains for cleanup."
        : "Certificate image removed successfully.",
  };
}

export async function registerProjectImageAction(
  input: CreateProjectImageInput,
): Promise<AdminMutationResult> {
  await requireAdmin();

  const parsed = createProjectImageSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Project image data is invalid.",
    };
  }

  const values = parsed.data;

  const [project] = await db
    .select({
      id: projects.id,
    })
    .from(projects)
    .where(eq(projects.id, values.projectId))
    .limit(1);

  if (!project) {
    await deleteUnregisteredBlob(values.upload);

    return {
      ok: false,
      message: "Project was not found.",
    };
  }

  let mediaId: string | null = null;

  let projectImageId: string | null = null;

  try {
    const verified = await verifyUploadedBlob(values.upload, {
      kind: "project-image",
      targetId: values.projectId,
    });

    mediaId = await insertMediaAsset(verified, values.upload.originalFilename);

    const [created] = await db
      .insert(projectImages)
      .values({
        projectId: values.projectId,

        mediaAssetId: mediaId,

        /*
         * Insert safely as screenshot first.
         * If the requested type is cover, cover promotion
         * happens only after the relation exists.
         */
        imageType: "screenshot",

        caption: toNullableText(values.caption),

        altText: values.altText,

        displayOrder: values.displayOrder,
      })
      .returning({
        id: projectImages.id,
      });

    if (!created) {
      throw new Error("Project image relation could not be created.");
    }

    projectImageId = created.id;

    if (values.imageType === "cover") {
      const oldCovers = await db
        .select({
          id: projectImages.id,
        })
        .from(projectImages)
        .where(
          and(
            eq(projectImages.projectId, values.projectId),
            eq(projectImages.imageType, "cover"),
            ne(projectImages.id, projectImageId),
          ),
        );

      await db
        .update(projectImages)
        .set({
          imageType: "screenshot",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(projectImages.projectId, values.projectId),
            eq(projectImages.imageType, "cover"),
            ne(projectImages.id, projectImageId),
          ),
        );

      try {
        const promoted = await db
          .update(projectImages)
          .set({
            imageType: "cover",
            updatedAt: new Date(),
          })
          .where(eq(projectImages.id, projectImageId))
          .returning({
            id: projectImages.id,
          });

        if (promoted.length === 0) {
          throw new Error("New cover could not be promoted.");
        }
      } catch (error) {
        const oldCoverIds = oldCovers.map((cover) => cover.id);

        if (oldCoverIds.length > 0) {
          await db
            .update(projectImages)
            .set({
              imageType: "cover",
              updatedAt: new Date(),
            })
            .where(inArray(projectImages.id, oldCoverIds));
        }

        throw error;
      }
    }

    revalidateMediaPaths();

    revalidatePath(`/admin/projects/${values.projectId}/media`);

    revalidatePath(`/admin/projects/${values.projectId}/edit`);

    return {
      ok: true,
      message: "Project image added successfully.",
    };
  } catch (error) {
    console.error("Failed to register project image.", error);

    if (projectImageId) {
      try {
        await db.delete(projectImages).where(eq(projectImages.id, projectImageId));
      } catch (deleteError) {
        console.error("Project image rollback failed.", deleteError);
      }
    }

    if (mediaId) {
      await rollbackNewMedia(mediaId, values.upload.url);
    } else {
      await deleteUnregisteredBlob(values.upload);
    }

    return {
      ok: false,
      message: "Project image could not be saved.",
    };
  }
}

export async function updateProjectImageAction(
  imageId: string,
  input: ProjectImageMetadataInput,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!mediaIdSchema.safeParse(imageId).success) {
    return {
      ok: false,
      message: "Project image identifier is invalid.",
    };
  }

  const parsed = projectImageMetadataSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Project image metadata is invalid.",
    };
  }

  const values = parsed.data;

  const [current] = await db
    .select({
      id: projectImages.id,
      projectId: projectImages.projectId,
    })
    .from(projectImages)
    .where(eq(projectImages.id, imageId))
    .limit(1);

  if (!current) {
    return {
      ok: false,
      message: "Project image was not found.",
    };
  }

  try {
    if (values.imageType === "cover") {
      const previousCovers = await db
        .select({
          id: projectImages.id,
        })
        .from(projectImages)
        .where(
          and(
            eq(projectImages.projectId, current.projectId),
            eq(projectImages.imageType, "cover"),
            ne(projectImages.id, imageId),
          ),
        );

      await db
        .update(projectImages)
        .set({
          imageType: "screenshot",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(projectImages.projectId, current.projectId),
            eq(projectImages.imageType, "cover"),
            ne(projectImages.id, imageId),
          ),
        );

      try {
        const updated = await db
          .update(projectImages)
          .set({
            imageType: "cover",

            caption: toNullableText(values.caption),

            altText: values.altText,

            displayOrder: values.displayOrder,

            updatedAt: new Date(),
          })
          .where(eq(projectImages.id, imageId))
          .returning({
            id: projectImages.id,
          });

        if (updated.length === 0) {
          throw new Error("Project image update failed.");
        }
      } catch (error) {
        const ids = previousCovers.map((cover) => cover.id);

        if (ids.length > 0) {
          await db
            .update(projectImages)
            .set({
              imageType: "cover",
              updatedAt: new Date(),
            })
            .where(inArray(projectImages.id, ids));
        }

        throw error;
      }
    } else {
      const updated = await db
        .update(projectImages)
        .set({
          imageType: "screenshot",

          caption: toNullableText(values.caption),

          altText: values.altText,

          displayOrder: values.displayOrder,

          updatedAt: new Date(),
        })
        .where(eq(projectImages.id, imageId))
        .returning({
          id: projectImages.id,
        });

      if (updated.length === 0) {
        throw new Error("Project image update failed.");
      }
    }

    revalidateMediaPaths();

    revalidatePath(`/admin/projects/${current.projectId}/media`);

    revalidatePath(`/admin/projects/${current.projectId}/edit`);

    return {
      ok: true,
      message: "Project image metadata updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update project image.", error);

    return {
      ok: false,
      message: "Project image metadata could not be updated.",
    };
  }
}

export async function deleteProjectImageAction(imageId: string): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!mediaIdSchema.safeParse(imageId).success) {
    return {
      ok: false,
      message: "Project image identifier is invalid.",
    };
  }

  const [image] = await db
    .select({
      id: projectImages.id,
      projectId: projectImages.projectId,
      mediaAssetId: projectImages.mediaAssetId,
    })
    .from(projectImages)
    .where(eq(projectImages.id, imageId))
    .limit(1);

  if (!image) {
    return {
      ok: false,
      message: "Project image was not found.",
    };
  }

  try {
    await db.delete(projectImages).where(eq(projectImages.id, imageId));

    const cleanup = await cleanupOrphanedMediaAsset(image.mediaAssetId);

    revalidateMediaPaths();

    revalidatePath(`/admin/projects/${image.projectId}/media`);

    revalidatePath(`/admin/projects/${image.projectId}/edit`);

    return {
      ok: true,
      message:
        cleanup === "storage-failed"
          ? "Project image was detached. The unused media record remains for cleanup."
          : "Project image deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete project image.", error);

    return {
      ok: false,
      message: "Project image could not be deleted.",
    };
  }
}

export async function deleteUnusedMediaAction(mediaId: string): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!mediaIdSchema.safeParse(mediaId).success) {
    return {
      ok: false,
      message: "Media identifier is invalid.",
    };
  }

  const usages = await getMediaUsage(mediaId);

  if (usages.length > 0) {
    return {
      ok: false,
      message: "This media is still referenced and cannot be deleted.",
    };
  }

  const result = await cleanupOrphanedMediaAsset(mediaId);

  revalidateMediaPaths();

  if (result === "storage-failed") {
    return {
      ok: false,
      message:
        "Blob storage cleanup failed. The media record was retained so cleanup can be retried.",
    };
  }

  return {
    ok: true,
    message: "Unused media deleted successfully.",
  };
}

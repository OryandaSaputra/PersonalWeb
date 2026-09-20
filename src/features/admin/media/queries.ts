import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { certifications, mediaAssets, profiles, projectImages, projects } from "@/server/db/schema";

export async function getAdminMediaOverview() {
  const [profileRows, assets, certificationRefs, projectImageRefs] = await Promise.all([
    db
      .select({
        id: profiles.id,
        profileImageMediaId: profiles.profileImageMediaId,
        cvMediaId: profiles.cvMediaId,
      })
      .from(profiles)
      .limit(1),

    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),

    db
      .select({
        mediaAssetId: certifications.certificateMediaId,
        certificationId: certifications.id,
        certificationName: certifications.name,
      })
      .from(certifications),

    db
      .select({
        mediaAssetId: projectImages.mediaAssetId,
        projectImageId: projectImages.id,
        imageType: projectImages.imageType,
        projectId: projects.id,
        projectName: projects.name,
      })
      .from(projectImages)
      .innerJoin(projects, eq(projectImages.projectId, projects.id)),
  ]);

  const profile = profileRows[0] ?? null;

  const assetById = new Map(assets.map((asset) => [asset.id, asset]));

  const usageByAssetId = new Map<string, string[]>();

  function addUsage(mediaAssetId: string | null, label: string) {
    if (!mediaAssetId) {
      return;
    }

    const current = usageByAssetId.get(mediaAssetId) ?? [];

    current.push(label);

    usageByAssetId.set(mediaAssetId, current);
  }

  if (profile) {
    addUsage(profile.profileImageMediaId, "Profile image");

    addUsage(profile.cvMediaId, "CV");
  }

  for (const certification of certificationRefs) {
    addUsage(certification.mediaAssetId, `Certification: ${certification.certificationName}`);
  }

  for (const image of projectImageRefs) {
    addUsage(image.mediaAssetId, `Project: ${image.projectName} (${image.imageType})`);
  }

  return {
    profile,

    profileImage: profile?.profileImageMediaId
      ? (assetById.get(profile.profileImageMediaId) ?? null)
      : null,

    cv: profile?.cvMediaId ? (assetById.get(profile.cvMediaId) ?? null) : null,

    assets: assets.map((asset) => ({
      ...asset,
      usages: usageByAssetId.get(asset.id) ?? [],
    })),
  };
}

export async function getProjectMediaPageData(projectId: string) {
  const [project] = await db
    .select({
      id: projects.id,
      name: projects.name,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    return null;
  }

  const images = await db
    .select({
      id: projectImages.id,

      mediaAssetId: projectImages.mediaAssetId,

      imageType: projectImages.imageType,

      caption: projectImages.caption,

      altText: projectImages.altText,

      displayOrder: projectImages.displayOrder,

      createdAt: projectImages.createdAt,

      storageKey: mediaAssets.storageKey,

      originalFilename: mediaAssets.originalFilename,

      mimeType: mediaAssets.mimeType,

      sizeBytes: mediaAssets.sizeBytes,
    })
    .from(projectImages)
    .innerJoin(mediaAssets, eq(projectImages.mediaAssetId, mediaAssets.id))
    .where(eq(projectImages.projectId, projectId))
    .orderBy(asc(projectImages.displayOrder), asc(projectImages.createdAt));

  return {
    project,
    images,
  };
}

export async function getCertificationMediaPageData(certificationId: string) {
  const [certification] = await db
    .select({
      id: certifications.id,
      name: certifications.name,
      certificateMediaId: certifications.certificateMediaId,
    })
    .from(certifications)
    .where(eq(certifications.id, certificationId))
    .limit(1);

  if (!certification) {
    return null;
  }

  let media: typeof mediaAssets.$inferSelect | null = null;

  if (certification.certificateMediaId) {
    const [record] = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.id, certification.certificateMediaId))
      .limit(1);

    media = record ?? null;
  }

  return {
    certification,
    media,
  };
}

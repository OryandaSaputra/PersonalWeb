import "server-only";

import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";

import type {
  PublicProjectCaseStudy,
  PublicProjectImage,
  PublicProjectSeoRecord,
  PublicProjectSummary,
} from "@/features/public/projects/types";
import { toStringArray } from "@/features/public/projects/utils";
import { db } from "@/server/db/client";
import {
  mediaAssets,
  projectImages,
  projects,
  projectTechnologies,
  technologies,
} from "@/server/db/schema";

function mapTechnologiesByProject(
  rows: Array<{
    projectId: string;
    technologyName: string;
  }>,
): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const row of rows) {
    const current = map.get(row.projectId) ?? [];

    current.push(row.technologyName);

    map.set(row.projectId, current);
  }

  return map;
}

function mapFirstCoverByProject(
  rows: Array<{
    id: string;
    projectId: string;
    imageType: "cover" | "screenshot";
    url: string;
    altText: string;
    caption: string | null;
    displayOrder: number;
  }>,
): Map<string, PublicProjectImage> {
  const map = new Map<string, PublicProjectImage>();

  for (const row of rows) {
    if (map.has(row.projectId)) {
      continue;
    }

    map.set(row.projectId, {
      id: row.id,
      imageType: row.imageType,
      url: row.url,
      altText: row.altText,
      caption: row.caption,
      displayOrder: row.displayOrder,
    });
  }

  return map;
}

export async function getPublicProjects(): Promise<PublicProjectSummary[]> {
  const projectRows = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      projectType: projects.projectType,
      organization: projects.organization,
      shortDescription: projects.shortDescription,
      role: projects.role,
      repositoryUrl: projects.repositoryUrl,
      liveUrl: projects.liveUrl,
      startDate: projects.startDate,
      endDate: projects.endDate,
      caseStudyVisibility: projects.caseStudyVisibility,
      displayOrder: projects.displayOrder,
      publishedAt: projects.publishedAt,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(asc(projects.displayOrder), desc(projects.publishedAt), desc(projects.createdAt));

  const projectIds = projectRows.map((project) => project.id);

  if (projectIds.length === 0) {
    return [];
  }

  const [technologyRows, coverRows] = await Promise.all([
    db
      .select({
        projectId: projectTechnologies.projectId,
        technologyName: technologies.name,
        displayOrder: projectTechnologies.displayOrder,
      })
      .from(projectTechnologies)
      .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
      .where(inArray(projectTechnologies.projectId, projectIds))
      .orderBy(asc(projectTechnologies.displayOrder), asc(technologies.name)),

    db
      .select({
        id: projectImages.id,
        projectId: projectImages.projectId,
        imageType: projectImages.imageType,
        url: mediaAssets.storageKey,
        altText: projectImages.altText,
        caption: projectImages.caption,
        displayOrder: projectImages.displayOrder,
        createdAt: projectImages.createdAt,
      })
      .from(projectImages)
      .innerJoin(mediaAssets, eq(projectImages.mediaAssetId, mediaAssets.id))
      .where(
        and(
          inArray(projectImages.projectId, projectIds),
          eq(projectImages.imageType, "cover"),
          eq(mediaAssets.visibility, "public"),
        ),
      )
      .orderBy(asc(projectImages.displayOrder), asc(projectImages.createdAt)),
  ]);

  const technologiesByProject = mapTechnologiesByProject(technologyRows);

  const coverByProject = mapFirstCoverByProject(coverRows);

  return projectRows.map((project) => ({
    id: project.id,
    name: project.name,
    slug: project.slug,
    projectType: project.projectType,
    organization: project.organization,
    shortDescription: project.shortDescription,
    role: project.role,
    repositoryUrl: project.repositoryUrl,
    liveUrl: project.liveUrl,
    startDate: project.startDate,
    endDate: project.endDate,
    caseStudyVisibility: project.caseStudyVisibility,
    technologies: technologiesByProject.get(project.id) ?? [],
    cover: coverByProject.get(project.id) ?? null,
  }));
}

async function getProjectTechnologies(projectId: string): Promise<string[]> {
  const rows = await db
    .select({
      technologyName: technologies.name,
      displayOrder: projectTechnologies.displayOrder,
    })
    .from(projectTechnologies)
    .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
    .where(eq(projectTechnologies.projectId, projectId))
    .orderBy(asc(projectTechnologies.displayOrder), asc(technologies.name));

  return rows.map((row) => row.technologyName);
}

async function getProjectPublicImages(
  projectId: string,
  limited: boolean,
): Promise<PublicProjectImage[]> {
  const selection = {
    id: projectImages.id,
    imageType: projectImages.imageType,
    url: mediaAssets.storageKey,
    altText: projectImages.altText,
    caption: projectImages.caption,
    displayOrder: projectImages.displayOrder,
    createdAt: projectImages.createdAt,
  };

  const rows = limited
    ? await db
        .select(selection)
        .from(projectImages)
        .innerJoin(mediaAssets, eq(projectImages.mediaAssetId, mediaAssets.id))
        .where(
          and(
            eq(projectImages.projectId, projectId),
            eq(projectImages.imageType, "cover"),
            eq(mediaAssets.visibility, "public"),
          ),
        )
        .orderBy(asc(projectImages.displayOrder), asc(projectImages.createdAt))
    : await db
        .select(selection)
        .from(projectImages)
        .innerJoin(mediaAssets, eq(projectImages.mediaAssetId, mediaAssets.id))
        .where(and(eq(projectImages.projectId, projectId), eq(mediaAssets.visibility, "public")))
        .orderBy(asc(projectImages.displayOrder), asc(projectImages.createdAt));

  return rows.map((row) => ({
    id: row.id,
    imageType: row.imageType,
    url: row.url,
    altText: row.altText,
    caption: row.caption,
    displayOrder: row.displayOrder,
  }));
}

export async function getPublicProjectCaseStudyBySlug(
  slug: string,
): Promise<PublicProjectCaseStudy | null> {
  const [base] = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      projectType: projects.projectType,
      organization: projects.organization,
      shortDescription: projects.shortDescription,
      fullDescription: projects.fullDescription,
      role: projects.role,
      keyFeatures: projects.keyFeatures,
      repositoryUrl: projects.repositoryUrl,
      liveUrl: projects.liveUrl,
      documentationUrl: projects.documentationUrl,
      startDate: projects.startDate,
      endDate: projects.endDate,
      publishedAt: projects.publishedAt,
      caseStudyVisibility: projects.caseStudyVisibility,
    })
    .from(projects)
    .where(
      and(
        eq(projects.slug, slug),
        eq(projects.status, "published"),
        ne(projects.caseStudyVisibility, "private"),
      ),
    )
    .limit(1);

  if (!base) {
    return null;
  }

  const visibility = base.caseStudyVisibility;

  if (visibility !== "public" && visibility !== "limited") {
    return null;
  }

  const limited = visibility === "limited";

  const [technologyNames, images] = await Promise.all([
    getProjectTechnologies(base.id),
    getProjectPublicImages(base.id, limited),
  ]);

  let details: PublicProjectCaseStudy["details"] = {
    background: null,
    problem: null,
    solution: null,
    challenges: null,
    learning: null,
  };

  if (!limited) {
    const [detailRow] = await db
      .select({
        background: projects.background,
        problem: projects.problem,
        solution: projects.solution,
        challenges: projects.challenges,
        learning: projects.learning,
      })
      .from(projects)
      .where(eq(projects.id, base.id))
      .limit(1);

    if (detailRow) {
      details = {
        background: detailRow.background,
        problem: detailRow.problem,
        solution: detailRow.solution,
        challenges: detailRow.challenges,
        learning: detailRow.learning,
      };
    }
  }

  const cover = images.find((image) => image.imageType === "cover") ?? null;

  const gallery = limited ? [] : images.filter((image) => image.imageType === "screenshot");

  return {
    id: base.id,
    name: base.name,
    slug: base.slug,
    projectType: base.projectType,
    organization: base.organization,
    shortDescription: base.shortDescription,
    fullDescription: base.fullDescription,
    role: base.role,
    keyFeatures: toStringArray(base.keyFeatures),
    repositoryUrl: base.repositoryUrl,
    liveUrl: base.liveUrl,
    documentationUrl: base.documentationUrl,
    startDate: base.startDate,
    endDate: base.endDate,
    publishedAt: base.publishedAt,
    caseStudyVisibility: visibility,
    technologies: technologyNames,
    cover,
    gallery,
    details,
  };
}

export async function getPublicProjectSeoBySlug(
  slug: string,
): Promise<PublicProjectSeoRecord | null> {
  const [project] = await db
    .select({
      name: projects.name,
      shortDescription: projects.shortDescription,
      caseStudyVisibility: projects.caseStudyVisibility,
    })
    .from(projects)
    .where(
      and(
        eq(projects.slug, slug),
        eq(projects.status, "published"),
        ne(projects.caseStudyVisibility, "private"),
      ),
    )
    .limit(1);

  if (!project) {
    return null;
  }

  const visibility = project.caseStudyVisibility;

  if (visibility !== "public" && visibility !== "limited") {
    return null;
  }

  return {
    name: project.name,
    shortDescription: project.shortDescription,
    caseStudyVisibility: visibility,
  };
}

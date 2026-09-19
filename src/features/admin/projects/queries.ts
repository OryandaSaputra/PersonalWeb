import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { projects, projectTechnologies, technologies } from "@/server/db/schema";

export async function getAdminTechnologies() {
  return db.select().from(technologies).orderBy(asc(technologies.name));
}

export async function getAdminTechnologyById(id: string) {
  const [technology] = await db.select().from(technologies).where(eq(technologies.id, id)).limit(1);

  return technology ?? null;
}

export async function getAdminProjects() {
  return db
    .select()
    .from(projects)
    .orderBy(asc(projects.displayOrder), desc(projects.updatedAt), asc(projects.name));
}

export async function getAdminProjectById(id: string) {
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

  return project ?? null;
}

export async function getAdminProjectTechnologyLinks(projectId: string) {
  return db
    .select({
      projectId: projectTechnologies.projectId,

      technologyId: projectTechnologies.technologyId,

      displayOrder: projectTechnologies.displayOrder,

      name: technologies.name,

      slug: technologies.slug,
    })
    .from(projectTechnologies)
    .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
    .where(eq(projectTechnologies.projectId, projectId))
    .orderBy(asc(projectTechnologies.displayOrder), asc(technologies.name));
}

export async function getAdminProjectsPageData() {
  const [projectRecords, links] = await Promise.all([
    getAdminProjects(),

    db
      .select({
        projectId: projectTechnologies.projectId,
      })
      .from(projectTechnologies),
  ]);

  const counts = new Map<string, number>();

  for (const link of links) {
    counts.set(link.projectId, (counts.get(link.projectId) ?? 0) + 1);
  }

  return projectRecords.map((project) => ({
    ...project,
    technologyCount: counts.get(project.id) ?? 0,
  }));
}

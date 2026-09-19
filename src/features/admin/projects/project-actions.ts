"use server";

import { and, count, eq, ilike, max, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminMutationResult } from "@/features/admin/content/types";
import { toNullableText } from "@/features/admin/content/utils";
import {
  projectFormSchema,
  projectTechnologyOrderSchema,
  type ProjectFormValues,
} from "@/features/admin/projects/validation";
import { createSlug, parseMultilineList } from "@/features/admin/projects/utils";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { projectImages, projects, projectTechnologies, technologies } from "@/server/db/schema";

export type ProjectMutationResult =
  | {
      ok: true;
      message: string;
      projectId: string;
    }
  | {
      ok: false;
      message: string;
    };

function revalidateProjectPaths() {
  revalidatePath("/admin/projects");

  revalidatePath("/admin/dashboard");
}

function currentIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildProjectValues(input: ProjectFormValues) {
  return {
    projectType: toNullableText(input.projectType),

    organization: toNullableText(input.organization),

    shortDescription: input.shortDescription,

    fullDescription: toNullableText(input.fullDescription),

    background: toNullableText(input.background),

    problem: toNullableText(input.problem),

    solution: toNullableText(input.solution),

    role: toNullableText(input.role),

    keyFeatures: parseMultilineList(input.keyFeaturesText),

    challenges: toNullableText(input.challenges),

    learning: toNullableText(input.learning),

    repositoryUrl: toNullableText(input.repositoryUrl),

    liveUrl: toNullableText(input.liveUrl),

    documentationUrl: toNullableText(input.documentationUrl),

    startDate: toNullableText(input.startDate),

    endDate: toNullableText(input.endDate),

    status: input.status,

    caseStudyVisibility: input.caseStudyVisibility,

    isFeatured: input.isFeatured,

    displayOrder: input.displayOrder,
  };
}

export async function createProjectAction(
  input: ProjectFormValues,
): Promise<ProjectMutationResult> {
  await requireAdmin();

  const validation = projectFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The project data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;

  const slug = createSlug(values.slug || values.name);

  if (!slug) {
    return {
      ok: false,
      message: "The project name or slug cannot be converted into a valid URL slug.",
    };
  }

  try {
    const [duplicate] = await db
      .select({
        id: projects.id,
      })
      .from(projects)
      .where(or(ilike(projects.name, values.name), eq(projects.slug, slug)))
      .limit(1);

    if (duplicate) {
      return {
        ok: false,
        message: "A project with this name or slug already exists.",
      };
    }

    const [created] = await db
      .insert(projects)
      .values({
        name: values.name,

        slug,

        ...buildProjectValues(values),

        publishedAt: values.status === "published" ? currentIsoDate() : null,
      })
      .returning({
        id: projects.id,
      });

    if (!created) {
      return {
        ok: false,
        message: "The project could not be created.",
      };
    }

    revalidateProjectPaths();

    return {
      ok: true,
      message: "Project created successfully.",
      projectId: created.id,
    };
  } catch (error) {
    console.error("Failed to create project.", error);

    return {
      ok: false,
      message: "The project could not be created. Please try again.",
    };
  }
}

export async function updateProjectAction(
  id: string,
  input: ProjectFormValues,
): Promise<ProjectMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The project identifier is invalid.",
    };
  }

  const validation = projectFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The project data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;

  const slug = createSlug(values.slug || values.name);

  if (!slug) {
    return {
      ok: false,
      message: "The project name or slug cannot be converted into a valid URL slug.",
    };
  }

  try {
    const [current] = await db
      .select({
        id: projects.id,
        publishedAt: projects.publishedAt,
      })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!current) {
      return {
        ok: false,
        message: "Project was not found.",
      };
    }

    const duplicates = await db
      .select({
        id: projects.id,
      })
      .from(projects)
      .where(or(ilike(projects.name, values.name), eq(projects.slug, slug)))
      .limit(2);

    const duplicate = duplicates.find((record) => record.id !== id);

    if (duplicate) {
      return {
        ok: false,
        message: "A project with this name or slug already exists.",
      };
    }

    const publishedAt =
      values.status === "published" && !current.publishedAt
        ? currentIsoDate()
        : current.publishedAt;

    const updated = await db
      .update(projects)
      .set({
        name: values.name,

        slug,

        ...buildProjectValues(values),

        publishedAt,

        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning({
        id: projects.id,
      });

    if (updated.length === 0) {
      return {
        ok: false,
        message: "Project was not found.",
      };
    }

    revalidateProjectPaths();

    revalidatePath(`/admin/projects/${id}/edit`);

    return {
      ok: true,
      message: "Project updated successfully.",
      projectId: id,
    };
  } catch (error) {
    console.error("Failed to update project.", error);

    return {
      ok: false,
      message: "The project could not be updated. Please try again.",
    };
  }
}

export async function deleteProjectAction(id: string): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The project identifier is invalid.",
    };
  }

  try {
    const [imageUsage] = await db
      .select({
        total: count(),
      })
      .from(projectImages)
      .where(eq(projectImages.projectId, id));

    if ((imageUsage?.total ?? 0) > 0) {
      return {
        ok: false,
        message:
          "Remove project media before deleting this project. Project media management is handled in Stage 9.",
      };
    }

    await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, id));

    const deleted = await db.delete(projects).where(eq(projects.id, id)).returning({
      id: projects.id,
    });

    if (deleted.length === 0) {
      return {
        ok: false,
        message: "Project was not found.",
      };
    }

    revalidateProjectPaths();

    return {
      ok: true,
      message: "Project deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete project.", error);

    return {
      ok: false,
      message: "The project could not be deleted. Please try again.",
    };
  }
}

export async function addProjectTechnologyAction(
  projectId: string,
  technologyId: string,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (
    !z.string().uuid().safeParse(projectId).success ||
    !z.string().uuid().safeParse(technologyId).success
  ) {
    return {
      ok: false,
      message: "The project or technology identifier is invalid.",
    };
  }

  try {
    const [project, technology, existing] = await Promise.all([
      db
        .select({
          id: projects.id,
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1),

      db
        .select({
          id: technologies.id,
        })
        .from(technologies)
        .where(eq(technologies.id, technologyId))
        .limit(1),

      db
        .select({
          projectId: projectTechnologies.projectId,
        })
        .from(projectTechnologies)
        .where(
          and(
            eq(projectTechnologies.projectId, projectId),
            eq(projectTechnologies.technologyId, technologyId),
          ),
        )
        .limit(1),
    ]);

    if (project.length === 0) {
      return {
        ok: false,
        message: "Project was not found.",
      };
    }

    if (technology.length === 0) {
      return {
        ok: false,
        message: "Technology was not found.",
      };
    }

    if (existing.length > 0) {
      return {
        ok: false,
        message: "This technology is already assigned to the project.",
      };
    }

    const [orderResult] = await db
      .select({
        maximum: max(projectTechnologies.displayOrder),
      })
      .from(projectTechnologies)
      .where(eq(projectTechnologies.projectId, projectId));

    const displayOrder = (orderResult?.maximum ?? -1) + 1;

    await db.insert(projectTechnologies).values({
      projectId,
      technologyId,
      displayOrder,
    });

    revalidateProjectPaths();

    revalidatePath(`/admin/projects/${projectId}/edit`);

    return {
      ok: true,
      message: "Technology added to project.",
    };
  } catch (error) {
    console.error("Failed to add project technology.", error);

    return {
      ok: false,
      message: "The technology could not be added to the project. Please try again.",
    };
  }
}

export async function updateProjectTechnologyOrderAction(
  projectId: string,
  technologyId: string,
  displayOrder: number,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (
    !z.string().uuid().safeParse(projectId).success ||
    !z.string().uuid().safeParse(technologyId).success
  ) {
    return {
      ok: false,
      message: "The project or technology identifier is invalid.",
    };
  }

  const validation = projectTechnologyOrderSchema.safeParse({
    displayOrder,
  });

  if (!validation.success) {
    return {
      ok: false,
      message: "The technology display order is invalid.",
    };
  }

  try {
    const updated = await db
      .update(projectTechnologies)
      .set({
        displayOrder: validation.data.displayOrder,
      })
      .where(
        and(
          eq(projectTechnologies.projectId, projectId),
          eq(projectTechnologies.technologyId, technologyId),
        ),
      )
      .returning({
        projectId: projectTechnologies.projectId,
      });

    if (updated.length === 0) {
      return {
        ok: false,
        message: "Project technology relationship was not found.",
      };
    }

    revalidateProjectPaths();

    revalidatePath(`/admin/projects/${projectId}/edit`);

    return {
      ok: true,
      message: "Technology order updated.",
    };
  } catch (error) {
    console.error("Failed to update project technology order.", error);

    return {
      ok: false,
      message: "The technology order could not be updated. Please try again.",
    };
  }
}

export async function removeProjectTechnologyAction(
  projectId: string,
  technologyId: string,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (
    !z.string().uuid().safeParse(projectId).success ||
    !z.string().uuid().safeParse(technologyId).success
  ) {
    return {
      ok: false,
      message: "The project or technology identifier is invalid.",
    };
  }

  try {
    const deleted = await db
      .delete(projectTechnologies)
      .where(
        and(
          eq(projectTechnologies.projectId, projectId),
          eq(projectTechnologies.technologyId, technologyId),
        ),
      )
      .returning({
        projectId: projectTechnologies.projectId,
      });

    if (deleted.length === 0) {
      return {
        ok: false,
        message: "Project technology relationship was not found.",
      };
    }

    revalidateProjectPaths();

    revalidatePath(`/admin/projects/${projectId}/edit`);

    return {
      ok: true,
      message: "Technology removed from project.",
    };
  } catch (error) {
    console.error("Failed to remove project technology.", error);

    return {
      ok: false,
      message: "The technology could not be removed from the project. Please try again.",
    };
  }
}

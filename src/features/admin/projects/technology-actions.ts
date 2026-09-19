"use server";

import { count, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminMutationResult } from "@/features/admin/content/types";
import {
  technologyFormSchema,
  type TechnologyFormValues,
} from "@/features/admin/projects/validation";
import { createSlug } from "@/features/admin/projects/utils";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { projectTechnologies, technologies } from "@/server/db/schema";

function revalidateTechnologyPaths() {
  revalidatePath("/admin/projects");

  revalidatePath("/admin/projects/technologies");

  revalidatePath("/admin/dashboard");
}

export async function createTechnologyAction(
  input: TechnologyFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();

  const validation = technologyFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The technology data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;

  const slug = createSlug(values.name);

  if (!slug) {
    return {
      ok: false,
      message: "The technology name cannot be converted into a valid slug.",
    };
  }

  try {
    const [duplicate] = await db
      .select({
        id: technologies.id,
      })
      .from(technologies)
      .where(or(ilike(technologies.name, values.name), eq(technologies.slug, slug)))
      .limit(1);

    if (duplicate) {
      return {
        ok: false,
        message: "A technology with this name or slug already exists.",
      };
    }

    await db.insert(technologies).values({
      name: values.name,
      slug,
    });

    revalidateTechnologyPaths();

    return {
      ok: true,
      message: "Technology created successfully.",
    };
  } catch (error) {
    console.error("Failed to create technology.", error);

    return {
      ok: false,
      message: "The technology could not be created. Please try again.",
    };
  }
}

export async function updateTechnologyAction(
  id: string,
  input: TechnologyFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The technology identifier is invalid.",
    };
  }

  const validation = technologyFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The technology data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;

  const slug = createSlug(values.name);

  if (!slug) {
    return {
      ok: false,
      message: "The technology name cannot be converted into a valid slug.",
    };
  }

  try {
    const duplicates = await db
      .select({
        id: technologies.id,
      })
      .from(technologies)
      .where(or(ilike(technologies.name, values.name), eq(technologies.slug, slug)))
      .limit(2);

    const duplicate = duplicates.find((record) => record.id !== id);

    if (duplicate) {
      return {
        ok: false,
        message: "A technology with this name or slug already exists.",
      };
    }

    const updated = await db
      .update(technologies)
      .set({
        name: values.name,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(technologies.id, id))
      .returning({
        id: technologies.id,
      });

    if (updated.length === 0) {
      return {
        ok: false,
        message: "Technology was not found.",
      };
    }

    revalidateTechnologyPaths();

    return {
      ok: true,
      message: "Technology updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update technology.", error);

    return {
      ok: false,
      message: "The technology could not be updated. Please try again.",
    };
  }
}

export async function deleteTechnologyAction(id: string): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The technology identifier is invalid.",
    };
  }

  try {
    const [usage] = await db
      .select({
        total: count(),
      })
      .from(projectTechnologies)
      .where(eq(projectTechnologies.technologyId, id));

    if ((usage?.total ?? 0) > 0) {
      return {
        ok: false,
        message: "Remove this technology from all projects before deleting it.",
      };
    }

    const deleted = await db.delete(technologies).where(eq(technologies.id, id)).returning({
      id: technologies.id,
    });

    if (deleted.length === 0) {
      return {
        ok: false,
        message: "Technology was not found.",
      };
    }

    revalidateTechnologyPaths();

    return {
      ok: true,
      message: "Technology deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete technology.", error);

    return {
      ok: false,
      message: "The technology could not be deleted. Please try again.",
    };
  }
}

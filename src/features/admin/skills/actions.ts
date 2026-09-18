"use server";

import { and, count, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminMutationResult } from "@/features/admin/content/types";
import { toNullableText } from "@/features/admin/content/utils";
import {
  skillCategoryFormSchema,
  skillFormSchema,
  type SkillCategoryFormValues,
  type SkillFormValues,
} from "@/features/admin/skills/validation";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { skillCategories, skills } from "@/server/db/schema";

function revalidateSkillsPaths() {
  revalidatePath("/admin/skills");
  revalidatePath("/admin/dashboard");
}

function createCategorySlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export async function createSkillCategoryAction(
  input: SkillCategoryFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();

  const validation = skillCategoryFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The skill category data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;
  const slug = createCategorySlug(values.name);

  if (!slug) {
    return {
      ok: false,
      message: "The category name cannot be converted into a valid slug.",
    };
  }

  try {
    const [duplicate] = await db
      .select({
        id: skillCategories.id,
      })
      .from(skillCategories)
      .where(or(ilike(skillCategories.name, values.name), eq(skillCategories.slug, slug)))
      .limit(1);

    if (duplicate) {
      return {
        ok: false,
        message: "A skill category with this name or slug already exists.",
      };
    }

    await db.insert(skillCategories).values({
      name: values.name,
      slug,
      displayOrder: values.displayOrder,
      isVisible: values.isVisible,
    });

    revalidateSkillsPaths();

    return {
      ok: true,
      message: "Skill category created successfully.",
    };
  } catch (error) {
    console.error("Failed to create skill category.", error);

    return {
      ok: false,
      message: "The skill category could not be created. Please try again.",
    };
  }
}

export async function updateSkillCategoryAction(
  id: string,
  input: SkillCategoryFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The skill category identifier is invalid.",
    };
  }

  const validation = skillCategoryFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The skill category data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;
  const slug = createCategorySlug(values.name);

  if (!slug) {
    return {
      ok: false,
      message: "The category name cannot be converted into a valid slug.",
    };
  }

  try {
    const duplicates = await db
      .select({
        id: skillCategories.id,
      })
      .from(skillCategories)
      .where(or(ilike(skillCategories.name, values.name), eq(skillCategories.slug, slug)))
      .limit(2);

    const duplicate = duplicates.find((category) => category.id !== id);

    if (duplicate) {
      return {
        ok: false,
        message: "A skill category with this name or slug already exists.",
      };
    }

    const updated = await db
      .update(skillCategories)
      .set({
        name: values.name,
        slug,
        displayOrder: values.displayOrder,
        isVisible: values.isVisible,
        updatedAt: new Date(),
      })
      .where(eq(skillCategories.id, id))
      .returning({
        id: skillCategories.id,
      });

    if (updated.length === 0) {
      return {
        ok: false,
        message: "Skill category was not found.",
      };
    }

    revalidateSkillsPaths();

    return {
      ok: true,
      message: "Skill category updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update skill category.", error);

    return {
      ok: false,
      message: "The skill category could not be updated. Please try again.",
    };
  }
}

export async function deleteSkillCategoryAction(id: string): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The skill category identifier is invalid.",
    };
  }

  try {
    const [result] = await db
      .select({
        total: count(),
      })
      .from(skills)
      .where(eq(skills.categoryId, id));

    if ((result?.total ?? 0) > 0) {
      return {
        ok: false,
        message: "Move or delete the skills in this category before deleting the category.",
      };
    }

    const deleted = await db.delete(skillCategories).where(eq(skillCategories.id, id)).returning({
      id: skillCategories.id,
    });

    if (deleted.length === 0) {
      return {
        ok: false,
        message: "Skill category was not found.",
      };
    }

    revalidateSkillsPaths();

    return {
      ok: true,
      message: "Skill category deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete skill category.", error);

    return {
      ok: false,
      message: "The skill category could not be deleted. Please try again.",
    };
  }
}

export async function createSkillAction(input: SkillFormValues): Promise<AdminMutationResult> {
  await requireAdmin();

  const validation = skillFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The skill data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;

  try {
    const [category] = await db
      .select({
        id: skillCategories.id,
      })
      .from(skillCategories)
      .where(eq(skillCategories.id, values.categoryId))
      .limit(1);

    if (!category) {
      return {
        ok: false,
        message: "The selected skill category does not exist.",
      };
    }

    const [duplicate] = await db
      .select({
        id: skills.id,
      })
      .from(skills)
      .where(and(eq(skills.categoryId, values.categoryId), ilike(skills.name, values.name)))
      .limit(1);

    if (duplicate) {
      return {
        ok: false,
        message: "This skill already exists in the selected category.",
      };
    }

    await db.insert(skills).values({
      categoryId: values.categoryId,
      name: values.name,
      icon: toNullableText(values.icon),
      displayOrder: values.displayOrder,
      isVisible: values.isVisible,
    });

    revalidateSkillsPaths();

    return {
      ok: true,
      message: "Skill created successfully.",
    };
  } catch (error) {
    console.error("Failed to create skill.", error);

    return {
      ok: false,
      message: "The skill could not be created. Please try again.",
    };
  }
}

export async function updateSkillAction(
  id: string,
  input: SkillFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The skill identifier is invalid.",
    };
  }

  const validation = skillFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The skill data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;

  try {
    const [category] = await db
      .select({
        id: skillCategories.id,
      })
      .from(skillCategories)
      .where(eq(skillCategories.id, values.categoryId))
      .limit(1);

    if (!category) {
      return {
        ok: false,
        message: "The selected skill category does not exist.",
      };
    }

    const duplicates = await db
      .select({
        id: skills.id,
      })
      .from(skills)
      .where(and(eq(skills.categoryId, values.categoryId), ilike(skills.name, values.name)))
      .limit(2);

    const duplicate = duplicates.find((skill) => skill.id !== id);

    if (duplicate) {
      return {
        ok: false,
        message: "This skill already exists in the selected category.",
      };
    }

    const updated = await db
      .update(skills)
      .set({
        categoryId: values.categoryId,
        name: values.name,
        icon: toNullableText(values.icon),
        displayOrder: values.displayOrder,
        isVisible: values.isVisible,
        updatedAt: new Date(),
      })
      .where(eq(skills.id, id))
      .returning({
        id: skills.id,
      });

    if (updated.length === 0) {
      return {
        ok: false,
        message: "Skill was not found.",
      };
    }

    revalidateSkillsPaths();

    return {
      ok: true,
      message: "Skill updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update skill.", error);

    return {
      ok: false,
      message: "The skill could not be updated. Please try again.",
    };
  }
}

export async function deleteSkillAction(id: string): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The skill identifier is invalid.",
    };
  }

  try {
    const deleted = await db.delete(skills).where(eq(skills.id, id)).returning({
      id: skills.id,
    });

    if (deleted.length === 0) {
      return {
        ok: false,
        message: "Skill was not found.",
      };
    }

    revalidateSkillsPaths();

    return {
      ok: true,
      message: "Skill deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete skill.", error);

    return {
      ok: false,
      message: "The skill could not be deleted. Please try again.",
    };
  }
}

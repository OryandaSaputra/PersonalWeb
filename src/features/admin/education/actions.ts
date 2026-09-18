"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminMutationResult } from "@/features/admin/content/types";
import { toNullableText } from "@/features/admin/content/utils";
import {
  educationFormSchema,
  type EducationFormValues,
} from "@/features/admin/education/validation";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { educations } from "@/server/db/schema";

function revalidateEducationPaths() {
  revalidatePath("/admin/education");
  revalidatePath("/admin/dashboard");
}

function buildValues(input: EducationFormValues) {
  return {
    institution: input.institution,
    degree: input.degree,
    major: input.major,
    startYear: input.startYear,
    graduationYear: input.graduationYear,
    gpa: input.gpa,
    gpaScale: input.gpaScale,
    description: toNullableText(input.description),
    displayOrder: input.displayOrder,
    isVisible: input.isVisible,
  };
}

export async function createEducationAction(
  input: EducationFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();
  const validation = educationFormSchema.safeParse(input);
  if (!validation.success) return { ok: false, message: "The education data is invalid." };

  try {
    await db.insert(educations).values(buildValues(validation.data));
    revalidateEducationPaths();
    return { ok: true, message: "Education created successfully." };
  } catch (error) {
    console.error("Failed to create education.", error);
    return { ok: false, message: "The education record could not be created." };
  }
}

export async function updateEducationAction(
  id: string,
  input: EducationFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, message: "The education identifier is invalid." };

  const validation = educationFormSchema.safeParse(input);
  if (!validation.success) return { ok: false, message: "The education data is invalid." };

  try {
    const updated = await db
      .update(educations)
      .set({ ...buildValues(validation.data), updatedAt: new Date() })
      .where(eq(educations.id, id))
      .returning({ id: educations.id });

    if (updated.length === 0) return { ok: false, message: "Education record was not found." };
    revalidateEducationPaths();
    return { ok: true, message: "Education updated successfully." };
  } catch (error) {
    console.error("Failed to update education.", error);
    return { ok: false, message: "The education record could not be updated." };
  }
}

export async function deleteEducationAction(id: string): Promise<AdminMutationResult> {
  await requireAdmin();
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, message: "The education identifier is invalid." };

  try {
    const deleted = await db
      .delete(educations)
      .where(eq(educations.id, id))
      .returning({ id: educations.id });
    if (deleted.length === 0) return { ok: false, message: "Education record was not found." };
    revalidateEducationPaths();
    return { ok: true, message: "Education deleted successfully." };
  } catch (error) {
    console.error("Failed to delete education.", error);
    return { ok: false, message: "The education record could not be deleted." };
  }
}

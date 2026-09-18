"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminMutationResult } from "@/features/admin/content/types";
import { multilineTextToList, toNullableText } from "@/features/admin/content/utils";
import {
  experienceFormSchema,
  type ExperienceFormValues,
} from "@/features/admin/experience/validation";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { experiences } from "@/server/db/schema";

function revalidateExperiencePaths() {
  revalidatePath("/admin/experience");
  revalidatePath("/admin/dashboard");
}

function buildValues(input: ExperienceFormValues) {
  return {
    company: input.company,
    position: input.position,
    employmentType: toNullableText(input.employmentType),
    location: toNullableText(input.location),
    startDate: input.startDate,
    endDate: input.isCurrent ? null : toNullableText(input.endDate),
    isCurrent: input.isCurrent,
    description: toNullableText(input.description),
    responsibilities: multilineTextToList(input.responsibilitiesText),
    technologies: multilineTextToList(input.technologiesText),
    achievements: multilineTextToList(input.achievementsText),
    displayOrder: input.displayOrder,
    isVisible: input.isVisible,
  };
}

export async function createExperienceAction(
  input: ExperienceFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();
  const validation = experienceFormSchema.safeParse(input);
  if (!validation.success) return { ok: false, message: "The experience data is invalid." };

  try {
    await db.insert(experiences).values(buildValues(validation.data));
    revalidateExperiencePaths();
    return { ok: true, message: "Experience created successfully." };
  } catch (error) {
    console.error("Failed to create experience.", error);
    return { ok: false, message: "The experience could not be created." };
  }
}

export async function updateExperienceAction(
  id: string,
  input: ExperienceFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, message: "The experience identifier is invalid." };

  const validation = experienceFormSchema.safeParse(input);
  if (!validation.success) return { ok: false, message: "The experience data is invalid." };

  try {
    const updated = await db
      .update(experiences)
      .set({ ...buildValues(validation.data), updatedAt: new Date() })
      .where(eq(experiences.id, id))
      .returning({ id: experiences.id });

    if (updated.length === 0) return { ok: false, message: "Experience was not found." };
    revalidateExperiencePaths();
    return { ok: true, message: "Experience updated successfully." };
  } catch (error) {
    console.error("Failed to update experience.", error);
    return { ok: false, message: "The experience could not be updated." };
  }
}

export async function deleteExperienceAction(id: string): Promise<AdminMutationResult> {
  await requireAdmin();
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, message: "The experience identifier is invalid." };

  try {
    const deleted = await db
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning({ id: experiences.id });
    if (deleted.length === 0) return { ok: false, message: "Experience was not found." };
    revalidateExperiencePaths();
    return { ok: true, message: "Experience deleted successfully." };
  } catch (error) {
    console.error("Failed to delete experience.", error);
    return { ok: false, message: "The experience could not be deleted." };
  }
}

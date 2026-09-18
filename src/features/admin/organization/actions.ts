"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminMutationResult } from "@/features/admin/content/types";
import { multilineTextToList, toNullableText } from "@/features/admin/content/utils";
import {
  organizationFormSchema,
  type OrganizationFormValues,
} from "@/features/admin/organization/validation";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { organizationExperiences } from "@/server/db/schema";

function revalidateOrganizationPaths() {
  revalidatePath("/admin/organizations");
  revalidatePath("/admin/dashboard");
}

function buildValues(input: OrganizationFormValues) {
  return {
    organization: input.organization,
    position: input.position,
    startDate: input.startDate,
    endDate: input.isCurrent ? null : toNullableText(input.endDate),
    isCurrent: input.isCurrent,
    description: toNullableText(input.description),
    responsibilities: multilineTextToList(input.responsibilitiesText),
    displayOrder: input.displayOrder,
    isVisible: input.isVisible,
  };
}

export async function createOrganizationAction(
  input: OrganizationFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();
  const validation = organizationFormSchema.safeParse(input);
  if (!validation.success) return { ok: false, message: "The organization data is invalid." };

  try {
    await db.insert(organizationExperiences).values(buildValues(validation.data));
    revalidateOrganizationPaths();
    return { ok: true, message: "Organization experience created successfully." };
  } catch (error) {
    console.error("Failed to create organization experience.", error);
    return { ok: false, message: "The organization experience could not be created." };
  }
}

export async function updateOrganizationAction(
  id: string,
  input: OrganizationFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, message: "The organization identifier is invalid." };

  const validation = organizationFormSchema.safeParse(input);
  if (!validation.success) return { ok: false, message: "The organization data is invalid." };

  try {
    const updated = await db
      .update(organizationExperiences)
      .set({ ...buildValues(validation.data), updatedAt: new Date() })
      .where(eq(organizationExperiences.id, id))
      .returning({ id: organizationExperiences.id });

    if (updated.length === 0)
      return { ok: false, message: "Organization experience was not found." };
    revalidateOrganizationPaths();
    return { ok: true, message: "Organization experience updated successfully." };
  } catch (error) {
    console.error("Failed to update organization experience.", error);
    return { ok: false, message: "The organization experience could not be updated." };
  }
}

export async function deleteOrganizationAction(id: string): Promise<AdminMutationResult> {
  await requireAdmin();
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, message: "The organization identifier is invalid." };

  try {
    const deleted = await db
      .delete(organizationExperiences)
      .where(eq(organizationExperiences.id, id))
      .returning({ id: organizationExperiences.id });

    if (deleted.length === 0)
      return { ok: false, message: "Organization experience was not found." };
    revalidateOrganizationPaths();
    return { ok: true, message: "Organization experience deleted successfully." };
  } catch (error) {
    console.error("Failed to delete organization experience.", error);
    return { ok: false, message: "The organization experience could not be deleted." };
  }
}

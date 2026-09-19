"use server";

import { eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminMutationResult } from "@/features/admin/content/types";
import { toNullableText } from "@/features/admin/content/utils";
import {
  certificationFormSchema,
  type CertificationFormValues,
} from "@/features/admin/certifications/validation";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { certifications } from "@/server/db/schema";

function revalidateCertificationPaths() {
  revalidatePath("/admin/certifications");
  revalidatePath("/admin/dashboard");
}

function buildCertificationValues(input: CertificationFormValues) {
  return {
    name: input.name,
    issuer: input.issuer,
    issueDate: toNullableText(input.issueDate),
    expirationDate: toNullableText(input.expirationDate),
    credentialId: toNullableText(input.credentialId),
    credentialUrl: toNullableText(input.credentialUrl),
    displayOrder: input.displayOrder,
    isVisible: input.isVisible,
  };
}

export async function createCertificationAction(
  input: CertificationFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();

  const validation = certificationFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The certification data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;

  try {
    const [duplicate] = await db
      .select({
        id: certifications.id,
      })
      .from(certifications)
      .where(ilike(certifications.name, values.name))
      .limit(1);

    if (duplicate) {
      return {
        ok: false,
        message: "A certification with this name already exists.",
      };
    }

    await db.insert(certifications).values(buildCertificationValues(values));

    revalidateCertificationPaths();

    return {
      ok: true,
      message: "Certification created successfully.",
    };
  } catch (error) {
    console.error("Failed to create certification.", error);

    return {
      ok: false,
      message: "The certification could not be created. Please try again.",
    };
  }
}

export async function updateCertificationAction(
  id: string,
  input: CertificationFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The certification identifier is invalid.",
    };
  }

  const validation = certificationFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      ok: false,
      message: "The certification data is invalid. Review the form and try again.",
    };
  }

  const values = validation.data;

  try {
    const duplicates = await db
      .select({
        id: certifications.id,
      })
      .from(certifications)
      .where(ilike(certifications.name, values.name))
      .limit(2);

    const duplicate = duplicates.find((record) => record.id !== id);

    if (duplicate) {
      return {
        ok: false,
        message: "A certification with this name already exists.",
      };
    }

    const updated = await db
      .update(certifications)
      .set({
        ...buildCertificationValues(values),
        updatedAt: new Date(),
      })
      .where(eq(certifications.id, id))
      .returning({
        id: certifications.id,
      });

    if (updated.length === 0) {
      return {
        ok: false,
        message: "Certification was not found.",
      };
    }

    revalidateCertificationPaths();

    return {
      ok: true,
      message: "Certification updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update certification.", error);

    return {
      ok: false,
      message: "The certification could not be updated. Please try again.",
    };
  }
}

export async function deleteCertificationAction(id: string): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return {
      ok: false,
      message: "The certification identifier is invalid.",
    };
  }

  try {
    const deleted = await db.delete(certifications).where(eq(certifications.id, id)).returning({
      id: certifications.id,
    });

    if (deleted.length === 0) {
      return {
        ok: false,
        message: "Certification was not found.",
      };
    }

    revalidateCertificationPaths();

    return {
      ok: true,
      message: "Certification deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete certification.", error);

    return {
      ok: false,
      message: "The certification could not be deleted. Please try again.",
    };
  }
}

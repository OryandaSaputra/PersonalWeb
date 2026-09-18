"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { AdminMutationResult } from "@/features/admin/content/types";
import { toNullableText } from "@/features/admin/content/utils";
import {
  profileFormSchema,
  socialLinkFormSchema,
  type ProfileFormValues,
  type SocialLinkFormValues,
} from "@/features/admin/profile/validation";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/server/db/client";
import { profiles, socialLinks } from "@/server/db/schema";

function revalidateProfilePaths() {
  revalidatePath("/admin/profile");
  revalidatePath("/admin/dashboard");
}

export async function saveProfileAction(input: ProfileFormValues): Promise<AdminMutationResult> {
  await requireAdmin();

  const validation = profileFormSchema.safeParse(input);
  if (!validation.success) {
    return { ok: false, message: "The profile data is invalid. Review the form and try again." };
  }

  const values = validation.data;
  const payload = {
    fullName: values.fullName,
    professionalTitle: values.professionalTitle,
    shortIntroduction: toNullableText(values.shortIntroduction),
    about: toNullableText(values.about),
    location: toNullableText(values.location),
    email: values.email.toLowerCase(),
    phone: toNullableText(values.phone),
    showPhonePublicly: values.showPhonePublicly,
    careerFocus: toNullableText(values.careerFocus),
    heroTagline: toNullableText(values.heroTagline),
  };

  try {
    await db
      .insert(profiles)
      .values({ id: 1, ...payload })
      .onConflictDoUpdate({
        target: profiles.id,
        set: { ...payload, updatedAt: new Date() },
      });

    revalidateProfilePaths();
    return { ok: true, message: "Profile saved successfully." };
  } catch (error) {
    console.error("Failed to save profile.", error);
    return { ok: false, message: "The profile could not be saved. Please try again." };
  }
}

export async function createSocialLinkAction(
  input: SocialLinkFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();

  const validation = socialLinkFormSchema.safeParse(input);
  if (!validation.success) {
    return { ok: false, message: "The social link data is invalid." };
  }

  const values = validation.data;

  try {
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.id, 1))
      .limit(1);
    if (!profile) {
      return { ok: false, message: "Save the primary profile before adding social links." };
    }

    const platform = values.platform.toLowerCase();
    const [duplicate] = await db
      .select({ id: socialLinks.id })
      .from(socialLinks)
      .where(eq(socialLinks.platform, platform))
      .limit(1);

    if (duplicate) {
      return { ok: false, message: "A social link for this platform already exists." };
    }

    await db.insert(socialLinks).values({
      profileId: 1,
      platform,
      label: values.label,
      url: values.url,
      displayOrder: values.displayOrder,
      isVisible: values.isVisible,
    });

    revalidateProfilePaths();
    return { ok: true, message: "Social link created successfully." };
  } catch (error) {
    console.error("Failed to create social link.", error);
    return { ok: false, message: "The social link could not be created." };
  }
}

export async function updateSocialLinkAction(
  id: string,
  input: SocialLinkFormValues,
): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "The social link identifier is invalid." };
  }

  const validation = socialLinkFormSchema.safeParse(input);
  if (!validation.success) {
    return { ok: false, message: "The social link data is invalid." };
  }

  const values = validation.data;
  const platform = values.platform.toLowerCase();

  try {
    const [duplicate] = await db
      .select({ id: socialLinks.id })
      .from(socialLinks)
      .where(eq(socialLinks.platform, platform))
      .limit(1);

    if (duplicate && duplicate.id !== id) {
      return { ok: false, message: "A social link for this platform already exists." };
    }

    const updated = await db
      .update(socialLinks)
      .set({
        platform,
        label: values.label,
        url: values.url,
        displayOrder: values.displayOrder,
        isVisible: values.isVisible,
        updatedAt: new Date(),
      })
      .where(eq(socialLinks.id, id))
      .returning({ id: socialLinks.id });

    if (updated.length === 0) {
      return { ok: false, message: "Social link was not found." };
    }

    revalidateProfilePaths();
    return { ok: true, message: "Social link updated successfully." };
  } catch (error) {
    console.error("Failed to update social link.", error);
    return { ok: false, message: "The social link could not be updated." };
  }
}

export async function deleteSocialLinkAction(id: string): Promise<AdminMutationResult> {
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, message: "The social link identifier is invalid." };
  }

  try {
    const deleted = await db
      .delete(socialLinks)
      .where(eq(socialLinks.id, id))
      .returning({ id: socialLinks.id });

    if (deleted.length === 0) {
      return { ok: false, message: "Social link was not found." };
    }

    revalidateProfilePaths();
    return { ok: true, message: "Social link deleted successfully." };
  } catch (error) {
    console.error("Failed to delete social link.", error);
    return { ok: false, message: "The social link could not be deleted." };
  }
}

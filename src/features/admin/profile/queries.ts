import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { profiles, socialLinks } from "@/server/db/schema";

export async function getAdminProfile() {
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, 1)).limit(1);
  return profile ?? null;
}

export async function getAdminSocialLinks() {
  return db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.profileId, 1))
    .orderBy(asc(socialLinks.displayOrder), asc(socialLinks.label));
}

export async function getAdminSocialLinkById(id: string) {
  const [link] = await db.select().from(socialLinks).where(eq(socialLinks.id, id)).limit(1);
  return link ?? null;
}

import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { experiences } from "@/server/db/schema";

export async function getAdminExperiences() {
  return db
    .select()
    .from(experiences)
    .orderBy(asc(experiences.displayOrder), desc(experiences.startDate));
}

export async function getAdminExperienceById(id: string) {
  const [record] = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  return record ?? null;
}

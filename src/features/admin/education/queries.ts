import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { educations } from "@/server/db/schema";

export async function getAdminEducations() {
  return db
    .select()
    .from(educations)
    .orderBy(asc(educations.displayOrder), desc(educations.startYear));
}

export async function getAdminEducationById(id: string) {
  const [record] = await db.select().from(educations).where(eq(educations.id, id)).limit(1);
  return record ?? null;
}

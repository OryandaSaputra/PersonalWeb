import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { organizationExperiences } from "@/server/db/schema";

export async function getAdminOrganizations() {
  return db
    .select()
    .from(organizationExperiences)
    .orderBy(asc(organizationExperiences.displayOrder), desc(organizationExperiences.startDate));
}

export async function getAdminOrganizationById(id: string) {
  const [record] = await db
    .select()
    .from(organizationExperiences)
    .where(eq(organizationExperiences.id, id))
    .limit(1);

  return record ?? null;
}

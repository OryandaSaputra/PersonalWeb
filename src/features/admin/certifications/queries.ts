import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { certifications } from "@/server/db/schema";

export async function getAdminCertifications() {
  return db
    .select()
    .from(certifications)
    .orderBy(
      asc(certifications.displayOrder),
      desc(certifications.issueDate),
      asc(certifications.name),
    );
}

export async function getAdminCertificationById(id: string) {
  const [certification] = await db
    .select()
    .from(certifications)
    .where(eq(certifications.id, id))
    .limit(1);

  return certification ?? null;
}

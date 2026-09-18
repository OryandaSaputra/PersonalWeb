import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { skillCategories, skills } from "@/server/db/schema";

export async function getAdminSkillCategories() {
  return db
    .select()
    .from(skillCategories)
    .orderBy(asc(skillCategories.displayOrder), asc(skillCategories.name));
}

export async function getAdminSkillCategoryById(id: string) {
  const [category] = await db
    .select()
    .from(skillCategories)
    .where(eq(skillCategories.id, id))
    .limit(1);

  return category ?? null;
}

export async function getAdminSkills() {
  return db.select().from(skills).orderBy(asc(skills.displayOrder), asc(skills.name));
}

export async function getAdminSkillById(id: string) {
  const [skill] = await db.select().from(skills).where(eq(skills.id, id)).limit(1);

  return skill ?? null;
}

export async function getAdminSkillsPageData() {
  const [categories, skillRecords] = await Promise.all([
    getAdminSkillCategories(),
    getAdminSkills(),
  ]);

  return {
    categories,
    skills: skillRecords,
  };
}

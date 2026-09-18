import "server-only";

import { count, eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/server/db/client";
import {
  certifications,
  contactMessages,
  experiences,
  profiles,
  projects,
  skills,
} from "@/server/db/schema";

export type AdminDashboardSummary = {
  totalProjects: number;
  publishedProjects: number;
  totalExperiences: number;
  totalSkills: number;
  totalCertifications: number;
  unreadMessages: number;
  profileConfigured: boolean;
};

function readCount(
  result: Array<{
    value: number;
  }>,
): number {
  return result[0]?.value ?? 0;
}

export const getAdminDashboardSummary = cache(async (): Promise<AdminDashboardSummary> => {
  const [
    totalProjectsResult,
    publishedProjectsResult,
    totalExperiencesResult,
    totalSkillsResult,
    totalCertificationsResult,
    unreadMessagesResult,
    profileResult,
  ] = await Promise.all([
    db
      .select({
        value: count(),
      })
      .from(projects),

    db
      .select({
        value: count(),
      })
      .from(projects)
      .where(eq(projects.status, "published")),

    db
      .select({
        value: count(),
      })
      .from(experiences),

    db
      .select({
        value: count(),
      })
      .from(skills),

    db
      .select({
        value: count(),
      })
      .from(certifications),

    db
      .select({
        value: count(),
      })
      .from(contactMessages)
      .where(eq(contactMessages.status, "unread")),

    db
      .select({
        id: profiles.id,
      })
      .from(profiles)
      .limit(1),
  ]);

  return {
    totalProjects: readCount(totalProjectsResult),
    publishedProjects: readCount(publishedProjectsResult),
    totalExperiences: readCount(totalExperiencesResult),
    totalSkills: readCount(totalSkillsResult),
    totalCertifications: readCount(totalCertificationsResult),
    unreadMessages: readCount(unreadMessagesResult),
    profileConfigured: profileResult.length > 0,
  };
});

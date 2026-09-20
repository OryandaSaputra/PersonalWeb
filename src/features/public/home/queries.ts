import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { toStringArray } from "@/features/public/home/utils";
import type {
  PublicCertification,
  PublicEducation,
  PublicExperience,
  PublicFeaturedProject,
  PublicHomePageData,
  PublicOrganizationExperience,
  PublicProfile,
  PublicSiteSettings,
  PublicSkillCategory,
  PublicSocialLink,
} from "@/features/public/home/types";
import { db } from "@/server/db/client";
import {
  certifications,
  educations,
  experiences,
  mediaAssets,
  organizationExperiences,
  profiles,
  projectImages,
  projects,
  projectTechnologies,
  siteSettings,
  skillCategories,
  skills,
  socialLinks,
  technologies,
} from "@/server/db/schema";

const FEATURED_PROJECT_LIMIT = 4;

export async function getPublicHomePageData(): Promise<PublicHomePageData> {
  const [profileRows, settingsRows] = await Promise.all([
    db
      .select({
        id: profiles.id,

        fullName: profiles.fullName,

        professionalTitle: profiles.professionalTitle,

        shortIntroduction: profiles.shortIntroduction,

        about: profiles.about,

        location: profiles.location,

        email: profiles.email,

        phone: profiles.phone,

        showPhonePublicly: profiles.showPhonePublicly,

        careerFocus: profiles.careerFocus,

        heroTagline: profiles.heroTagline,

        profileImageMediaId: profiles.profileImageMediaId,

        cvMediaId: profiles.cvMediaId,
      })
      .from(profiles)
      .limit(1),

    db
      .select({
        siteName: siteSettings.siteName,

        siteTagline: siteSettings.siteTagline,

        defaultLanguage: siteSettings.defaultLanguage,

        contactFormEnabled: siteSettings.contactFormEnabled,
      })
      .from(siteSettings)
      .limit(1),
  ]);

  const profileRow = profileRows[0] ?? null;

  const settingsRow = settingsRows[0] ?? null;

  const [
    socialRows,
    experienceRows,
    organizationRows,
    educationRows,
    skillRows,
    certificationRows,
    projectRows,
  ] = await Promise.all([
    profileRow
      ? db
          .select({
            id: socialLinks.id,

            platform: socialLinks.platform,

            label: socialLinks.label,

            url: socialLinks.url,

            displayOrder: socialLinks.displayOrder,
          })
          .from(socialLinks)
          .where(and(eq(socialLinks.profileId, profileRow.id), eq(socialLinks.isVisible, true)))
          .orderBy(asc(socialLinks.displayOrder), asc(socialLinks.label))
      : Promise.resolve([]),

    db
      .select({
        id: experiences.id,

        company: experiences.company,

        position: experiences.position,

        employmentType: experiences.employmentType,

        location: experiences.location,

        startDate: experiences.startDate,

        endDate: experiences.endDate,

        isCurrent: experiences.isCurrent,

        description: experiences.description,

        responsibilities: experiences.responsibilities,

        technologies: experiences.technologies,

        achievements: experiences.achievements,

        displayOrder: experiences.displayOrder,
      })
      .from(experiences)
      .where(eq(experiences.isVisible, true))
      .orderBy(asc(experiences.displayOrder), desc(experiences.startDate)),

    db
      .select({
        id: organizationExperiences.id,

        organization: organizationExperiences.organization,

        position: organizationExperiences.position,

        startDate: organizationExperiences.startDate,

        endDate: organizationExperiences.endDate,

        isCurrent: organizationExperiences.isCurrent,

        description: organizationExperiences.description,

        responsibilities: organizationExperiences.responsibilities,

        displayOrder: organizationExperiences.displayOrder,
      })
      .from(organizationExperiences)
      .where(eq(organizationExperiences.isVisible, true))
      .orderBy(asc(organizationExperiences.displayOrder), desc(organizationExperiences.startDate)),

    db
      .select({
        id: educations.id,

        institution: educations.institution,

        degree: educations.degree,

        major: educations.major,

        startYear: educations.startYear,

        graduationYear: educations.graduationYear,

        gpa: educations.gpa,

        gpaScale: educations.gpaScale,

        description: educations.description,

        displayOrder: educations.displayOrder,
      })
      .from(educations)
      .where(eq(educations.isVisible, true))
      .orderBy(asc(educations.displayOrder), desc(educations.startYear)),

    db
      .select({
        categoryId: skillCategories.id,

        categoryName: skillCategories.name,

        categorySlug: skillCategories.slug,

        categoryDisplayOrder: skillCategories.displayOrder,

        skillId: skills.id,

        skillName: skills.name,

        skillIcon: skills.icon,

        skillDisplayOrder: skills.displayOrder,
      })
      .from(skillCategories)
      .innerJoin(skills, eq(skills.categoryId, skillCategories.id))
      .where(and(eq(skillCategories.isVisible, true), eq(skills.isVisible, true)))
      .orderBy(asc(skillCategories.displayOrder), asc(skills.displayOrder), asc(skills.name)),

    db
      .select({
        id: certifications.id,

        name: certifications.name,

        issuer: certifications.issuer,

        status: certifications.status,

        issueDate: certifications.issueDate,

        expirationDate: certifications.expirationDate,

        credentialId: certifications.credentialId,

        credentialUrl: certifications.credentialUrl,

        certificateMediaId: certifications.certificateMediaId,

        displayOrder: certifications.displayOrder,
      })
      .from(certifications)
      .where(eq(certifications.isVisible, true))
      .orderBy(asc(certifications.displayOrder), asc(certifications.name)),

    db
      .select({
        id: projects.id,

        name: projects.name,

        slug: projects.slug,

        projectType: projects.projectType,

        organization: projects.organization,

        shortDescription: projects.shortDescription,

        role: projects.role,

        repositoryUrl: projects.repositoryUrl,

        liveUrl: projects.liveUrl,

        caseStudyVisibility: projects.caseStudyVisibility,

        displayOrder: projects.displayOrder,

        publishedAt: projects.publishedAt,

        createdAt: projects.createdAt,
      })
      .from(projects)
      .where(and(eq(projects.status, "published"), eq(projects.isFeatured, true)))
      .orderBy(asc(projects.displayOrder), desc(projects.publishedAt), desc(projects.createdAt))
      .limit(FEATURED_PROJECT_LIMIT),
  ]);

  const projectIds = projectRows.map((project) => project.id);

  const certificationMediaIds = certificationRows
    .map((certification) => certification.certificateMediaId)
    .filter((value): value is string => value !== null);

  const profileMediaIds = profileRow
    ? [profileRow.profileImageMediaId, profileRow.cvMediaId].filter(
        (value): value is string => value !== null,
      )
    : [];

  const [projectTechnologyRows, projectCoverRows, certificationMediaRows, profileMediaRows] =
    await Promise.all([
      projectIds.length > 0
        ? db
            .select({
              projectId: projectTechnologies.projectId,

              technologyName: technologies.name,

              displayOrder: projectTechnologies.displayOrder,
            })
            .from(projectTechnologies)
            .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
            .where(inArray(projectTechnologies.projectId, projectIds))
            .orderBy(asc(projectTechnologies.displayOrder), asc(technologies.name))
        : Promise.resolve([]),

      projectIds.length > 0
        ? db
            .select({
              projectId: projectImages.projectId,

              altText: projectImages.altText,

              displayOrder: projectImages.displayOrder,

              createdAt: projectImages.createdAt,

              url: mediaAssets.storageKey,
            })
            .from(projectImages)
            .innerJoin(mediaAssets, eq(projectImages.mediaAssetId, mediaAssets.id))
            .where(
              and(
                inArray(projectImages.projectId, projectIds),
                eq(projectImages.imageType, "cover"),
                eq(mediaAssets.visibility, "public"),
              ),
            )
            .orderBy(asc(projectImages.displayOrder), asc(projectImages.createdAt))
        : Promise.resolve([]),

      certificationMediaIds.length > 0
        ? db
            .select({
              id: mediaAssets.id,

              url: mediaAssets.storageKey,

              mimeType: mediaAssets.mimeType,
            })
            .from(mediaAssets)
            .where(
              and(
                inArray(mediaAssets.id, certificationMediaIds),
                eq(mediaAssets.visibility, "public"),
              ),
            )
        : Promise.resolve([]),

      profileMediaIds.length > 0
        ? db
            .select({
              id: mediaAssets.id,

              url: mediaAssets.storageKey,

              mimeType: mediaAssets.mimeType,
            })
            .from(mediaAssets)
            .where(
              and(inArray(mediaAssets.id, profileMediaIds), eq(mediaAssets.visibility, "public")),
            )
        : Promise.resolve([]),
    ]);

  const profileMediaById = new Map(profileMediaRows.map((media) => [media.id, media]));

  const certificationMediaById = new Map(certificationMediaRows.map((media) => [media.id, media]));

  const technologiesByProjectId = new Map<string, string[]>();

  for (const row of projectTechnologyRows) {
    const current = technologiesByProjectId.get(row.projectId) ?? [];

    current.push(row.technologyName);

    technologiesByProjectId.set(row.projectId, current);
  }

  const coverByProjectId = new Map<
    string,
    {
      url: string;
      altText: string;
    }
  >();

  for (const cover of projectCoverRows) {
    if (!coverByProjectId.has(cover.projectId)) {
      coverByProjectId.set(cover.projectId, {
        url: cover.url,

        altText: cover.altText,
      });
    }
  }

  const categoriesById = new Map<string, PublicSkillCategory>();

  for (const row of skillRows) {
    let category = categoriesById.get(row.categoryId);

    if (!category) {
      category = {
        id: row.categoryId,

        name: row.categoryName,

        slug: row.categorySlug,

        skills: [],
      };

      categoriesById.set(row.categoryId, category);
    }

    category.skills.push({
      id: row.skillId,

      name: row.skillName,

      icon: row.skillIcon,
    });
  }

  const profile: PublicProfile | null = profileRow
    ? {
        fullName: profileRow.fullName,

        professionalTitle: profileRow.professionalTitle,

        shortIntroduction: profileRow.shortIntroduction,

        about: profileRow.about,

        location: profileRow.location,

        email: profileRow.email,

        phone: profileRow.showPhonePublicly ? profileRow.phone : null,

        careerFocus: profileRow.careerFocus,

        heroTagline: profileRow.heroTagline,

        profileImageUrl: profileRow.profileImageMediaId
          ? (() => {
              const media = profileMediaById.get(profileRow.profileImageMediaId);

              return media?.mimeType.startsWith("image/") ? media.url : null;
            })()
          : null,

        cvUrl: profileRow.cvMediaId
          ? (() => {
              const media = profileMediaById.get(profileRow.cvMediaId);

              return media?.mimeType === "application/pdf" ? media.url : null;
            })()
          : null,
      }
    : null;

  const settings: PublicSiteSettings = {
    siteName: settingsRow?.siteName ?? profile?.fullName ?? "Portfolio",

    siteTagline: settingsRow?.siteTagline ?? null,

    defaultLanguage: settingsRow?.defaultLanguage ?? "en",

    contactFormEnabled: settingsRow?.contactFormEnabled ?? false,
  };

  const publicSocialLinks: PublicSocialLink[] = socialRows.map((row) => ({
    id: row.id,

    platform: row.platform,

    label: row.label,

    url: row.url,
  }));

  const publicExperiences: PublicExperience[] = experienceRows.map((row) => ({
    id: row.id,

    company: row.company,

    position: row.position,

    employmentType: row.employmentType,

    location: row.location,

    startDate: row.startDate,

    endDate: row.endDate,

    isCurrent: row.isCurrent,

    description: row.description,

    responsibilities: toStringArray(row.responsibilities),

    technologies: toStringArray(row.technologies),

    achievements: toStringArray(row.achievements),
  }));

  const publicOrganizations: PublicOrganizationExperience[] = organizationRows.map((row) => ({
    id: row.id,

    organization: row.organization,

    position: row.position,

    startDate: row.startDate,

    endDate: row.endDate,

    isCurrent: row.isCurrent,

    description: row.description,

    responsibilities: toStringArray(row.responsibilities),
  }));

  const publicEducations: PublicEducation[] = educationRows.map((row) => ({
    id: row.id,

    institution: row.institution,

    degree: row.degree,

    major: row.major,

    startYear: row.startYear,

    graduationYear: row.graduationYear,

    gpa: row.gpa,

    gpaScale: row.gpaScale,

    description: row.description,
  }));

  const publicCertifications: PublicCertification[] = certificationRows.map((row) => {
    const certificateMedia = row.certificateMediaId
      ? certificationMediaById.get(row.certificateMediaId)
      : undefined;

    return {
      id: row.id,

      name: row.name,

      issuer: row.issuer,

      status: row.status,

      issueDate: row.issueDate,

      expirationDate: row.expirationDate,

      credentialId: row.credentialId,

      credentialUrl: row.credentialUrl,

      certificateImageUrl: certificateMedia?.mimeType.startsWith("image/")
        ? certificateMedia.url
        : null,
    };
  });

  const publicFeaturedProjects: PublicFeaturedProject[] = projectRows.map((row) => ({
    id: row.id,

    name: row.name,

    slug: row.slug,

    projectType: row.projectType,

    organization: row.organization,

    shortDescription: row.shortDescription,

    role: row.role,

    repositoryUrl: row.repositoryUrl,

    liveUrl: row.liveUrl,

    caseStudyVisibility: row.caseStudyVisibility,

    technologies: technologiesByProjectId.get(row.id) ?? [],

    cover: coverByProjectId.get(row.id) ?? null,
  }));

  return {
    settings,
    profile,
    socialLinks: publicSocialLinks,
    skillCategories: Array.from(categoriesById.values()),
    experiences: publicExperiences,
    organizationExperiences: publicOrganizations,
    educations: publicEducations,
    featuredProjects: publicFeaturedProjects,
    certifications: publicCertifications,
  };
}

export type PublicProjectVisibility = "public" | "limited" | "private";

export type PublicProjectImage = {
  id: string;
  imageType: "cover" | "screenshot";
  url: string;
  altText: string;
  caption: string | null;
  displayOrder: number;
};

export type PublicProjectSummary = {
  id: string;
  name: string;
  slug: string;
  projectType: string | null;
  organization: string | null;
  shortDescription: string;
  role: string | null;
  repositoryUrl: string | null;
  liveUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  caseStudyVisibility: PublicProjectVisibility;
  technologies: string[];
  cover: PublicProjectImage | null;
};

export type PublicProjectDetailedSections = {
  background: string | null;
  problem: string | null;
  solution: string | null;
  challenges: string | null;
  learning: string | null;
};

export type PublicProjectCaseStudy = {
  id: string;
  name: string;
  slug: string;
  projectType: string | null;
  organization: string | null;
  shortDescription: string;
  fullDescription: string | null;
  role: string | null;
  keyFeatures: string[];
  repositoryUrl: string | null;
  liveUrl: string | null;
  documentationUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  publishedAt: string | null;
  caseStudyVisibility: "public" | "limited";
  technologies: string[];
  cover: PublicProjectImage | null;
  gallery: PublicProjectImage[];
  details: PublicProjectDetailedSections;
};

export type PublicProjectSeoRecord = {
  name: string;
  shortDescription: string;
  caseStudyVisibility: "public" | "limited";
};

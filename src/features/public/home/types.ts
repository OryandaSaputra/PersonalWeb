export type PublicNavigationItem = {
  label: string;
  href: string;
};

export type PublicSocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
};

export type PublicProfile = {
  fullName: string;
  professionalTitle: string;
  shortIntroduction: string | null;
  about: string | null;
  location: string | null;
  email: string;
  phone: string | null;
  careerFocus: string | null;
  heroTagline: string | null;
  profileImageUrl: string | null;
  cvUrl: string | null;
};

export type PublicSkill = {
  id: string;
  name: string;
  icon: string | null;
};

export type PublicSkillCategory = {
  id: string;
  name: string;
  slug: string;
  skills: PublicSkill[];
};

export type PublicExperience = {
  id: string;
  company: string;
  position: string;
  employmentType: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
};

export type PublicOrganizationExperience = {
  id: string;
  organization: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  responsibilities: string[];
};

export type PublicEducation = {
  id: string;
  institution: string;
  degree: string;
  major: string;
  startYear: number;
  graduationYear: number | null;
  gpa: number | null;
  gpaScale: number;
  description: string | null;
};

export type PublicProjectCover = {
  url: string;
  altText: string;
};

export type PublicFeaturedProject = {
  id: string;
  name: string;
  slug: string;
  projectType: string | null;
  organization: string | null;
  shortDescription: string;
  role: string | null;
  repositoryUrl: string | null;
  liveUrl: string | null;
  caseStudyVisibility: "public" | "limited" | "private";
  technologies: string[];
  cover: PublicProjectCover | null;
};

export type PublicCertification = {
  id: string;
  name: string;
  issuer: string;
  status: string | null;
  issueDate: string | null;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  certificateImageUrl: string | null;
};

export type PublicSiteSettings = {
  siteName: string;
  siteTagline: string | null;
  defaultLanguage: string;
  contactFormEnabled: boolean;
};

export type PublicHomePageData = {
  settings: PublicSiteSettings;
  profile: PublicProfile | null;
  socialLinks: PublicSocialLink[];
  skillCategories: PublicSkillCategory[];
  experiences: PublicExperience[];
  organizationExperiences: PublicOrganizationExperience[];
  educations: PublicEducation[];
  featuredProjects: PublicFeaturedProject[];
  certifications: PublicCertification[];
};

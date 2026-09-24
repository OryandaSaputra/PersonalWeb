import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { ProjectCaseStudyContent } from "@/components/public/projects/project-case-study-content";
import { ProjectCaseStudyHero } from "@/components/public/projects/project-case-study-hero";
import {
  getPublicProjectCaseStudyBySlug,
  getPublicProjectSeoBySlug,
} from "@/features/public/projects/queries";
import { getPublicSiteShellData } from "@/features/public/site/queries";

export const dynamic = "force-dynamic";

type ProjectCaseStudyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const NAVIGATION_ITEMS = [
  {
    label: "Home",
    href: "/#home",
  },
  {
    label: "About",
    href: "/#about",
  },
  {
    label: "Skills",
    href: "/#skills",
  },
  {
    label: "Experience",
    href: "/#experience",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Certifications",
    href: "/#certifications",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

export async function generateMetadata({ params }: ProjectCaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = await getPublicProjectSeoBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} | Project Case Study`,

    description: project.shortDescription,
  };
}

export default async function ProjectCaseStudyPage({ params }: ProjectCaseStudyPageProps) {
  const { slug } = await params;

  const [project, shell] = await Promise.all([
    getPublicProjectCaseStudyBySlug(slug),
    getPublicSiteShellData(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <>
      <PublicHeader siteName={shell.siteName} items={NAVIGATION_ITEMS} homeHref="/#home" />

      <main id="case-study-top">
        <ProjectCaseStudyHero project={project} />

        <ProjectCaseStudyContent project={project} />
      </main>

      <PublicFooter
        siteName={shell.siteName}
        siteTagline={shell.siteTagline}
        socialLinks={shell.socialLinks}
        backToTopHref="#case-study-top"
      />
    </>
  );
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { ProjectCatalog } from "@/components/public/projects/project-catalog";
import { getPublicProjects } from "@/features/public/projects/queries";
import { getPublicSiteShellData } from "@/features/public/site/queries";

export const dynamic = "force-dynamic";

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

export default async function ProjectsPage() {
  const [projects, shell] = await Promise.all([getPublicProjects(), getPublicSiteShellData()]);

  return (
    <>
      <PublicHeader siteName={shell.siteName} items={NAVIGATION_ITEMS} homeHref="/#home" />

      <main id="projects-top" className="min-h-screen">
        <section className="border-b border-border/70 bg-muted/20">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to homepage
            </Link>

            <p className="mt-10 text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              Projects
            </p>

            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              Project work, organized for deeper review.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              Browse published projects by technology, organization, role, or project context.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
            {projects.length > 0 ? (
              <ProjectCatalog projects={projects} />
            ) : (
              <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                <p className="text-lg font-semibold text-foreground">
                  Published projects are currently unavailable.
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Please check back after the next portfolio update.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter
        siteName={shell.siteName}
        siteTagline={shell.siteTagline}
        socialLinks={shell.socialLinks}
        backToTopHref="#projects-top"
      />
    </>
  );
}

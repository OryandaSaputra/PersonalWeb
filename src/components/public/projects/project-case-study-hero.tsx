import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, Code2, FileText } from "lucide-react";
import Link from "next/link";

import type { PublicProjectCaseStudy } from "@/features/public/projects/types";
import { formatProjectDateRange } from "@/features/public/projects/utils";

type ProjectCaseStudyHeroProps = {
  project: PublicProjectCaseStudy;
};

export function ProjectCaseStudyHero({ project }: ProjectCaseStudyHeroProps) {
  const dateRange = formatProjectDateRange(project.startDate, project.endDate);

  return (
    <section className="border-b border-border/70 bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All Projects
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              {project.projectType ? (
                <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {project.projectType}
                </span>
              ) : null}

              {project.caseStudyVisibility === "limited" ? (
                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  Limited Case Study
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              {project.name}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              {project.shortDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
              {project.organization ? (
                <span className="inline-flex items-center gap-2">
                  <Building2 className="size-4" aria-hidden="true" />
                  {project.organization}
                </span>
              ) : null}

              {dateRange ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {dateRange}
                </span>
              ) : null}
            </div>

            {project.role ? (
              <div className="mt-6 max-w-2xl rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  My Role
                </p>
                <p className="mt-2 text-sm leading-6 font-medium text-foreground">{project.role}</p>
              </div>
            ) : null}

            {project.technologies.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border ring-inset"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            ) : null}

            {project.repositoryUrl || project.liveUrl || project.documentationUrl ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.repositoryUrl ? (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Code2 className="size-4" aria-hidden="true" />
                    Repository
                  </a>
                ) : null}

                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    Live Project
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : null}

                {project.documentationUrl ? (
                  <a
                    href={project.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <FileText className="size-4" aria-hidden="true" />
                    Documentation
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card">
            <div className="aspect-[16/10] bg-muted">
              {project.cover ? (
                <div
                  role="img"
                  aria-label={project.cover.altText}
                  className="size-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${project.cover.url}")`,
                  }}
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-background">
                  <Code2 className="size-12 text-primary/60" aria-hidden="true" />
                </div>
              )}
            </div>

            {project.cover?.caption ? (
              <p className="border-t border-border px-5 py-4 text-sm leading-6 text-muted-foreground">
                {project.cover.caption}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

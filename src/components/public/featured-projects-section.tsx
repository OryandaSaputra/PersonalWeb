import { ArrowUpRight, Code2, ImageIcon } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import type { PublicFeaturedProject } from "@/features/public/home/types";

type FeaturedProjectsSectionProps = {
  projects: PublicFeaturedProject[];
};

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="scroll-mt-24 border-b border-border/70 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Selected work built around real problems."
          description="A focused selection of published projects. Detailed case studies are introduced in the next portfolio stage."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-[1.75rem] border border-border bg-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-muted">
                {project.cover ? (
                  <div
                    role="img"
                    aria-label={project.cover.altText}
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.025]"
                    style={{
                      backgroundImage: `url("${project.cover.url}")`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-background">
                    <div className="text-center">
                      <ImageIcon className="mx-auto size-10 text-primary/60" aria-hidden="true" />

                      <p className="mt-3 text-sm font-medium text-muted-foreground">
                        Project visual
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 left-4 inline-flex rounded-full border border-white/15 bg-background/85 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-xl">
                  Featured {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                  {project.projectType ? (
                    <span className="rounded-full border border-border px-3 py-1">
                      {project.projectType}
                    </span>
                  ) : null}

                  {project.organization ? (
                    <span className="rounded-full border border-border px-3 py-1">
                      {project.organization}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
                  {project.name}
                </h3>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {project.shortDescription}
                </p>

                {project.role ? (
                  <div className="mt-5">
                    <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Role
                    </p>

                    <p className="mt-2 text-sm font-medium text-foreground">{project.role}</p>
                  </div>
                ) : null}

                {project.technologies.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                ) : null}

                {project.repositoryUrl || project.liveUrl ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.repositoryUrl ? (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Live Project
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { ArrowUpRight, Code2, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { PublicProjectSummary } from "@/features/public/projects/types";
import {
  formatProjectDateRange,
  normalizeProjectSearchValue,
} from "@/features/public/projects/utils";

type ProjectCatalogProps = {
  projects: PublicProjectSummary[];
};

export function ProjectCatalog({ projects }: ProjectCatalogProps) {
  const [query, setQuery] = useState("");

  const [technology, setTechnology] = useState("all");

  const technologies = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((project) => project.technologies))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [projects],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeProjectSearchValue(query);

    return projects.filter((project) => {
      const matchesTechnology = technology === "all" || project.technologies.includes(technology);

      if (!matchesTechnology) {
        return false;
      }

      if (normalizedQuery.length === 0) {
        return true;
      }

      const haystack = normalizeProjectSearchValue(
        [
          project.name,
          project.projectType ?? "",
          project.organization ?? "",
          project.shortDescription,
          project.role ?? "",
          ...project.technologies,
        ].join(" "),
      );

      return haystack.includes(normalizedQuery);
    });
  }, [projects, query, technology]);

  const hasActiveFilter = query.trim().length > 0 || technology !== "all";

  function clearFilters() {
    setQuery("");
    setTechnology("all");
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_18rem_auto] lg:items-end">
          <div className="space-y-2">
            <label htmlFor="projectSearch" className="text-sm font-medium text-foreground">
              Search projects
            </label>

            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <input
                id="projectSearch"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, organization, stack, or role"
                className="h-11 w-full rounded-xl border border-input bg-background pr-4 pl-10 text-sm text-foreground transition outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="projectTechnology" className="text-sm font-medium text-foreground">
              Technology
            </label>

            <select
              id="projectTechnology"
              value={technology}
              onChange={(event) => setTechnology(event.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground transition outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All technologies</option>

              {technologies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilter}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="size-4" aria-hidden="true" />
            Clear
          </button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
          <span className="font-semibold text-foreground">{projects.length}</span> published
          projects.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-14 text-center">
          <p className="text-base font-semibold text-foreground">
            No projects match the current filters.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">Try another keyword or technology.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filtered.map((project) => {
            const dateRange = formatProjectDateRange(project.startDate, project.endDate);

            const canOpenCaseStudy = project.caseStudyVisibility !== "private";

            return (
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
                      <Code2 className="size-10 text-primary/60" aria-hidden="true" />
                    </div>
                  )}
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

                    {dateRange ? (
                      <span className="rounded-full border border-border px-3 py-1">
                        {dateRange}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {project.name}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {project.shortDescription}
                  </p>

                  {project.role ? (
                    <p className="mt-5 text-sm">
                      <span className="font-semibold text-foreground">Role:</span>{" "}
                      <span className="text-muted-foreground">{project.role}</span>
                    </p>
                  ) : null}

                  {project.technologies.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {canOpenCaseStudy ? (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        View Case Study
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    ) : null}

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
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Live Project
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

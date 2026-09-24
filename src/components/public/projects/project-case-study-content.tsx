import { CheckCircle2, Lightbulb, Puzzle, Target, Wrench } from "lucide-react";
import type { ReactNode } from "react";

import { ProjectGallery } from "@/components/public/projects/project-gallery";
import type { PublicProjectCaseStudy } from "@/features/public/projects/types";

type ProjectCaseStudyContentProps = {
  project: PublicProjectCaseStudy;
};

export function ProjectCaseStudyContent({ project }: ProjectCaseStudyContentProps) {
  const isLimited = project.caseStudyVisibility === "limited";

  const hasDetailedSections = Boolean(
    project.details.background ||
    project.details.problem ||
    project.details.solution ||
    project.details.challenges ||
    project.details.learning,
  );

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Case Study</p>

        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
          Project overview
        </h2>

        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {isLimited
            ? "This project is published with a limited case study. Only selected public-safe information is shown."
            : "A structured breakdown of the project context, approach, implementation, and lessons learned."}
        </p>

        {project.keyFeatures.length > 0 ? (
          <div className="mt-8">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Key Features
            </p>

            <ul className="mt-4 space-y-3">
              {project.keyFeatures.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      <div className="space-y-16">
        <section aria-labelledby="overview-heading" className="space-y-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Overview
            </p>

            <h2
              id="overview-heading"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground"
            >
              What this project is about
            </h2>
          </div>

          <p className="text-base leading-8 text-muted-foreground sm:text-lg">
            {project.fullDescription ?? project.shortDescription}
          </p>
        </section>

        {!isLimited && hasDetailedSections ? (
          <div className="space-y-12">
            {project.details.background ? (
              <CaseStudyTextSection
                eyebrow="Context"
                title="Background"
                icon={<Target className="size-5" aria-hidden="true" />}
                content={project.details.background}
              />
            ) : null}

            {project.details.problem ? (
              <CaseStudyTextSection
                eyebrow="Challenge"
                title="Problem"
                icon={<Puzzle className="size-5" aria-hidden="true" />}
                content={project.details.problem}
              />
            ) : null}

            {project.details.solution ? (
              <CaseStudyTextSection
                eyebrow="Approach"
                title="Solution"
                icon={<Wrench className="size-5" aria-hidden="true" />}
                content={project.details.solution}
              />
            ) : null}

            {project.details.challenges ? (
              <CaseStudyTextSection
                eyebrow="Implementation"
                title="Challenges"
                icon={<Puzzle className="size-5" aria-hidden="true" />}
                content={project.details.challenges}
              />
            ) : null}

            {project.details.learning ? (
              <CaseStudyTextSection
                eyebrow="Reflection"
                title="What I learned"
                icon={<Lightbulb className="size-5" aria-hidden="true" />}
                content={project.details.learning}
              />
            ) : null}
          </div>
        ) : null}

        {!isLimited && project.gallery.length > 0 ? (
          <ProjectGallery images={project.gallery} />
        ) : null}
      </div>
    </div>
  );
}

type CaseStudyTextSectionProps = {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  content: string;
};

function CaseStudyTextSection({ eyebrow, title, icon, content }: CaseStudyTextSectionProps) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>

        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            {eyebrow}
          </p>

          <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">{title}</h3>
        </div>
      </div>

      <div className="mt-5 space-y-4 text-base leading-8 text-muted-foreground">
        {content
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
      </div>
    </section>
  );
}

import { GraduationCap } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import type { PublicEducation } from "@/features/public/home/types";

type EducationSectionProps = {
  educations: PublicEducation[];
};

export function EducationSection({ educations }: EducationSectionProps) {
  if (educations.length === 0) {
    return null;
  }

  return (
    <section
      id="education"
      className="scroll-mt-24 border-b border-border/70 bg-muted/25 py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Education"
          title="Academic foundation."
          description="Formal education that supports the technical and problem-solving approach behind the work."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {educations.map((education) => (
            <article
              key={education.id}
              className="rounded-2xl border border-border bg-background p-6 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="size-5" aria-hidden="true" />
                </span>

                <div>
                  <p className="text-sm font-medium text-primary">{education.institution}</p>

                  <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                    {education.degree} — {education.major}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {education.startYear} — {education.graduationYear ?? "Present"}
                  </p>
                </div>
              </div>

              {education.gpa !== null ? (
                <div className="mt-5 inline-flex rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm">
                  <span className="text-muted-foreground">GPA</span>

                  <span className="ml-2 font-semibold text-foreground">
                    {education.gpa}/{education.gpaScale}
                  </span>
                </div>
              ) : null}

              {education.description ? (
                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  {education.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

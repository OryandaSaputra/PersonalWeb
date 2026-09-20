import { Braces } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import type { PublicSkillCategory } from "@/features/public/home/types";

type SkillsSectionProps = {
  categories: PublicSkillCategory[];
};

export function SkillsSection({ categories }: SkillsSectionProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      id="skills"
      className="scroll-mt-24 border-b border-border/70 bg-muted/25 py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="A practical technology stack."
          description="Grouped by discipline rather than arbitrary proficiency percentages."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-2xl border border-border bg-background p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Braces className="size-5" aria-hidden="true" />
                </span>

                <h3 className="font-display text-lg font-semibold text-foreground">
                  {category.name}
                </h3>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

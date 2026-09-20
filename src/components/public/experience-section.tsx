import { Building2, CalendarDays, MapPin, UsersRound } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import type { PublicExperience, PublicOrganizationExperience } from "@/features/public/home/types";
import { formatDateRange } from "@/features/public/home/utils";

type ExperienceSectionProps = {
  experiences: PublicExperience[];
  organizations: PublicOrganizationExperience[];
};

export function ExperienceSection({ experiences, organizations }: ExperienceSectionProps) {
  if (experiences.length === 0 && organizations.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="scroll-mt-24 border-b border-border/70 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="Work shaped by real operational needs."
          description="Professional and organizational experience presented for fast recruiter scanning."
        />

        {experiences.length > 0 ? (
          <div className="mt-12 space-y-5">
            {experiences.map((experience) => (
              <article
                key={experience.id}
                className="grid gap-6 rounded-2xl border border-border bg-card p-6 sm:p-7 lg:grid-cols-[0.34fr_0.66fr]"
              >
                <div>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="size-5" aria-hidden="true" />
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                    {experience.position}
                  </h3>

                  <p className="mt-1 font-medium text-primary">{experience.company}</p>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 shrink-0" aria-hidden="true" />

                      {formatDateRange(
                        experience.startDate,
                        experience.endDate,
                        experience.isCurrent,
                      )}
                    </p>

                    {experience.location ? (
                      <p className="flex items-center gap-2">
                        <MapPin className="size-4 shrink-0" aria-hidden="true" />

                        {experience.location}
                      </p>
                    ) : null}

                    {experience.employmentType ? <p>{experience.employmentType}</p> : null}
                  </div>
                </div>

                <div className="space-y-5">
                  {experience.description ? (
                    <p className="leading-7 text-muted-foreground">{experience.description}</p>
                  ) : null}

                  {experience.responsibilities.length > 0 ? (
                    <ul className="space-y-2">
                      {experience.responsibilities.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                          />

                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {experience.achievements.length > 0 ? (
                    <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                        Highlights
                      </p>

                      <ul className="mt-3 space-y-2">
                        {experience.achievements.map((achievement) => (
                          <li key={achievement} className="text-sm leading-6 text-foreground">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {experience.technologies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {organizations.length > 0 ? (
          <div className="mt-16">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersRound className="size-5" aria-hidden="true" />
              </span>

              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  Leadership
                </p>

                <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
                  Organization Experience
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {organizations.map((organization) => (
                <article
                  key={organization.id}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <p className="text-sm font-medium text-primary">{organization.organization}</p>

                  <h4 className="mt-2 font-display text-lg font-semibold text-foreground">
                    {organization.position}
                  </h4>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatDateRange(
                      organization.startDate,
                      organization.endDate,
                      organization.isCurrent,
                    )}
                  </p>

                  {organization.description ? (
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {organization.description}
                    </p>
                  ) : null}

                  {organization.responsibilities.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {organization.responsibilities.map((responsibility) => (
                        <li
                          key={responsibility}
                          className="flex gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                          />
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

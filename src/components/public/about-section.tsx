import { Code2, MapPin, Target } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import type { PublicProfile } from "@/features/public/home/types";

type AboutSectionProps = {
  profile: PublicProfile;
};

export function AboutSection({ profile }: AboutSectionProps) {
  const hasSupportingInfo = Boolean(profile.careerFocus || profile.location);

  if (!profile.about && !hasSupportingInfo) {
    return null;
  }

  return (
    <section id="about" className="scroll-mt-24 border-b border-border/70 py-24 sm:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <SectionHeading
          eyebrow="About"
          title="Engineering with a practical point of view."
          description="A concise look at the background and professional direction behind the work."
        />

        <div className="space-y-8">
          {profile.about ? (
            <div className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              {profile.about
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph} className="mb-5 last:mb-0">
                    {paragraph}
                  </p>
                ))}
            </div>
          ) : null}

          {hasSupportingInfo ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.careerFocus ? (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="size-5" aria-hidden="true" />
                  </div>

                  <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Career focus
                  </p>

                  <p className="mt-2 leading-6 font-medium text-foreground">
                    {profile.careerFocus}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Code2 className="size-5" aria-hidden="true" />
                  </div>

                  <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Professional field
                  </p>

                  <p className="mt-2 leading-6 font-medium text-foreground">
                    {profile.professionalTitle}
                  </p>
                </div>
              )}

              {profile.location ? (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="size-5" aria-hidden="true" />
                  </div>

                  <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Based in
                  </p>

                  <p className="mt-2 leading-6 font-medium text-foreground">{profile.location}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

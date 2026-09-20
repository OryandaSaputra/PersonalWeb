import { ArrowDownRight, ArrowUpRight, Download, MapPin } from "lucide-react";

import { getInitials } from "@/features/public/home/utils";
import type { PublicProfile, PublicSocialLink } from "@/features/public/home/types";

type HeroSectionProps = {
  profile: PublicProfile;
  socialLinks: PublicSocialLink[];
  hasFeaturedProjects: boolean;
};

export function HeroSection({ profile, socialLinks, hasFeaturedProjects }: HeroSectionProps) {
  const primaryHref = hasFeaturedProjects ? "#projects" : "#contact";

  const primaryLabel = hasFeaturedProjects ? "View Projects" : "Contact Me";

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-border/70"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-55 dark:opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent 88%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl sm:size-[42rem]"
      />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {profile.heroTagline ? (
              <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                {profile.heroTagline}
              </span>
            ) : null}

            {profile.location ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" />

                {profile.location}
              </span>
            ) : null}
          </div>

          <p className="mt-7 text-sm font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            {profile.professionalTitle}
          </p>

          <h1
            id="hero-heading"
            className="mt-4 max-w-4xl font-display text-5xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl"
          >
            Building useful digital products with clarity and purpose.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {profile.shortIntroduction ?? profile.careerFocus ?? profile.professionalTitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={primaryHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {primaryLabel}

              <ArrowDownRight className="size-4" aria-hidden="true" />
            </a>

            {profile.cvUrl ? (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Download className="size-4" aria-hidden="true" />
                Download CV
              </a>
            ) : (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Contact Me
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>

          {socialLinks.length > 0 ? (
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              {socialLinks.slice(0, 5).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {link.label}

                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-[2.25rem] border border-primary/15 bg-primary/5 blur-[1px]"
          />

          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-2xl shadow-foreground/5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-muted">
              {profile.profileImageUrl ? (
                <div
                  role="img"
                  aria-label={`Professional portrait of ${profile.fullName}`}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${profile.profileImageUrl}")`,
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-background to-muted">
                  <span className="font-display text-7xl font-semibold tracking-tight text-primary/70">
                    {getInitials(profile.fullName)}
                  </span>
                </div>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent"
              />

              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-background/80 p-4 shadow-lg backdrop-blur-xl">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  Current focus
                </p>

                <p className="mt-2 text-sm leading-6 font-medium text-foreground">
                  {profile.careerFocus ?? profile.professionalTitle}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-10 -left-4 hidden rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur-xl sm:block">
            <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              Professional focus
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {profile.professionalTitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

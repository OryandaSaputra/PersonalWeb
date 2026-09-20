import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import type { PublicProfile, PublicSocialLink } from "@/features/public/home/types";

type ContactCtaSectionProps = {
  profile: PublicProfile;
  socialLinks: PublicSocialLink[];
};

export function ContactCtaSection({ profile, socialLinks }: ContactCtaSectionProps) {
  return (
    <section id="contact" className="scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-foreground p-7 text-background shadow-2xl shadow-foreground/10 sm:p-10 lg:p-14 dark:bg-card dark:text-foreground">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-primary/30 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 size-72 rounded-full bg-primary/20 blur-3xl"
          />

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
                Contact
              </p>

              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Interested in working together?
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 opacity-75 sm:text-lg">
                Reach out for web development, software engineering, or professional collaboration
                opportunities.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {profile.email}
                </a>

                {profile.phone ? (
                  <a
                    href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {profile.phone}
                  </a>
                ) : null}

                {profile.location ? (
                  <span className="inline-flex items-center gap-2 opacity-75">
                    <MapPin className="size-4" aria-hidden="true" />
                    {profile.location}
                  </span>
                ) : null}
              </div>
            </div>

            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Start a conversation
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          {socialLinks.length > 0 ? (
            <div className="mt-10 border-t border-current/15 pt-6">
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

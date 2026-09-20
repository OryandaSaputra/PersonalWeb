import { ArrowUpRight, Award, CalendarDays } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import type { PublicCertification } from "@/features/public/home/types";
import { formatCertificationDate } from "@/features/public/home/utils";

type CertificationsSectionProps = {
  certifications: PublicCertification[];
};

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <section
      id="certifications"
      className="scroll-mt-24 border-b border-border/70 bg-muted/25 py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Certifications"
          title="Credentials that complement the engineering profile."
          description="Visible certifications managed directly from the private Admin CMS."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {certifications.map((certification) => {
            const issueDate = formatCertificationDate(certification.issueDate);

            const expirationDate = formatCertificationDate(certification.expirationDate);

            return (
              <article
                key={certification.id}
                className="overflow-hidden rounded-2xl border border-border bg-background"
              >
                {certification.certificateImageUrl ? (
                  <div
                    role="img"
                    aria-label={`${certification.name} certificate`}
                    className="aspect-[16/9] border-b border-border bg-muted bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${certification.certificateImageUrl}")`,
                    }}
                  />
                ) : null}

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Award className="size-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {certification.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-primary">
                        {certification.issuer}
                      </p>
                    </div>
                  </div>

                  {issueDate || expirationDate ? (
                    <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="size-4 shrink-0" aria-hidden="true" />

                      {issueDate ? `Issued ${issueDate}` : "Issue date not listed"}

                      {expirationDate ? ` · Expires ${expirationDate}` : ""}
                    </p>
                  ) : null}

                  {certification.status ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Status:{" "}
                      <span className="font-medium text-foreground">{certification.status}</span>
                    </p>
                  ) : null}

                  {certification.credentialId ? (
                    <p className="mt-3 text-xs break-all text-muted-foreground">
                      Credential ID: {certification.credentialId}
                    </p>
                  ) : null}

                  {certification.credentialUrl ? (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      View credential
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

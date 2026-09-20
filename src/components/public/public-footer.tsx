import { ArrowUp, ArrowUpRight } from "lucide-react";

import type { PublicSocialLink } from "@/features/public/home/types";

type PublicFooterProps = {
  siteName: string;
  siteTagline: string | null;
  socialLinks: PublicSocialLink[];
};

export function PublicFooter({ siteName, siteTagline, socialLinks }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
        <div>
          <p className="font-display text-lg font-semibold text-foreground">{siteName}</p>

          {siteTagline ? (
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{siteTagline}</p>
          ) : null}

          <p className="mt-4 text-xs text-muted-foreground">
            © {currentYear} {siteName}. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          {socialLinks.slice(0, 5).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {link.label}

              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          ))}

          <a
            href="#home"
            aria-label="Back to top"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

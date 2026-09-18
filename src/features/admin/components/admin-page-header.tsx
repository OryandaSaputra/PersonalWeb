import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between", className)}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

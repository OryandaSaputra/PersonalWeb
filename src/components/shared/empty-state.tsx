import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: LucideIcon;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

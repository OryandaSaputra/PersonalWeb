import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "The requested content could not be loaded. Please try again.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/5 p-8 text-center",
        className,
      )}
      role="alert"
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <TriangleAlert className="size-5" aria-hidden="true" />
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

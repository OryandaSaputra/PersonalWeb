import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  rows?: number;
  className?: string;
  label?: string;
};

export function LoadingState({
  rows = 3,
  className,
  label = "Loading content",
}: LoadingStateProps) {
  return (
    <div className={cn("space-y-4", className)} role="status" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}</span>

      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="rounded-xl border border-border bg-card p-5" aria-hidden="true">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

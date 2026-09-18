import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedAdminLoading() {
  return (
    <div className="space-y-10" role="status" aria-live="polite" aria-label="Loading Admin content">
      <span className="sr-only">Loading Admin content</span>

      <div className="space-y-3" aria-hidden="true">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
        {Array.from(
          {
            length: 6,
          },
          (_, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="w-full space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-3 w-36" />
                </div>

                <Skeleton className="size-10 shrink-0 rounded-xl" />
              </div>
            </div>
          ),
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2" aria-hidden="true">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type DashboardStatCardProps = {
  label: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
};

export function DashboardStatCard({
  label,
  value,
  description,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>

            <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</p>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
          </div>

          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DashboardQuickActionProps = {
  title: string;
  description: string;
  availabilityLabel: string;
  icon: LucideIcon;
  href?: string;
  actionLabel?: string;
};

export function DashboardQuickAction({
  title,
  description,
  availabilityLabel,
  icon: Icon,
  href,
  actionLabel = "Open",
}: DashboardQuickActionProps) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-base font-semibold">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>

        {href ? (
          <Button asChild variant="outline" className="mt-5 w-full justify-between">
            <Link href={href}>
              <span>{actionLabel}</span>
              <span className="text-xs font-normal">Available</span>
            </Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" className="mt-5 w-full justify-between" disabled>
            <span>Coming soon</span>
            <span className="text-xs font-normal">{availabilityLabel}</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

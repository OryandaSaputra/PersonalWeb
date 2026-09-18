"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAVIGATION_GROUPS } from "@/features/admin/navigation";
import { cn } from "@/lib/utils";

type AdminNavigationProps = {
  onNavigate?: () => void;
};

export function AdminNavigation({ onNavigate }: AdminNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-7" aria-label="Admin navigation">
      {ADMIN_NAVIGATION_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {group.label}
          </p>

          <ul className="mt-2 space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  {item.available ? (
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />

                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    </Link>
                  ) : (
                    <div
                      className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/70"
                      aria-disabled="true"
                      title={`${item.label} is not available yet.`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />

                      <span className="min-w-0 flex-1 truncate">{item.label}</span>

                      {item.availabilityLabel ? (
                        <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-[0.625rem] font-semibold text-muted-foreground">
                          {item.availabilityLabel}
                        </span>
                      ) : null}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

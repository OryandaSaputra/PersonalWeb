"use client";

import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AdminMobileMenu } from "@/features/admin/components/admin-mobile-menu";
import { getAdminPageTitle } from "@/features/admin/navigation";

type AdminHeaderProps = {
  adminEmail: string;
};

export function AdminHeader({ adminEmail }: AdminHeaderProps) {
  const pathname = usePathname();
  const pageTitle = getAdminPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-5 sm:px-6 lg:px-8">
        <AdminMobileMenu adminEmail={adminEmail} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold sm:text-base">{pageTitle}</p>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Private portfolio administration
          </p>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}

import type { ReactNode } from "react";

import { AdminHeader } from "@/features/admin/components/admin-header";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { requireAdmin } from "@/server/auth/guards";

type ProtectedAdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-dvh bg-muted/20 text-foreground">
      <a
        href="#admin-main-content"
        className="sr-only z-[100] rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to Admin content
      </a>

      <AdminSidebar adminEmail={admin.email} />

      <div className="min-w-0 lg:pl-72">
        <AdminHeader adminEmail={admin.email} />

        <main
          id="admin-main-content"
          tabIndex={-1}
          className="min-w-0 px-5 py-8 sm:px-6 lg:px-8 lg:py-10"
        >
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

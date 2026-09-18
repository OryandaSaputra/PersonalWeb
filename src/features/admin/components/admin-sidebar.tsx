import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AdminLogoutForm } from "@/features/admin/components/admin-logout-form";
import { AdminNavigation } from "@/features/admin/components/admin-navigation";

type AdminSidebarProps = {
  adminEmail: string;
};

export function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-card lg:flex lg:flex-col">
      <div className="flex h-20 shrink-0 items-center border-b border-border px-6">
        <Link
          href="/admin/dashboard"
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground shadow-sm">
            OS
          </span>

          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-semibold">
              Oryanda Portfolio
            </span>

            <span className="mt-0.5 block text-xs text-muted-foreground">Admin Workspace</span>
          </span>
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <AdminNavigation />
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <div className="mb-3 rounded-xl border border-border bg-muted/40 p-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground">Private Admin</p>

              <p className="mt-1 truncate text-xs text-muted-foreground" title={adminEmail}>
                {adminEmail}
              </p>
            </div>
          </div>
        </div>

        <AdminLogoutForm />
      </div>
    </aside>
  );
}

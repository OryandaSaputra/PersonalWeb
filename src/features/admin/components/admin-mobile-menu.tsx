"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminLogoutForm } from "@/features/admin/components/admin-logout-form";
import { AdminNavigation } from "@/features/admin/components/admin-navigation";

type AdminMobileMenuProps = {
  adminEmail: string;
};

export function AdminMobileMenu({ adminEmail }: AdminMobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Open Admin navigation"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 h-dvh w-[min(22rem,calc(100%-2rem))] max-w-none translate-x-0 translate-y-0 grid-rows-[auto_1fr_auto] gap-0 rounded-none border-y-0 border-l-0 p-0 data-[state=closed]:-translate-x-full data-[state=closed]:scale-100 data-[state=open]:translate-x-0 data-[state=open]:scale-100 sm:max-w-none"
      >
        <DialogHeader className="flex h-20 flex-row items-center justify-between gap-4 border-b border-border px-5 text-left">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
              OS
            </span>

            <div className="min-w-0">
              <DialogTitle className="truncate text-sm">Oryanda Portfolio</DialogTitle>

              <DialogDescription className="mt-0.5 text-xs">Admin Workspace</DialogDescription>
            </div>
          </div>

          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close Admin navigation">
              <X className="size-5" aria-hidden="true" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-4 py-6">
          <AdminNavigation onNavigate={() => setOpen(false)} />
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 rounded-xl border border-border bg-muted/40 p-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-semibold">Private Admin</p>

                <p className="mt-1 truncate text-xs text-muted-foreground" title={adminEmail}>
                  {adminEmail}
                </p>
              </div>
            </div>
          </div>

          <AdminLogoutForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

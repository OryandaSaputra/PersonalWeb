"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { cn } from "@/lib/utils";

type AdminLogoutFormProps = {
  className?: string;
};

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      className="w-full justify-start text-muted-foreground hover:text-foreground"
      disabled={pending}
    >
      <LogOut className="size-4" aria-hidden="true" />

      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}

export function AdminLogoutForm({ className }: AdminLogoutFormProps) {
  return (
    <form action={logoutAction} className={cn("w-full", className)}>
      <LogoutSubmitButton />
    </form>
  );
}

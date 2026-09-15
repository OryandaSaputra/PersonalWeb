"use client";

import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { useActionState } from "react";

import { loginAction } from "@/features/auth/actions/auth-actions";
import { initialLoginActionState } from "@/features/auth/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialLoginActionState);

  const emailErrorId = state.fieldErrors?.email ? "admin-email-error" : undefined;

  const passwordErrorId = state.fieldErrors?.password ? "admin-password-error" : undefined;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.formError ? (
        <Alert variant="destructive">
          <LockKeyhole aria-hidden="true" />
          <AlertTitle>Unable to sign in</AlertTitle>
          <AlertDescription>{state.formError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="admin-email">Email</Label>

        <div className="relative">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            defaultValue={state.values.email}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={emailErrorId}
            className="pl-10"
            disabled={isPending}
          />
        </div>

        {state.fieldErrors?.email ? (
          <p id="admin-email-error" className="text-sm text-destructive">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password">Password</Label>

        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby={passwordErrorId}
            className="pl-10"
            disabled={isPending}
          />
        </div>

        {state.fieldErrors?.password ? (
          <p id="admin-password-error" className="text-sm text-destructive">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        <LogIn className="size-4" aria-hidden="true" />

        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

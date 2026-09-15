import { CheckCircle2, LogOut, ShieldCheck } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { requireAdmin } from "@/server/auth/guards";

export default async function AdminAuthenticationVerifiedPage() {
  const admin = await requireAdmin();

  return (
    <main className="min-h-screen bg-background py-12 text-foreground">
      <Container size="content">
        <div className="mx-auto max-w-2xl">
          <Badge variant="success">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Authenticated
          </Badge>

          <Card className="surface-elevated mt-5">
            <CardHeader>
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>

              <CardTitle className="text-2xl">Authentication verified</CardTitle>

              <CardDescription>
                The private Admin security boundary is working. The production Admin Dashboard
                interface will be implemented in Stage 5.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Signed in as
                </p>

                <p className="mt-2 font-medium break-all">{admin.email}</p>
              </div>

              <form action={logoutAction}>
                <Button type="submit" variant="outline">
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign out
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}

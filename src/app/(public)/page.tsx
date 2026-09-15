import { CircleCheck, CircleHelp, Info, TriangleAlert } from "lucide-react";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Container className="py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline">Stage 3 Verification</Badge>

            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Oryanda Portfolio Design System
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Temporary interface for validating typography, semantic colors, reusable components,
              theme behavior, accessibility states, and responsive foundations.
            </p>
          </div>

          <ThemeToggle />
        </div>

        <div className="space-y-20 py-12 sm:py-16">
          <Reveal>
            <section aria-labelledby="colors-heading">
              <SectionHeading
                eyebrow="Foundation"
                title="Semantic color system"
                description="Components consume semantic tokens instead of embedding brand colors throughout the application."
              />

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ColorCard name="Primary" className="bg-primary text-primary-foreground" />
                <ColorCard name="Secondary" className="bg-secondary text-secondary-foreground" />
                <ColorCard name="Accent" className="bg-accent text-accent-foreground" />
                <ColorCard name="Muted" className="bg-muted text-muted-foreground" />
              </div>
            </section>
          </Reveal>

          <Separator />

          <Reveal delay={0.05}>
            <section aria-labelledby="typography-heading">
              <SectionHeading
                eyebrow="Typography"
                title="Professional hierarchy"
                description="Manrope provides display personality while Inter keeps body copy and interface text highly readable."
              />

              <Card className="mt-8">
                <CardContent className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Display
                    </p>
                    <p className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                      Full-Stack Web Developer
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Body
                    </p>
                    <p className="mt-2 max-w-3xl text-base leading-7 text-muted-foreground">
                      The portfolio uses a restrained typographic system designed for recruiter
                      scanning, professional project storytelling, and long-form case studies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </Reveal>

          <Separator />

          <Reveal delay={0.05}>
            <section aria-labelledby="controls-heading">
              <SectionHeading
                eyebrow="Components"
                title="Buttons and status badges"
                description="Shared variants keep actions and content states visually consistent across Public and Admin areas."
              />

              <div className="mt-8 flex flex-wrap gap-3">
                <Button>Primary action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge>Published</Badge>
                <Badge variant="secondary">Draft</Badge>
                <Badge variant="outline">Hidden</Badge>
                <Badge variant="success">Available</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="destructive">Error</Badge>
              </div>
            </section>
          </Reveal>

          <Separator />

          <Reveal delay={0.05}>
            <section aria-labelledby="form-heading">
              <SectionHeading
                eyebrow="Forms"
                title="Accessible field foundation"
                description="Form primitives establish consistent dimensions, focus states, disabled states, and invalid-state styling."
              />

              <Card className="mt-8 max-w-2xl">
                <CardHeader>
                  <CardTitle>Example portfolio field</CardTitle>
                  <CardDescription>
                    This is only a visual foundation. React Hook Form and Zod integration will be
                    added when actual forms are implemented.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="design-system-title">Professional title</Label>
                    <Input
                      id="design-system-title"
                      name="design-system-title"
                      placeholder="Full-Stack Web Developer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="design-system-description">Description</Label>
                    <Textarea
                      id="design-system-description"
                      name="design-system-description"
                      placeholder="Write a concise professional description..."
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          </Reveal>

          <Separator />

          <Reveal delay={0.05}>
            <section aria-labelledby="feedback-heading">
              <SectionHeading
                eyebrow="Feedback"
                title="System feedback"
                description="Status feedback uses consistent semantic colors without relying on browser alert dialogs."
              />

              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <Alert variant="info">
                  <Info aria-hidden="true" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    Supporting information can be presented without interrupting the user.
                  </AlertDescription>
                </Alert>

                <Alert variant="success">
                  <CircleCheck aria-hidden="true" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Successful operations will receive clear and accessible feedback.
                  </AlertDescription>
                </Alert>

                <Alert variant="warning">
                  <CircleHelp aria-hidden="true" />
                  <AlertTitle>Attention required</AlertTitle>
                  <AlertDescription>
                    Warnings remain visually different from destructive errors.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <TriangleAlert aria-hidden="true" />
                  <AlertTitle>Action failed</AlertTitle>
                  <AlertDescription>
                    Error messages explain the problem without exposing sensitive server details.
                  </AlertDescription>
                </Alert>
              </div>
            </section>
          </Reveal>

          <Separator />

          <Reveal delay={0.05}>
            <section aria-labelledby="dialog-heading">
              <SectionHeading
                eyebrow="Overlay"
                title="Accessible dialog foundation"
                description="Dialogs use Radix primitives for focus management, keyboard behavior, and accessible structure."
              />

              <div className="mt-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open example dialog</Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm portfolio action</DialogTitle>
                      <DialogDescription>
                        This component will later be reused for destructive confirmations and
                        focused Admin interactions.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <Button variant="outline">Secondary action</Button>
                      <Button>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </section>
          </Reveal>

          <Separator />

          <Reveal delay={0.05}>
            <section id="states" aria-labelledby="states-heading">
              <SectionHeading
                eyebrow="Application States"
                title="Loading, empty, and error states"
                description="Shared states prevent each feature from inventing a different feedback pattern."
              />

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Loading</CardTitle>
                    <CardDescription>Placeholder content while data is loading.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LoadingState rows={2} />
                  </CardContent>
                </Card>

                <EmptyState
                  title="No projects yet"
                  description="When content is missing, Admin will show a clear empty state instead of a blank screen."
                  action={<Button size="sm">Add project</Button>}
                />

                <ErrorState
                  title="Unable to load data"
                  description="Errors provide useful recovery guidance without leaking implementation details."
                  action={
                    <Button size="sm" variant="outline">
                      Try again
                    </Button>
                  }
                />
              </div>
            </section>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}

type ColorCardProps = {
  name: string;
  className: string;
};

function ColorCard({ name, className }: ColorCardProps) {
  return (
    <div className={`flex min-h-32 items-end rounded-xl border border-border p-4 ${className}`}>
      <span className="text-sm font-semibold">{name}</span>
    </div>
  );
}

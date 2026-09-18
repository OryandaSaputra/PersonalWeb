import {
  Award,
  BriefcaseBusiness,
  CircleCheck,
  CircleDashed,
  FileUp,
  FolderKanban,
  Mail,
  PencilLine,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DashboardQuickAction } from "@/features/admin/components/dashboard-quick-action";
import { DashboardStatCard } from "@/features/admin/components/dashboard-stat-card";
import { getAdminDashboardSummary } from "@/features/admin/dashboard/queries";

export default async function AdminDashboardPage() {
  const summary = await getAdminDashboardSummary();

  const readinessItems = [
    {
      label: "Professional profile",
      ready: summary.profileConfigured,
      detail: summary.profileConfigured
        ? "Profile data is available."
        : "Profile data has not been added yet.",
    },
    {
      label: "Professional experience",
      ready: summary.totalExperiences > 0,
      detail:
        summary.totalExperiences > 0
          ? `${summary.totalExperiences} experience record(s) available.`
          : "No experience record has been added yet.",
    },
    {
      label: "Skills",
      ready: summary.totalSkills > 0,
      detail:
        summary.totalSkills > 0
          ? `${summary.totalSkills} skill record(s) available.`
          : "No skill record has been added yet.",
    },
    {
      label: "Published projects",
      ready: summary.publishedProjects > 0,
      detail:
        summary.publishedProjects > 0
          ? `${summary.publishedProjects} project(s) are published.`
          : "No project is published yet.",
    },
    {
      label: "Certifications",
      ready: summary.totalCertifications > 0,
      detail:
        summary.totalCertifications > 0
          ? `${summary.totalCertifications} certification record(s) available.`
          : "No certification record has been added yet.",
    },
  ];

  return (
    <div className="space-y-10">
      <AdminPageHeader
        eyebrow="Portfolio Overview"
        title="Dashboard"
        description="Review the current portfolio content state from one private workspace. Counts below are read directly from the development database."
        actions={
          <Badge variant="success">
            <CircleCheck className="size-3.5" aria-hidden="true" />
            Protected Admin
          </Badge>
        }
      />

      <section aria-labelledby="dashboard-summary-heading" className="space-y-5">
        <div>
          <h2
            id="dashboard-summary-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Content summary
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Current record counts in Neon PostgreSQL.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DashboardStatCard
            label="Projects"
            value={summary.totalProjects}
            description={`${summary.publishedProjects} published`}
            icon={FolderKanban}
          />

          <DashboardStatCard
            label="Experience"
            value={summary.totalExperiences}
            description="Professional experience records"
            icon={BriefcaseBusiness}
          />

          <DashboardStatCard
            label="Skills"
            value={summary.totalSkills}
            description="Technical skill records"
            icon={Sparkles}
          />

          <DashboardStatCard
            label="Certifications"
            value={summary.totalCertifications}
            description="Professional credentials"
            icon={Award}
          />

          <DashboardStatCard
            label="Unread Messages"
            value={summary.unreadMessages}
            description="Contact messages awaiting review"
            icon={Mail}
          />

          <DashboardStatCard
            label="Profile"
            value={summary.profileConfigured ? "Configured" : "Not set"}
            description="Primary professional profile"
            icon={UserRound}
          />
        </div>
      </section>

      <Separator />

      <section
        aria-labelledby="content-readiness-heading"
        className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]"
      >
        <Card>
          <CardHeader>
            <CardTitle id="content-readiness-heading">Content readiness</CardTitle>

            <CardDescription>
              A factual view of which portfolio content areas currently contain data.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="divide-y divide-border">
              {readinessItems.map((item) => (
                <li key={item.label} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                  {item.ready ? (
                    <CircleCheck
                      className="mt-0.5 size-5 shrink-0 text-success"
                      aria-hidden="true"
                    />
                  ) : (
                    <CircleDashed
                      className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stage 5 scope</CardTitle>

            <CardDescription>
              The dashboard is ready, while content editing is intentionally deferred to the
              relevant CMS stages.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-medium">Available now</p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Secure Admin login, protected workspace, navigation, dashboard summaries, theme
                controls, and logout.
              </p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium">Added next</p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Profile, experience, organization, and education management begin in Stage 6.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section aria-labelledby="quick-actions-heading" className="space-y-5">
        <div>
          <h2
            id="quick-actions-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Planned high-frequency actions are shown now and will become active with their
            corresponding CMS stages.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardQuickAction
            title="Edit Profile"
            description="Manage professional identity, introduction, about content, location, contact information, and profile data."
            availabilityLabel="Stage 6"
            icon={PencilLine}
          />

          <DashboardQuickAction
            title="Add Project"
            description="Create a professional project case study with publishing status, role, solution, technologies, and project details."
            availabilityLabel="Stage 8"
            icon={Plus}
          />

          <DashboardQuickAction
            title="Upload CV"
            description="Replace the public downloadable CV through the private media management workflow."
            availabilityLabel="Stage 9"
            icon={FileUp}
          />
        </div>
      </section>
    </div>
  );
}

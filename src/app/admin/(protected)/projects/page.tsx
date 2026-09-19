import { Cpu, ExternalLink, FolderKanban, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { deleteProjectAction } from "@/features/admin/projects/project-actions";
import { getAdminProjectsPageData } from "@/features/admin/projects/queries";

function statusVariant(status: string): "success" | "secondary" | "outline" {
  if (status === "published") {
    return "success";
  }

  if (status === "hidden") {
    return "secondary";
  }

  return "outline";
}

export default async function AdminProjectsPage() {
  const projects = await getAdminProjectsPageData();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio Content"
        title="Projects"
        description="Manage portfolio projects, publication state, case studies, and technology stacks."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/projects/technologies">
                <Cpu className="size-4" aria-hidden="true" />
                Technologies
              </Link>
            </Button>

            <Button asChild>
              <Link href="/admin/projects/new">
                <Plus className="size-4" aria-hidden="true" />
                Add project
              </Link>
            </Button>
          </>
        }
      />

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <FolderKanban className="mx-auto size-7 text-muted-foreground" />

          <h2 className="mt-4 font-display text-lg font-semibold">No projects yet</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add your first professional project or run the Stage 8 initial seed.
          </p>

          <Button asChild className="mt-5">
            <Link href="/admin/projects/new">Add project</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => {
            const deleteAction = deleteProjectAction.bind(null, project.id);

            return (
              <Card key={project.id} className="gap-0 py-0">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-lg font-semibold">{project.name}</h2>

                        <Badge variant={statusVariant(project.status)}>{project.status}</Badge>

                        <Badge variant="outline">{project.caseStudyVisibility} case study</Badge>

                        {project.isFeatured ? <Badge variant="success">Featured</Badge> : null}
                      </div>

                      {project.organization ? (
                        <p className="mt-1 text-sm font-medium text-primary">
                          {project.organization}
                        </p>
                      ) : null}

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                        {project.shortDescription}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        <span>
                          Stack: {project.technologyCount} technolog
                          {project.technologyCount === 1 ? "y" : "ies"}
                        </span>

                        <span>Order: {project.displayOrder}</span>

                        <span className="break-all">Slug: {project.slug}</span>
                      </div>

                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Live project
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
                      </Button>

                      <DeleteRecordButton itemLabel={project.name} action={deleteAction} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

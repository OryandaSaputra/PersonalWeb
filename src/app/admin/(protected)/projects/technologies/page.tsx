import { ArrowLeft, Cpu, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { getAdminTechnologies } from "@/features/admin/projects/queries";
import { deleteTechnologyAction } from "@/features/admin/projects/technology-actions";

export default async function AdminTechnologiesPage() {
  const technologies = await getAdminTechnologies();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Projects"
        title="Technologies"
        description="Manage reusable technology labels used by portfolio projects."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/projects">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Projects
              </Link>
            </Button>

            <Button asChild>
              <Link href="/admin/projects/technologies/new">
                <Plus className="size-4" aria-hidden="true" />
                Add technology
              </Link>
            </Button>
          </>
        }
      />

      {technologies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Cpu className="mx-auto size-7 text-muted-foreground" />

          <h2 className="mt-4 font-display text-lg font-semibold">No technologies yet</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add reusable technologies before assigning them to projects.
          </p>

          <Button asChild className="mt-5">
            <Link href="/admin/projects/technologies/new">Add technology</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {technologies.map((technology) => {
            const deleteAction = deleteTechnologyAction.bind(null, technology.id);

            return (
              <Card key={technology.id} className="gap-0 py-0">
                <CardContent className="p-5">
                  <h2 className="font-display font-semibold">{technology.name}</h2>

                  <p className="mt-1 text-xs break-all text-muted-foreground">{technology.slug}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/projects/technologies/${technology.id}/edit`}>Edit</Link>
                    </Button>

                    <DeleteRecordButton itemLabel={technology.name} action={deleteAction} />
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

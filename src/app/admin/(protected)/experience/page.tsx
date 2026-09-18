import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { deleteExperienceAction } from "@/features/admin/experience/actions";
import { getAdminExperiences } from "@/features/admin/experience/queries";

export default async function AdminExperiencePage() {
  const records = await getAdminExperiences();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio Content"
        title="Experience"
        description="Manage professional work and internship experience."
        actions={
          <Button asChild>
            <Link href="/admin/experience/new">
              <Plus className="size-4" aria-hidden="true" />
              Add experience
            </Link>
          </Button>
        }
      />

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-display text-lg font-semibold">No experience records</p>
          <Button asChild className="mt-5">
            <Link href="/admin/experience/new">Add experience</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => {
            const deleteAction = deleteExperienceAction.bind(null, record.id);
            return (
              <Card key={record.id} className="gap-0 py-0">
                <CardContent className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">{record.position}</h2>
                      <Badge variant={record.isVisible ? "success" : "secondary"}>
                        {record.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-primary">{record.company}</p>
                    <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="size-4" aria-hidden="true" />
                      {record.startDate} —{" "}
                      {record.isCurrent ? "Present" : (record.endDate ?? "Not specified")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/experience/${record.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteRecordButton
                      itemLabel={`${record.position} at ${record.company}`}
                      action={deleteAction}
                    />
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

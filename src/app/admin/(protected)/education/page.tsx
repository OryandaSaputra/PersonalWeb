import { GraduationCap, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { deleteEducationAction } from "@/features/admin/education/actions";
import { getAdminEducations } from "@/features/admin/education/queries";

export default async function AdminEducationPage() {
  const records = await getAdminEducations();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio Content"
        title="Education"
        description="Manage formal education records."
        actions={
          <Button asChild>
            <Link href="/admin/education/new">
              <Plus className="size-4" aria-hidden="true" />
              Add education
            </Link>
          </Button>
        }
      />

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <GraduationCap className="mx-auto size-6 text-muted-foreground" />
          <h2 className="mt-4 font-display text-lg font-semibold">No education records</h2>
          <Button asChild className="mt-5">
            <Link href="/admin/education/new">Add education</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => {
            const deleteAction = deleteEducationAction.bind(null, record.id);
            return (
              <Card key={record.id} className="gap-0 py-0">
                <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">{record.institution}</h2>
                      <Badge variant={record.isVisible ? "success" : "secondary"}>
                        {record.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium text-primary">
                      {record.degree} — {record.major}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {record.startYear} — {record.graduationYear ?? "Present"}
                    </p>
                    {record.gpa !== null ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        GPA {record.gpa} / {record.gpaScale}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/education/${record.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteRecordButton itemLabel={record.institution} action={deleteAction} />
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

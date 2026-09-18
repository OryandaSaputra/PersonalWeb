import { Plus, UsersRound } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { deleteOrganizationAction } from "@/features/admin/organization/actions";
import { getAdminOrganizations } from "@/features/admin/organization/queries";

export default async function AdminOrganizationsPage() {
  const records = await getAdminOrganizations();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio Content"
        title="Organizations"
        description="Manage organization and leadership experience."
        actions={
          <Button asChild>
            <Link href="/admin/organizations/new">
              <Plus className="size-4" aria-hidden="true" />
              Add organization
            </Link>
          </Button>
        }
      />

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <UsersRound className="mx-auto size-6 text-muted-foreground" />
          <h2 className="mt-4 font-display text-lg font-semibold">No organization experience</h2>
          <Button asChild className="mt-5">
            <Link href="/admin/organizations/new">Add organization</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => {
            const deleteAction = deleteOrganizationAction.bind(null, record.id);
            return (
              <Card key={record.id} className="gap-0 py-0">
                <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">{record.position}</h2>
                      <Badge variant={record.isVisible ? "success" : "secondary"}>
                        {record.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-primary">{record.organization}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {record.startDate} —{" "}
                      {record.isCurrent ? "Present" : (record.endDate ?? "Not specified")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/organizations/${record.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteRecordButton
                      itemLabel={`${record.position} at ${record.organization}`}
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

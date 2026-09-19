import { Award, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { deleteCertificationAction } from "@/features/admin/certifications/actions";
import { getAdminCertifications } from "@/features/admin/certifications/queries";

export default async function AdminCertificationsPage() {
  const certifications = await getAdminCertifications();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio Content"
        title="Certifications"
        description="Manage professional certifications and credential metadata."
        actions={
          <Button asChild>
            <Link href="/admin/certifications/new">
              <Plus className="size-4" aria-hidden="true" />
              Add certification
            </Link>
          </Button>
        }
      />

      {certifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Award className="mx-auto size-7 text-muted-foreground" />

          <h2 className="mt-4 font-display text-lg font-semibold">No certifications yet</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add your first professional certification.
          </p>

          <Button asChild className="mt-5">
            <Link href="/admin/certifications/new">Add certification</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {certifications.map((certification) => {
            const deleteAction = deleteCertificationAction.bind(null, certification.id);

            return (
              <Card key={certification.id} className="gap-0 py-0">
                <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">{certification.name}</h2>

                      <Badge variant={certification.isVisible ? "success" : "secondary"}>
                        {certification.isVisible ? "Visible" : "Hidden"}
                      </Badge>

                      {certification.status ? (
                        <Badge variant="outline">{certification.status}</Badge>
                      ) : null}
                    </div>

                    <p className="mt-1 text-sm font-medium text-primary">{certification.issuer}</p>

                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <p>Issued: {certification.issueDate ?? "Not specified"}</p>

                      <p>Expires: {certification.expirationDate ?? "Not specified"}</p>

                      {certification.credentialId ? (
                        <p>Credential ID: {certification.credentialId}</p>
                      ) : null}

                      {certification.credentialUrl ? (
                        <a
                          href={certification.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex max-w-full items-center gap-1 text-primary hover:underline"
                        >
                          <span className="truncate">View credential</span>

                          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/certifications/${certification.id}/edit`}>Edit</Link>
                    </Button>

                    <DeleteRecordButton itemLabel={certification.name} action={deleteAction} />
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

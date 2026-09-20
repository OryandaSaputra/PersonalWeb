import { ExternalLink, FileImage } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { deleteUnusedMediaAction } from "@/features/admin/media/actions";
import { SingleMediaManager } from "@/features/admin/media/components/single-media-manager";
import { formatFileSize } from "@/features/admin/media/config";
import { getAdminMediaOverview } from "@/features/admin/media/queries";

export default async function AdminMediaPage() {
  const data = await getAdminMediaOverview();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="System"
        title="Media"
        description="Manage portfolio files stored in Vercel Blob and review media usage."
      />

      {!data.profile ? (
        <Alert variant="destructive">
          <AlertTitle>Profile is required</AlertTitle>

          <AlertDescription>
            Create the profile record before uploading a profile image or CV.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <SingleMediaManager
                kind="profile-image"
                title="Profile photo"
                description="Professional portrait used as the primary Hero visual."
                current={data.profileImage}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <SingleMediaManager
                kind="cv"
                title="CV PDF"
                description="Current CV that will power the public Download CV action."
                current={data.cv}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Media registry</CardTitle>
        </CardHeader>

        <CardContent>
          {data.assets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <FileImage className="mx-auto size-7 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">No media assets yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.assets.map((asset) => {
                const deleteAction = deleteUnusedMediaAction.bind(null, asset.id);

                return (
                  <div
                    key={asset.id}
                    className="flex flex-col gap-4 rounded-xl border border-border p-4 lg:flex-row lg:items-start lg:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium break-all">{asset.originalFilename}</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {asset.mimeType} · {formatFileSize(asset.sizeBytes)} · {asset.provider}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline">{asset.visibility}</Badge>

                        {asset.usages.length > 0 ? (
                          asset.usages.map((usage) => (
                            <Badge key={usage} variant="secondary">
                              {usage}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">Unused</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <a href={asset.storageKey} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-4" aria-hidden="true" />
                          Open
                        </a>
                      </Button>

                      {asset.usages.length === 0 ? (
                        <DeleteRecordButton
                          itemLabel={asset.originalFilename}
                          action={deleteAction}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { deleteSocialLinkAction } from "@/features/admin/profile/actions";
import { ProfileForm } from "@/features/admin/profile/components/profile-form";
import { getAdminProfile, getAdminSocialLinks } from "@/features/admin/profile/queries";
import type { ProfileFormValues } from "@/features/admin/profile/validation";

export default async function AdminProfilePage() {
  const [profile, links] = await Promise.all([getAdminProfile(), getAdminSocialLinks()]);

  const defaultValues: ProfileFormValues = {
    fullName: profile?.fullName ?? "",
    professionalTitle: profile?.professionalTitle ?? "",
    shortIntroduction: profile?.shortIntroduction ?? "",
    about: profile?.about ?? "",
    location: profile?.location ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    showPhonePublicly: profile?.showPhonePublicly ?? false,
    careerFocus: profile?.careerFocus ?? "",
    heroTagline: profile?.heroTagline ?? "",
  };

  return (
    <div className="space-y-10">
      <AdminPageHeader
        eyebrow="Portfolio Content"
        title="Profile"
        description="Manage the primary professional identity used throughout the public portfolio."
      />

      <Card>
        <CardHeader>
          <CardTitle>Professional profile</CardTitle>
          <CardDescription>Profile photo and CV media remain deferred to Stage 9.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultValues={defaultValues} />
        </CardContent>
      </Card>

      <Separator />

      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Social links</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage professional destinations such as LinkedIn and GitHub.
            </p>
          </div>
          {profile ? (
            <Button asChild>
              <Link href="/admin/profile/social-links/new">
                <Plus className="size-4" aria-hidden="true" />
                Add social link
              </Link>
            </Button>
          ) : (
            <Button disabled>Save profile first</Button>
          )}
        </div>

        {links.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-medium">No social links yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => {
              const deleteAction = deleteSocialLinkAction.bind(null, link.id);
              return (
                <Card key={link.id} className="gap-0 py-0">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{link.label}</p>
                        <Badge variant={link.isVisible ? "success" : "secondary"}>
                          {link.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex max-w-full items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/profile/social-links/${link.id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteRecordButton itemLabel={link.label} action={deleteAction} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

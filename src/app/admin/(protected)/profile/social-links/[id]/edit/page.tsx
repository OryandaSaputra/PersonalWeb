import { notFound } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SocialLinkForm } from "@/features/admin/profile/components/social-link-form";
import { getAdminSocialLinkById } from "@/features/admin/profile/queries";

type Props = { params: Promise<{ id: string }> };

export default async function EditSocialLinkPage({ params }: Props) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const link = await getAdminSocialLinkById(id);
  if (!link) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Profile"
        title={`Edit ${link.label}`}
        description="Update the professional social link and visibility."
      />
      <Card>
        <CardHeader>
          <CardTitle>Social link details</CardTitle>
        </CardHeader>
        <CardContent>
          <SocialLinkForm
            mode="edit"
            socialLinkId={link.id}
            defaultValues={{
              platform: link.platform,
              label: link.label,
              url: link.url,
              displayOrder: link.displayOrder,
              isVisible: link.isVisible,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

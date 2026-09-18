import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SocialLinkForm } from "@/features/admin/profile/components/social-link-form";

export default function NewSocialLinkPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Profile"
        title="Add social link"
        description="Add a professional destination for the public portfolio."
      />
      <Card>
        <CardHeader>
          <CardTitle>Social link details</CardTitle>
        </CardHeader>
        <CardContent>
          <SocialLinkForm
            mode="create"
            defaultValues={{ platform: "", label: "", url: "", displayOrder: 0, isVisible: true }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

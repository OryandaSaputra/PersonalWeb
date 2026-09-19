import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { CertificationForm } from "@/features/admin/certifications/components/certification-form";

export default function NewCertificationPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Certifications"
        title="Add certification"
        description="Create professional certification metadata."
      />

      <Card>
        <CardHeader>
          <CardTitle>Certification details</CardTitle>
        </CardHeader>

        <CardContent>
          <CertificationForm
            mode="create"
            defaultValues={{
              name: "",
              issuer: "",
              issueDate: "",
              expirationDate: "",
              credentialId: "",
              credentialUrl: "",
              displayOrder: 0,
              isVisible: true,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

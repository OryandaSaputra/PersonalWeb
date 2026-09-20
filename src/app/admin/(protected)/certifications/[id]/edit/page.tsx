import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { CertificationForm } from "@/features/admin/certifications/components/certification-form";
import { getAdminCertificationById } from "@/features/admin/certifications/queries";

type EditCertificationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCertificationPage({ params }: EditCertificationPageProps) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    notFound();
  }

  const certification = await getAdminCertificationById(id);

  if (!certification) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Certifications"
        title="Edit certification"
        description={certification.name}
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/certifications/${certification.id}/media`}>
              <ImageIcon className="size-4" aria-hidden="true" />
              Certificate image
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Certification details</CardTitle>
        </CardHeader>

        <CardContent>
          <CertificationForm
            mode="edit"
            certificationId={certification.id}
            defaultValues={{
              name: certification.name,
              issuer: certification.issuer,
              issueDate: certification.issueDate ?? "",
              expirationDate: certification.expirationDate ?? "",
              credentialId: certification.credentialId ?? "",
              credentialUrl: certification.credentialUrl ?? "",
              displayOrder: certification.displayOrder,
              isVisible: certification.isVisible,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

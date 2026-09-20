import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SingleMediaManager } from "@/features/admin/media/components/single-media-manager";
import { getCertificationMediaPageData } from "@/features/admin/media/queries";

type CertificationMediaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CertificationMediaPage({ params }: CertificationMediaPageProps) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    notFound();
  }

  const data = await getCertificationMediaPageData(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Certifications"
        title="Certificate image"
        description={data.certification.name}
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/certifications/${id}/edit`}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to certification
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <SingleMediaManager
            kind="certification-image"
            targetId={data.certification.id}
            title="Certificate image"
            description="Upload a readable image of the certificate for the Certifications section."
            current={data.media}
          />
        </CardContent>
      </Card>
    </div>
  );
}

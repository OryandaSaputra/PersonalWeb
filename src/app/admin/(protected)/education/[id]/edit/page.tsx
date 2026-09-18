import { notFound } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { EducationForm } from "@/features/admin/education/components/education-form";
import { getAdminEducationById } from "@/features/admin/education/queries";

type Props = { params: Promise<{ id: string }> };

export default async function EditEducationPage({ params }: Props) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const record = await getAdminEducationById(id);
  if (!record) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Education"
        title="Edit education"
        description={record.institution}
      />
      <Card>
        <CardHeader>
          <CardTitle>Education details</CardTitle>
        </CardHeader>
        <CardContent>
          <EducationForm
            mode="edit"
            educationId={record.id}
            defaultValues={{
              institution: record.institution,
              degree: record.degree,
              major: record.major,
              startYear: record.startYear,
              graduationYear: record.graduationYear,
              gpa: record.gpa,
              gpaScale: record.gpaScale,
              description: record.description ?? "",
              displayOrder: record.displayOrder,
              isVisible: record.isVisible,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

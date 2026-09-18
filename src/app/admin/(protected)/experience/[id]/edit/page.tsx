import { notFound } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { listToMultilineText } from "@/features/admin/content/utils";
import { ExperienceForm } from "@/features/admin/experience/components/experience-form";
import { getAdminExperienceById } from "@/features/admin/experience/queries";

type Props = { params: Promise<{ id: string }> };

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const record = await getAdminExperienceById(id);
  if (!record) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Experience"
        title="Edit experience"
        description={`${record.position} — ${record.company}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Experience details</CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceForm
            mode="edit"
            experienceId={record.id}
            defaultValues={{
              company: record.company,
              position: record.position,
              employmentType: record.employmentType ?? "",
              location: record.location ?? "",
              startDate: record.startDate,
              endDate: record.endDate ?? "",
              isCurrent: record.isCurrent,
              description: record.description ?? "",
              responsibilitiesText: listToMultilineText(record.responsibilities),
              technologiesText: listToMultilineText(record.technologies),
              achievementsText: listToMultilineText(record.achievements),
              displayOrder: record.displayOrder,
              isVisible: record.isVisible,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

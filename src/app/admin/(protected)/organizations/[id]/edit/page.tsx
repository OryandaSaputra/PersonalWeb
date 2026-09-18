import { notFound } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { listToMultilineText } from "@/features/admin/content/utils";
import { OrganizationForm } from "@/features/admin/organization/components/organization-form";
import { getAdminOrganizationById } from "@/features/admin/organization/queries";

type Props = { params: Promise<{ id: string }> };

export default async function EditOrganizationPage({ params }: Props) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const record = await getAdminOrganizationById(id);
  if (!record) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Organizations"
        title="Edit organization experience"
        description={`${record.position} — ${record.organization}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Organization details</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationForm
            mode="edit"
            organizationId={record.id}
            defaultValues={{
              organization: record.organization,
              position: record.position,
              startDate: record.startDate,
              endDate: record.endDate ?? "",
              isCurrent: record.isCurrent,
              description: record.description ?? "",
              responsibilitiesText: listToMultilineText(record.responsibilities),
              displayOrder: record.displayOrder,
              isVisible: record.isVisible,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

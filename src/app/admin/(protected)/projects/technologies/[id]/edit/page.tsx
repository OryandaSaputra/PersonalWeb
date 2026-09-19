import { notFound } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { TechnologyForm } from "@/features/admin/projects/components/technology-form";
import { getAdminTechnologyById } from "@/features/admin/projects/queries";

type EditTechnologyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTechnologyPage({ params }: EditTechnologyPageProps) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    notFound();
  }

  const technology = await getAdminTechnologyById(id);

  if (!technology) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Projects" title="Edit technology" description={technology.name} />

      <Card>
        <CardHeader>
          <CardTitle>Technology details</CardTitle>
        </CardHeader>

        <CardContent>
          <TechnologyForm
            mode="edit"
            technologyId={technology.id}
            defaultValues={{
              name: technology.name,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

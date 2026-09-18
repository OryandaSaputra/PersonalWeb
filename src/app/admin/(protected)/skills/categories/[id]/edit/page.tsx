import { notFound } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SkillCategoryForm } from "@/features/admin/skills/components/skill-category-form";
import { getAdminSkillCategoryById } from "@/features/admin/skills/queries";

type EditSkillCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSkillCategoryPage({ params }: EditSkillCategoryPageProps) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    notFound();
  }

  const category = await getAdminSkillCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Skills" title="Edit skill category" description={category.name} />

      <Card>
        <CardHeader>
          <CardTitle>Category details</CardTitle>
        </CardHeader>

        <CardContent>
          <SkillCategoryForm
            mode="edit"
            categoryId={category.id}
            defaultValues={{
              name: category.name,
              displayOrder: category.displayOrder,
              isVisible: category.isVisible,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

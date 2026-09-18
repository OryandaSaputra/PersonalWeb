import { notFound } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SkillForm } from "@/features/admin/skills/components/skill-form";
import { getAdminSkillById, getAdminSkillCategories } from "@/features/admin/skills/queries";

type EditSkillPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    notFound();
  }

  const [skill, categories] = await Promise.all([getAdminSkillById(id), getAdminSkillCategories()]);

  if (!skill) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Skills" title="Edit skill" description={skill.name} />

      <Card>
        <CardHeader>
          <CardTitle>Skill details</CardTitle>
        </CardHeader>

        <CardContent>
          <SkillForm
            mode="edit"
            skillId={skill.id}
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
            }))}
            defaultValues={{
              categoryId: skill.categoryId,
              name: skill.name,
              icon: skill.icon ?? "",
              displayOrder: skill.displayOrder,
              isVisible: skill.isVisible,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

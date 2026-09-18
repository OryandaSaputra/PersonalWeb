import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SkillForm } from "@/features/admin/skills/components/skill-form";
import { getAdminSkillCategories } from "@/features/admin/skills/queries";

export default async function NewSkillPage() {
  const categories = await getAdminSkillCategories();

  if (categories.length === 0) {
    redirect("/admin/skills/categories/new");
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Skills"
        title="Add skill"
        description="Add a technical skill to an existing category."
      />

      <Card>
        <CardHeader>
          <CardTitle>Skill details</CardTitle>
        </CardHeader>

        <CardContent>
          <SkillForm
            mode="create"
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
            }))}
            defaultValues={{
              categoryId: categories[0]?.id ?? "",
              name: "",
              icon: "",
              displayOrder: 0,
              isVisible: true,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

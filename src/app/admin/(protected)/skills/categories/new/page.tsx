import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SkillCategoryForm } from "@/features/admin/skills/components/skill-category-form";

export default function NewSkillCategoryPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Skills"
        title="Add skill category"
        description="Create a category used to organize technical skills."
      />

      <Card>
        <CardHeader>
          <CardTitle>Category details</CardTitle>
        </CardHeader>

        <CardContent>
          <SkillCategoryForm
            mode="create"
            defaultValues={{
              name: "",
              displayOrder: 0,
              isVisible: true,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

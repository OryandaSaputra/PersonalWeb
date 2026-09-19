import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { TechnologyForm } from "@/features/admin/projects/components/technology-form";

export default function NewTechnologyPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Projects"
        title="Add technology"
        description="Create a reusable technology for project stacks."
      />

      <Card>
        <CardHeader>
          <CardTitle>Technology details</CardTitle>
        </CardHeader>

        <CardContent>
          <TechnologyForm
            mode="create"
            defaultValues={{
              name: "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

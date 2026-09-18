import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { EducationForm } from "@/features/admin/education/components/education-form";

export default function NewEducationPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Education"
        title="Add education"
        description="Create a formal education record."
      />
      <Card>
        <CardHeader>
          <CardTitle>Education details</CardTitle>
        </CardHeader>
        <CardContent>
          <EducationForm
            mode="create"
            defaultValues={{
              institution: "",
              degree: "",
              major: "",
              startYear: new Date().getFullYear(),
              graduationYear: null,
              gpa: null,
              gpaScale: 4,
              description: "",
              displayOrder: 0,
              isVisible: true,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

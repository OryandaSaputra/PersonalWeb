import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { ExperienceForm } from "@/features/admin/experience/components/experience-form";

export default function NewExperiencePage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Experience"
        title="Add experience"
        description="Create a professional work or internship record."
      />
      <Card>
        <CardHeader>
          <CardTitle>Experience details</CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceForm
            mode="create"
            defaultValues={{
              company: "",
              position: "",
              employmentType: "",
              location: "",
              startDate: "",
              endDate: "",
              isCurrent: false,
              description: "",
              responsibilitiesText: "",
              technologiesText: "",
              achievementsText: "",
              displayOrder: 0,
              isVisible: true,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { ProjectForm } from "@/features/admin/projects/components/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Projects"
        title="Add project"
        description="Create project metadata and case-study content. Technology stack can be assigned immediately after creation."
      />

      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
        </CardHeader>

        <CardContent>
          <ProjectForm
            mode="create"
            defaultValues={{
              name: "",
              slug: "",
              projectType: "",
              organization: "",
              shortDescription: "",
              fullDescription: "",
              background: "",
              problem: "",
              solution: "",
              role: "",
              keyFeaturesText: "",
              challenges: "",
              learning: "",
              repositoryUrl: "",
              liveUrl: "",
              documentationUrl: "",
              startDate: "",
              endDate: "",
              status: "draft",
              caseStudyVisibility: "public",
              isFeatured: false,
              displayOrder: 0,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

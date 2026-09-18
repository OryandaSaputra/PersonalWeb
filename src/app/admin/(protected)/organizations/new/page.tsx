import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { OrganizationForm } from "@/features/admin/organization/components/organization-form";

export default function NewOrganizationPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Organizations"
        title="Add organization experience"
        description="Create an organization or leadership record."
      />
      <Card>
        <CardHeader>
          <CardTitle>Organization details</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationForm
            mode="create"
            defaultValues={{
              organization: "",
              position: "",
              startDate: "",
              endDate: "",
              isCurrent: false,
              description: "",
              responsibilitiesText: "",
              displayOrder: 0,
              isVisible: true,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

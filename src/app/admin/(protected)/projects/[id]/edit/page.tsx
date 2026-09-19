import { notFound } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { ProjectForm } from "@/features/admin/projects/components/project-form";
import { ProjectTechnologyManager } from "@/features/admin/projects/components/project-technology-manager";
import {
  getAdminProjectById,
  getAdminProjectTechnologyLinks,
  getAdminTechnologies,
} from "@/features/admin/projects/queries";
import { toMultilineText } from "@/features/admin/projects/utils";

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    notFound();
  }

  const [project, technologies, links] = await Promise.all([
    getAdminProjectById(id),

    getAdminTechnologies(),

    getAdminProjectTechnologyLinks(id),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Projects" title="Edit project" description={project.name} />

      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>

          <CardDescription>
            Update project metadata, publication state, and case-study content.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProjectForm
            mode="edit"
            projectId={project.id}
            defaultValues={{
              name: project.name,

              slug: project.slug,

              projectType: project.projectType ?? "",

              organization: project.organization ?? "",

              shortDescription: project.shortDescription,

              fullDescription: project.fullDescription ?? "",

              background: project.background ?? "",

              problem: project.problem ?? "",

              solution: project.solution ?? "",

              role: project.role ?? "",

              keyFeaturesText: toMultilineText(project.keyFeatures),

              challenges: project.challenges ?? "",

              learning: project.learning ?? "",

              repositoryUrl: project.repositoryUrl ?? "",

              liveUrl: project.liveUrl ?? "",

              documentationUrl: project.documentationUrl ?? "",

              startDate: project.startDate ?? "",

              endDate: project.endDate ?? "",

              status: project.status,

              caseStudyVisibility: project.caseStudyVisibility,

              isFeatured: project.isFeatured,

              displayOrder: project.displayOrder,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technology stack</CardTitle>

          <CardDescription>
            Assign reusable technologies and control their display order for this project.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProjectTechnologyManager
            projectId={project.id}
            technologies={technologies.map((technology) => ({
              id: technology.id,
              name: technology.name,
            }))}
            links={links}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project media</CardTitle>

          <CardDescription>
            Thumbnail, screenshots, captions, alt text, image type, and image ordering are
            implemented in Stage 9.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

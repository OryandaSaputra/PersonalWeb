import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { ProjectImageManager } from "@/features/admin/media/components/project-image-manager";
import { getProjectMediaPageData } from "@/features/admin/media/queries";

type ProjectMediaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectMediaPage({ params }: ProjectMediaPageProps) {
  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    notFound();
  }

  const data = await getProjectMediaPageData(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Projects"
        title="Project media"
        description={data.project.name}
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/projects/${id}/edit`}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to project
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Cover and screenshots</CardTitle>

          <CardDescription>
            Keep one cover and organize supporting screenshots for the project case study.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProjectImageManager projectId={data.project.id} images={data.images} />
        </CardContent>
      </Card>
    </div>
  );
}

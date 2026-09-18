import { Layers3, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { deleteSkillAction, deleteSkillCategoryAction } from "@/features/admin/skills/actions";
import { getAdminSkillsPageData } from "@/features/admin/skills/queries";

export default async function AdminSkillsPage() {
  const { categories, skills } = await getAdminSkillsPageData();

  const skillsByCategory = new Map<string, typeof skills>();

  for (const skill of skills) {
    const current = skillsByCategory.get(skill.categoryId) ?? [];

    current.push(skill);

    skillsByCategory.set(skill.categoryId, current);
  }

  return (
    <div className="space-y-10">
      <AdminPageHeader
        eyebrow="Portfolio Content"
        title="Skills"
        description="Manage technical skills and the categories used to organize them."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/skills/categories/new">
                <Layers3 className="size-4" aria-hidden="true" />
                Add category
              </Link>
            </Button>

            {categories.length > 0 ? (
              <Button asChild>
                <Link href="/admin/skills/new">
                  <Plus className="size-4" aria-hidden="true" />
                  Add skill
                </Link>
              </Button>
            ) : (
              <Button disabled>
                <Plus className="size-4" aria-hidden="true" />
                Add skill
              </Button>
            )}
          </>
        }
      />

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Layers3 className="mx-auto size-7 text-muted-foreground" />

          <h2 className="mt-4 font-display text-lg font-semibold">Create a skill category first</h2>

          <p className="mt-2 text-sm text-muted-foreground">Skills must belong to a category.</p>

          <Button asChild className="mt-5">
            <Link href="/admin/skills/categories/new">Add category</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const categorySkills = skillsByCategory.get(category.id) ?? [];

            const deleteCategoryAction = deleteSkillCategoryAction.bind(null, category.id);

            return (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle>{category.name}</CardTitle>

                        <Badge variant={category.isVisible ? "success" : "secondary"}>
                          {category.isVisible ? "Visible" : "Hidden"}
                        </Badge>

                        <Badge variant="outline">
                          {categorySkills.length} skill
                          {categorySkills.length === 1 ? "" : "s"}
                        </Badge>
                      </div>

                      <CardDescription className="mt-2">
                        Slug: {category.slug}
                        {" · "}Display order {category.displayOrder}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/skills/categories/${category.id}/edit`}>
                          Edit category
                        </Link>
                      </Button>

                      <DeleteRecordButton itemLabel={category.name} action={deleteCategoryAction} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {categorySkills.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center">
                      <p className="text-sm font-medium">No skills in this category</p>

                      <Button asChild size="sm" className="mt-4">
                        <Link href="/admin/skills/new">Add skill</Link>
                      </Button>
                    </div>
                  ) : (
                    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {categorySkills.map((skill) => {
                        const deleteSkill = deleteSkillAction.bind(null, skill.id);

                        return (
                          <li
                            key={skill.id}
                            className="rounded-xl border border-border bg-muted/20 p-4"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium">{skill.name}</p>

                                <Badge variant={skill.isVisible ? "success" : "secondary"}>
                                  {skill.isVisible ? "Visible" : "Hidden"}
                                </Badge>
                              </div>

                              {skill.icon ? (
                                <p className="mt-2 text-xs text-muted-foreground">
                                  Icon: {skill.icon}
                                </p>
                              ) : null}

                              <p className="mt-2 text-xs text-muted-foreground">
                                Order {skill.displayOrder}
                              </p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/admin/skills/${skill.id}/edit`}>Edit</Link>
                              </Button>

                              <DeleteRecordButton itemLabel={skill.name} action={deleteSkill} />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <section
        aria-labelledby="skills-notes-heading"
        className="rounded-2xl border border-border bg-muted/30 p-5"
      >
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />

          <div>
            <h2 id="skills-notes-heading" className="font-display font-semibold">
              Portfolio rule
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Skills use categories and ordering rather than fabricated proficiency percentages. A
              visible skill may later appear on the public portfolio; hidden records remain
              Admin-only.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

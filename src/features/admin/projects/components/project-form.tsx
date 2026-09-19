"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createProjectAction,
  updateProjectAction,
} from "@/features/admin/projects/project-actions";
import {
  CASE_STUDY_VISIBILITY_VALUES,
  PROJECT_STATUS_VALUES,
  projectFormSchema,
  type ProjectFormValues,
} from "@/features/admin/projects/validation";

type ProjectFormProps = {
  mode: "create" | "edit";
  projectId?: string;
  defaultValues: ProjectFormValues;
};

const statusLabels: Record<(typeof PROJECT_STATUS_VALUES)[number], string> = {
  draft: "Draft",
  published: "Published",
  hidden: "Hidden",
};

const visibilityLabels: Record<(typeof CASE_STUDY_VISIBILITY_VALUES)[number], string> = {
  public: "Public",
  limited: "Limited",
  private: "Private",
};

export function ProjectForm({ mode, projectId, defaultValues }: ProjectFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      mode === "create"
        ? await createProjectAction(values)
        : projectId
          ? await updateProjectAction(projectId, values)
          : {
              ok: false as const,
              message: "The project identifier is missing.",
            };

    if (!result.ok) {
      setError("root", {
        type: "server",
        message: result.message,
      });

      return;
    }

    if (mode === "create") {
      router.push(`/admin/projects/${result.projectId}/edit`);

      router.refresh();

      return;
    }

    router.push("/admin/projects");

    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save project</AlertTitle>

          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <section aria-labelledby="project-basic-heading" className="space-y-5">
        <div>
          <h2 id="project-basic-heading" className="font-display text-lg font-semibold">
            Basic information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Identity and summary information used by the portfolio.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Project name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" {...register("name")} />
          </Field>

          <Field
            label="Slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint="Optional. Leave empty to generate the slug from the project name."
          >
            <Input id="slug" placeholder="project-name" {...register("slug")} />
          </Field>

          <Field
            label="Project type"
            htmlFor="projectType"
            error={errors.projectType?.message}
            hint="Optional. Add a type only when it is accurate."
          >
            <Input id="projectType" {...register("projectType")} />
          </Field>

          <Field label="Organization" htmlFor="organization" error={errors.organization?.message}>
            <Input id="organization" {...register("organization")} />
          </Field>

          <div className="md:col-span-2">
            <Field
              label="Short description"
              htmlFor="shortDescription"
              error={errors.shortDescription?.message}
              hint="Concise project summary for cards and project listings."
            >
              <Textarea id="shortDescription" rows={4} {...register("shortDescription")} />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field
              label="Full description"
              htmlFor="fullDescription"
              error={errors.fullDescription?.message}
            >
              <Textarea id="fullDescription" rows={7} {...register("fullDescription")} />
            </Field>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="project-case-study-heading"
        className="space-y-5 border-t border-border pt-7"
      >
        <div>
          <h2 id="project-case-study-heading" className="font-display text-lg font-semibold">
            Case study
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Leave any field empty when the information is not supported by source material yet.
          </p>
        </div>

        <div className="grid gap-5">
          <Field label="Background" htmlFor="background" error={errors.background?.message}>
            <Textarea id="background" rows={6} {...register("background")} />
          </Field>

          <Field label="Problem" htmlFor="problem" error={errors.problem?.message}>
            <Textarea id="problem" rows={6} {...register("problem")} />
          </Field>

          <Field label="Solution" htmlFor="solution" error={errors.solution?.message}>
            <Textarea id="solution" rows={6} {...register("solution")} />
          </Field>

          <Field label="My role" htmlFor="role" error={errors.role?.message}>
            <Textarea id="role" rows={4} {...register("role")} />
          </Field>

          <Field
            label="Key features"
            htmlFor="keyFeaturesText"
            error={errors.keyFeaturesText?.message}
            hint="One feature per line."
          >
            <Textarea id="keyFeaturesText" rows={8} {...register("keyFeaturesText")} />
          </Field>

          <Field label="Challenges" htmlFor="challenges" error={errors.challenges?.message}>
            <Textarea id="challenges" rows={6} {...register("challenges")} />
          </Field>

          <Field label="Learning" htmlFor="learning" error={errors.learning?.message}>
            <Textarea id="learning" rows={6} {...register("learning")} />
          </Field>
        </div>
      </section>

      <section
        aria-labelledby="project-links-heading"
        className="space-y-5 border-t border-border pt-7"
      >
        <div>
          <h2 id="project-links-heading" className="font-display text-lg font-semibold">
            Links and dates
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">All links and dates are optional.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Repository URL"
            htmlFor="repositoryUrl"
            error={errors.repositoryUrl?.message}
          >
            <Input
              id="repositoryUrl"
              type="url"
              placeholder="https://..."
              {...register("repositoryUrl")}
            />
          </Field>

          <Field label="Live URL" htmlFor="liveUrl" error={errors.liveUrl?.message}>
            <Input id="liveUrl" type="url" placeholder="https://..." {...register("liveUrl")} />
          </Field>

          <div className="md:col-span-2">
            <Field
              label="Documentation URL"
              htmlFor="documentationUrl"
              error={errors.documentationUrl?.message}
            >
              <Input
                id="documentationUrl"
                type="url"
                placeholder="https://..."
                {...register("documentationUrl")}
              />
            </Field>
          </div>

          <Field
            label="Start date"
            htmlFor="startDate"
            error={errors.startDate?.message}
            hint="Optional. Do not invent an exact day when only month/year is known."
          >
            <Input id="startDate" type="date" {...register("startDate")} />
          </Field>

          <Field label="End date" htmlFor="endDate" error={errors.endDate?.message}>
            <Input id="endDate" type="date" {...register("endDate")} />
          </Field>
        </div>
      </section>

      <section
        aria-labelledby="project-publication-heading"
        className="space-y-5 border-t border-border pt-7"
      >
        <div>
          <h2 id="project-publication-heading" className="font-display text-lg font-semibold">
            Publication settings
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Project status" htmlFor="status" error={errors.status?.message}>
            <select
              id="status"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              {...register("status")}
            >
              {PROJECT_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Case study visibility"
            htmlFor="caseStudyVisibility"
            error={errors.caseStudyVisibility?.message}
          >
            <select
              id="caseStudyVisibility"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              {...register("caseStudyVisibility")}
            >
              {CASE_STUDY_VISIBILITY_VALUES.map((visibility) => (
                <option key={visibility} value={visibility}>
                  {visibilityLabels[visibility]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Display order" htmlFor="displayOrder" error={errors.displayOrder?.message}>
            <Input
              id="displayOrder"
              type="number"
              min={0}
              {...register("displayOrder", {
                valueAsNumber: true,
              })}
            />
          </Field>

          <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 md:self-end">
            <input type="checkbox" className="size-4 accent-primary" {...register("isFeatured")} />

            <span>
              <span className="block text-sm font-medium">Featured project</span>

              <span className="mt-1 block text-xs text-muted-foreground">
                Featured placement is used by the public portfolio in a later stage.
              </span>
            </span>
          </label>
        </div>

        <Alert>
          <AlertTitle>Status and visibility are separate</AlertTitle>

          <AlertDescription>
            A project must be published before it can be eligible for public rendering. Case study
            visibility controls how much detail may be shown later.
          </AlertDescription>
        </Alert>
      </section>

      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-7">
        <Button asChild variant="outline">
          <Link href="/admin/projects">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Cancel
          </Link>
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}

          {isSubmitting ? "Saving..." : "Save project"}
        </Button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>

      {children}

      {hint ? <p className="text-xs leading-5 text-muted-foreground">{hint}</p> : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

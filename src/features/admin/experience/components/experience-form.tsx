"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createExperienceAction,
  updateExperienceAction,
} from "@/features/admin/experience/actions";
import {
  experienceFormSchema,
  type ExperienceFormValues,
} from "@/features/admin/experience/validation";

type ExperienceFormProps = {
  mode: "create" | "edit";
  experienceId?: string;
  defaultValues: ExperienceFormValues;
};

export function ExperienceForm({ mode, experienceId, defaultValues }: ExperienceFormProps) {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues,
  });

  const isCurrent = useWatch({
    control,
    name: "isCurrent",
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      mode === "create"
        ? await createExperienceAction(values)
        : experienceId
          ? await updateExperienceAction(experienceId, values)
          : {
              ok: false as const,
              message: "The experience identifier is missing.",
            };

    if (!result.ok) {
      setError("root", {
        type: "server",
        message: result.message,
      });

      return;
    }

    router.push("/admin/experience");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save experience</AlertTitle>

          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Company" htmlFor="company" error={errors.company?.message}>
          <Input id="company" {...register("company")} />
        </Field>

        <Field label="Position" htmlFor="position" error={errors.position?.message}>
          <Input id="position" {...register("position")} />
        </Field>

        <Field
          label="Employment type"
          htmlFor="employmentType"
          error={errors.employmentType?.message}
        >
          <Input id="employmentType" placeholder="Internship" {...register("employmentType")} />
        </Field>

        <Field
          label="Location"
          htmlFor="location"
          error={errors.location?.message}
          hint="Optional. Leave empty when the source does not state it."
        >
          <Input id="location" {...register("location")} />
        </Field>

        <Field label="Start date" htmlFor="startDate" error={errors.startDate?.message}>
          <Input id="startDate" type="date" {...register("startDate")} />
        </Field>

        <Field label="End date" htmlFor="endDate" error={errors.endDate?.message}>
          <Input id="endDate" type="date" disabled={isCurrent} {...register("endDate")} />
        </Field>

        <div className="md:col-span-2">
          <label className="flex items-start gap-3 rounded-xl border border-border p-4">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-primary"
              {...register("isCurrent")}
            />

            <span>
              <span className="block text-sm font-medium">Current experience</span>

              <span className="mt-1 block text-xs text-muted-foreground">
                Current records must not have an end date.
              </span>
            </span>
          </label>
        </div>

        <div className="md:col-span-2">
          <Field label="Description" htmlFor="description" error={errors.description?.message}>
            <Textarea id="description" rows={5} {...register("description")} />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field
            label="Responsibilities"
            htmlFor="responsibilitiesText"
            error={errors.responsibilitiesText?.message}
            hint="One responsibility per line."
          >
            <Textarea id="responsibilitiesText" rows={7} {...register("responsibilitiesText")} />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field
            label="Technologies"
            htmlFor="technologiesText"
            error={errors.technologiesText?.message}
            hint="One technology per line."
          >
            <Textarea id="technologiesText" rows={6} {...register("technologiesText")} />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field
            label="Achievements"
            htmlFor="achievementsText"
            error={errors.achievementsText?.message}
            hint="Optional. Do not add metrics or achievements that are not supported by source material."
          >
            <Textarea id="achievementsText" rows={5} {...register("achievementsText")} />
          </Field>
        </div>

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
          <input type="checkbox" className="size-4 accent-primary" {...register("isVisible")} />

          <span className="text-sm font-medium">Visible publicly</span>
        </label>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/admin/experience">
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

          {isSubmitting ? "Saving..." : "Save experience"}
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

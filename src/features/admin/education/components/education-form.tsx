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
import { createEducationAction, updateEducationAction } from "@/features/admin/education/actions";
import {
  educationFormSchema,
  type EducationFormValues,
} from "@/features/admin/education/validation";

type Props = {
  mode: "create" | "edit";
  educationId?: string;
  defaultValues: EducationFormValues;
};

export function EducationForm({ mode, educationId, defaultValues }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({ resolver: zodResolver(educationFormSchema), defaultValues });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      mode === "create"
        ? await createEducationAction(values)
        : educationId
          ? await updateEducationAction(educationId, values)
          : { ok: false as const, message: "The education identifier is missing." };

    if (!result.ok) {
      setError("root", { type: "server", message: result.message });
      return;
    }

    router.push("/admin/education");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save education</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="institution">Institution</Label>
          <Input id="institution" {...register("institution")} />
          {errors.institution?.message ? (
            <p className="text-sm text-destructive">{errors.institution.message}</p>
          ) : null}
        </div>
        <Field label="Degree" id="degree" error={errors.degree?.message}>
          <Input id="degree" {...register("degree")} />
        </Field>
        <Field label="Major" id="major" error={errors.major?.message}>
          <Input id="major" {...register("major")} />
        </Field>
        <Field label="Start year" id="startYear" error={errors.startYear?.message}>
          <Input
            id="startYear"
            type="number"
            min={1900}
            max={2100}
            {...register("startYear", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Graduation year" id="graduationYear" error={errors.graduationYear?.message}>
          <Input
            id="graduationYear"
            type="number"
            min={1900}
            max={2100}
            {...register("graduationYear", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
          />
        </Field>
        <Field label="GPA" id="gpa" error={errors.gpa?.message}>
          <Input
            id="gpa"
            type="number"
            step="0.01"
            min={0}
            {...register("gpa", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
          />
        </Field>
        <Field label="GPA scale" id="gpaScale" error={errors.gpaScale?.message}>
          <Input
            id="gpaScale"
            type="number"
            step="0.01"
            min={0.01}
            {...register("gpaScale", { valueAsNumber: true })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Description" id="description" error={errors.description?.message}>
            <Textarea id="description" rows={6} {...register("description")} />
          </Field>
        </div>
        <Field label="Display order" id="displayOrder" error={errors.displayOrder?.message}>
          <Input
            id="displayOrder"
            type="number"
            min={0}
            {...register("displayOrder", { valueAsNumber: true })}
          />
        </Field>
        <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 md:self-end">
          <input type="checkbox" className="size-4 accent-primary" {...register("isVisible")} />
          <span className="text-sm font-medium">Visible publicly</span>
        </label>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/admin/education">
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
          {isSubmitting ? "Saving..." : "Save education"}
        </Button>
      </div>
    </form>
  );
}

type FieldProps = { label: string; id: string; error?: string; children: React.ReactNode };
function Field({ label, id, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

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
  createOrganizationAction,
  updateOrganizationAction,
} from "@/features/admin/organization/actions";
import {
  organizationFormSchema,
  type OrganizationFormValues,
} from "@/features/admin/organization/validation";

type OrganizationFormProps = {
  mode: "create" | "edit";
  organizationId?: string;
  defaultValues: OrganizationFormValues;
};

export function OrganizationForm({ mode, organizationId, defaultValues }: OrganizationFormProps) {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues,
  });

  const isCurrent = useWatch({
    control,
    name: "isCurrent",
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      mode === "create"
        ? await createOrganizationAction(values)
        : organizationId
          ? await updateOrganizationAction(organizationId, values)
          : {
              ok: false as const,
              message: "The organization identifier is missing.",
            };

    if (!result.ok) {
      setError("root", {
        type: "server",
        message: result.message,
      });

      return;
    }

    router.push("/admin/organizations");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save organization experience</AlertTitle>

          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Organization" htmlFor="organization" error={errors.organization?.message}>
          <Input id="organization" {...register("organization")} />
        </Field>

        <Field label="Position" htmlFor="position" error={errors.position?.message}>
          <Input id="position" {...register("position")} />
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
              <span className="block text-sm font-medium">Current organization role</span>

              <span className="mt-1 block text-xs text-muted-foreground">
                Current roles must not have an end date.
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
          <Link href="/admin/organizations">
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

          {isSubmitting ? "Saving..." : "Save organization"}
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

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

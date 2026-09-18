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
import { createSocialLinkAction, updateSocialLinkAction } from "@/features/admin/profile/actions";
import {
  socialLinkFormSchema,
  type SocialLinkFormValues,
} from "@/features/admin/profile/validation";

type SocialLinkFormProps = {
  mode: "create" | "edit";
  socialLinkId?: string;
  defaultValues: SocialLinkFormValues;
};

export function SocialLinkForm({ mode, socialLinkId, defaultValues }: SocialLinkFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SocialLinkFormValues>({ resolver: zodResolver(socialLinkFormSchema), defaultValues });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      mode === "create"
        ? await createSocialLinkAction(values)
        : socialLinkId
          ? await updateSocialLinkAction(socialLinkId, values)
          : { ok: false as const, message: "The social link identifier is missing." };

    if (!result.ok) {
      setError("root", { type: "server", message: result.message });
      return;
    }

    router.push("/admin/profile");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save social link</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Platform" id="platform" error={errors.platform?.message}>
          <Input id="platform" placeholder="linkedin" {...register("platform")} />
        </Field>
        <Field label="Label" id="label" error={errors.label?.message}>
          <Input id="label" placeholder="LinkedIn" {...register("label")} />
        </Field>
        <div className="md:col-span-2">
          <Field label="URL" id="url" error={errors.url?.message}>
            <Input id="url" type="url" placeholder="https://..." {...register("url")} />
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
          <Link href="/admin/profile">
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
          {isSubmitting ? "Saving..." : "Save social link"}
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

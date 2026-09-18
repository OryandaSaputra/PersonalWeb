"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveProfileAction } from "@/features/admin/profile/actions";
import { profileFormSchema, type ProfileFormValues } from "@/features/admin/profile/validation";

type ProfileFormProps = { defaultValues: ProfileFormValues };

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileFormSchema), defaultValues });

  const onSubmit = handleSubmit(async (values) => {
    setSuccessMessage(null);
    const result = await saveProfileAction(values);

    if (!result.ok) {
      setError("root", { type: "server", message: result.message });
      return;
    }

    setSuccessMessage(result.message);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save profile</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert variant="success">
          <AlertTitle>Profile saved</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
          <Input id="fullName" autoComplete="name" {...register("fullName")} />
        </Field>
        <Field
          label="Professional title"
          htmlFor="professionalTitle"
          error={errors.professionalTitle?.message}
        >
          <Input id="professionalTitle" {...register("professionalTitle")} />
        </Field>
        <Field label="Location" htmlFor="location" error={errors.location?.message}>
          <Input id="location" {...register("location")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" {...register("phone")} />
        </Field>
        <Field label="Career focus" htmlFor="careerFocus" error={errors.careerFocus?.message}>
          <Input id="careerFocus" {...register("careerFocus")} />
        </Field>
        <div className="md:col-span-2">
          <Field
            label="Short introduction"
            htmlFor="shortIntroduction"
            error={errors.shortIntroduction?.message}
          >
            <Textarea id="shortIntroduction" rows={5} {...register("shortIntroduction")} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field
            label="About"
            htmlFor="about"
            error={errors.about?.message}
            hint="Optional. Leave empty until a longer About narrative is approved."
          >
            <Textarea id="about" rows={8} {...register("about")} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field
            label="Hero tagline"
            htmlFor="heroTagline"
            error={errors.heroTagline?.message}
            hint="Optional. Not seeded because it is not explicitly present in the CV."
          >
            <Input id="heroTagline" {...register("heroTagline")} />
          </Field>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-primary"
          {...register("showPhonePublicly")}
        />
        <span>
          <span className="block text-sm font-medium">Show phone number publicly</span>
          <span className="mt-1 block text-sm leading-6 text-muted-foreground">
            Disabled by default to avoid publishing personal contact information unintentionally.
          </span>
        </span>
      </label>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {isSubmitting ? "Saving..." : "Save profile"}
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

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
import {
  createCertificationAction,
  updateCertificationAction,
} from "@/features/admin/certifications/actions";
import {
  certificationFormSchema,
  type CertificationFormValues,
} from "@/features/admin/certifications/validation";

type CertificationFormProps = {
  mode: "create" | "edit";
  certificationId?: string;
  defaultValues: CertificationFormValues;
};

export function CertificationForm({
  mode,
  certificationId,
  defaultValues,
}: CertificationFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      mode === "create"
        ? await createCertificationAction(values)
        : certificationId
          ? await updateCertificationAction(certificationId, values)
          : {
              ok: false as const,
              message: "The certification identifier is missing.",
            };

    if (!result.ok) {
      setError("root", {
        type: "server",
        message: result.message,
      });

      return;
    }

    router.push("/admin/certifications");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save certification</AlertTitle>

          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Certification name</Label>

          <Input id="name" {...register("name")} />

          {errors.name?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="issuer">Issuing organization</Label>

          <Input id="issuer" {...register("issuer")} />

          {errors.issuer?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.issuer.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue date</Label>

          <Input id="issueDate" type="date" {...register("issueDate")} />

          <p className="text-xs text-muted-foreground">
            Optional. Leave empty when the source does not state an issue date.
          </p>

          {errors.issueDate?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.issueDate.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Expiration date</Label>

          <Input id="expirationDate" type="date" {...register("expirationDate")} />

          <p className="text-xs text-muted-foreground">
            Optional. Leave empty when the source does not state an expiration date.
          </p>

          {errors.expirationDate?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.expirationDate.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="credentialId">Credential ID</Label>

          <Input id="credentialId" {...register("credentialId")} />

          {errors.credentialId?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.credentialId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="credentialUrl">Credential URL</Label>

          <Input
            id="credentialUrl"
            type="url"
            placeholder="https://..."
            {...register("credentialUrl")}
          />

          {errors.credentialUrl?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.credentialUrl.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayOrder">Display order</Label>

          <Input
            id="displayOrder"
            type="number"
            min={0}
            {...register("displayOrder", {
              valueAsNumber: true,
            })}
          />

          {errors.displayOrder?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.displayOrder.message}
            </p>
          ) : null}
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 md:self-end">
          <input type="checkbox" className="size-4 accent-primary" {...register("isVisible")} />

          <span className="text-sm font-medium">Visible publicly</span>
        </label>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/admin/certifications">
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

          {isSubmitting ? "Saving..." : "Save certification"}
        </Button>
      </div>
    </form>
  );
}

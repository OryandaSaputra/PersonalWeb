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
  createTechnologyAction,
  updateTechnologyAction,
} from "@/features/admin/projects/technology-actions";
import {
  technologyFormSchema,
  type TechnologyFormValues,
} from "@/features/admin/projects/validation";

type TechnologyFormProps = {
  mode: "create" | "edit";
  technologyId?: string;
  defaultValues: TechnologyFormValues;
};

export function TechnologyForm({ mode, technologyId, defaultValues }: TechnologyFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologyFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      mode === "create"
        ? await createTechnologyAction(values)
        : technologyId
          ? await updateTechnologyAction(technologyId, values)
          : {
              ok: false as const,
              message: "The technology identifier is missing.",
            };

    if (!result.ok) {
      setError("root", {
        type: "server",
        message: result.message,
      });

      return;
    }

    router.push("/admin/projects/technologies");

    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save technology</AlertTitle>

          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="name">Technology name</Label>

        <Input id="name" placeholder="Next.js" {...register("name")} />

        <p className="text-xs leading-5 text-muted-foreground">
          Slug is generated automatically from the technology name.
        </p>

        {errors.name?.message ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/admin/projects/technologies">
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

          {isSubmitting ? "Saving..." : "Save technology"}
        </Button>
      </div>
    </form>
  );
}

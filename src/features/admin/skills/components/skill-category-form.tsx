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
  createSkillCategoryAction,
  updateSkillCategoryAction,
} from "@/features/admin/skills/actions";
import {
  skillCategoryFormSchema,
  type SkillCategoryFormValues,
} from "@/features/admin/skills/validation";

type SkillCategoryFormProps = {
  mode: "create" | "edit";
  categoryId?: string;
  defaultValues: SkillCategoryFormValues;
};

export function SkillCategoryForm({ mode, categoryId, defaultValues }: SkillCategoryFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SkillCategoryFormValues>({
    resolver: zodResolver(skillCategoryFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      mode === "create"
        ? await createSkillCategoryAction(values)
        : categoryId
          ? await updateSkillCategoryAction(categoryId, values)
          : {
              ok: false as const,
              message: "The skill category identifier is missing.",
            };

    if (!result.ok) {
      setError("root", {
        type: "server",
        message: result.message,
      });

      return;
    }

    router.push("/admin/skills");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save category</AlertTitle>

          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Category name</Label>

          <Input id="name" placeholder="Framework & Library" {...register("name")} />

          {errors.name?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.name.message}
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
          <Link href="/admin/skills">
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

          {isSubmitting ? "Saving..." : "Save category"}
        </Button>
      </div>
    </form>
  );
}

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
import { createSkillAction, updateSkillAction } from "@/features/admin/skills/actions";
import { skillFormSchema, type SkillFormValues } from "@/features/admin/skills/validation";

type SkillCategoryOption = {
  id: string;
  name: string;
};

type SkillFormProps = {
  mode: "create" | "edit";
  skillId?: string;
  categories: SkillCategoryOption[];
  defaultValues: SkillFormValues;
};

export function SkillForm({ mode, skillId, categories, defaultValues }: SkillFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    const result =
      mode === "create"
        ? await createSkillAction(values)
        : skillId
          ? await updateSkillAction(skillId, values)
          : {
              ok: false as const,
              message: "The skill identifier is missing.",
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
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to save skill</AlertTitle>

          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>

          <select
            id="categoryId"
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register("categoryId")}
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {errors.categoryId?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.categoryId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Skill name</Label>

          <Input id="name" placeholder="TypeScript" {...register("name")} />

          {errors.name?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">Icon identifier</Label>

          <Input id="icon" placeholder="Optional" {...register("icon")} />

          <p className="text-xs leading-5 text-muted-foreground">
            Optional metadata. The CV does not define icons, so seeded skills leave this empty.
          </p>

          {errors.icon?.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.icon.message}
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

          {isSubmitting ? "Saving..." : "Save skill"}
        </Button>
      </div>
    </form>
  );
}

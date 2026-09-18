import { z } from "zod";

export const skillCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is required.")
    .max(120, "Category name is too long."),

  displayOrder: z
    .number()
    .int("Display order must be an integer.")
    .min(0, "Display order cannot be negative.")
    .max(10000, "Display order is too large."),

  isVisible: z.boolean(),
});

export const skillFormSchema = z.object({
  categoryId: z.string().uuid("Select a valid skill category."),

  name: z.string().trim().min(1, "Skill name is required.").max(160, "Skill name is too long."),

  icon: z.string().trim().max(120, "Icon identifier is too long."),

  displayOrder: z
    .number()
    .int("Display order must be an integer.")
    .min(0, "Display order cannot be negative.")
    .max(10000, "Display order is too large."),

  isVisible: z.boolean(),
});

export type SkillCategoryFormValues = z.infer<typeof skillCategoryFormSchema>;

export type SkillFormValues = z.infer<typeof skillFormSchema>;

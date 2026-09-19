import { z } from "zod";

export const PROJECT_STATUS_VALUES = ["draft", "published", "hidden"] as const;

export const CASE_STUDY_VISIBILITY_VALUES = ["public", "limited", "private"] as const;

function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const optionalDateSchema = z
  .string()
  .refine((value) => value === "" || isValidIsoDate(value), "Enter a valid date.");

const optionalUrlSchema = z
  .string()
  .trim()
  .max(2048, "URL is too long.")
  .refine((value) => value === "" || isHttpUrl(value), "Enter a valid HTTP or HTTPS URL.");

const optionalShortText = (maximum: number) =>
  z.string().trim().max(maximum, `Maximum ${maximum} characters.`);

const optionalLongText = z.string().trim().max(20000, "Content is too long.");

export const technologyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Technology name is required.")
    .max(120, "Technology name is too long."),
});

export const projectFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Project name is required.")
      .max(200, "Project name is too long."),

    slug: z.string().trim().max(160, "Slug is too long."),

    projectType: optionalShortText(120),

    organization: optionalShortText(200),

    shortDescription: z
      .string()
      .trim()
      .min(20, "Short description must contain at least 20 characters.")
      .max(500, "Short description is too long."),

    fullDescription: optionalLongText,

    background: optionalLongText,

    problem: optionalLongText,

    solution: optionalLongText,

    role: optionalLongText,

    keyFeaturesText: z.string().trim().max(8000, "Key features content is too long."),

    challenges: optionalLongText,

    learning: optionalLongText,

    repositoryUrl: optionalUrlSchema,

    liveUrl: optionalUrlSchema,

    documentationUrl: optionalUrlSchema,

    startDate: optionalDateSchema,

    endDate: optionalDateSchema,

    status: z.enum(PROJECT_STATUS_VALUES),

    caseStudyVisibility: z.enum(CASE_STUDY_VISIBILITY_VALUES),

    isFeatured: z.boolean(),

    displayOrder: z
      .number()
      .int("Display order must be an integer.")
      .min(0, "Display order cannot be negative.")
      .max(10000, "Display order is too large."),
  })
  .superRefine((values, context) => {
    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date cannot be earlier than start date.",
      });
    }
  });

export const projectTechnologyOrderSchema = z.object({
  displayOrder: z
    .number()
    .int("Display order must be an integer.")
    .min(0, "Display order cannot be negative.")
    .max(10000, "Display order is too large."),
});

export type TechnologyFormValues = z.infer<typeof technologyFormSchema>;

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

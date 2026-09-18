import { z } from "zod";

export const educationFormSchema = z
  .object({
    institution: z.string().trim().min(2, "Institution is required.").max(220),
    degree: z.string().trim().min(1, "Degree is required.").max(160),
    major: z.string().trim().min(2, "Major is required.").max(160),
    startYear: z.number().int().min(1900).max(2100),
    graduationYear: z.number().int().min(1900).max(2100).nullable(),
    gpa: z.number().min(0).nullable(),
    gpaScale: z.number().positive().max(100),
    description: z.string().trim().max(4000),
    displayOrder: z.number().int().min(0).max(10000),
    isVisible: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.graduationYear !== null && values.graduationYear < values.startYear) {
      context.addIssue({
        code: "custom",
        path: ["graduationYear"],
        message: "Graduation year cannot be earlier than start year.",
      });
    }

    if (values.gpa !== null && values.gpa > values.gpaScale) {
      context.addIssue({
        code: "custom",
        path: ["gpa"],
        message: "GPA cannot exceed the GPA scale.",
      });
    }
  });

export type EducationFormValues = z.infer<typeof educationFormSchema>;

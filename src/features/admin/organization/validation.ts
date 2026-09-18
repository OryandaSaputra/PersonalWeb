import { z } from "zod";

function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

export const organizationFormSchema = z
  .object({
    organization: z.string().trim().min(2, "Organization is required.").max(200),
    position: z.string().trim().min(2, "Position is required.").max(200),
    startDate: z.string().refine(isValidIsoDate, "Enter a valid date."),
    endDate: z
      .string()
      .refine((value) => value === "" || isValidIsoDate(value), "Enter a valid date."),
    isCurrent: z.boolean(),
    description: z.string().trim().max(4000),
    responsibilitiesText: z.string().max(8000),
    displayOrder: z.number().int().min(0).max(10000),
    isVisible: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.isCurrent && values.endDate !== "") {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "A current organization role cannot have an end date.",
      });
    }

    if (!values.isCurrent && values.endDate && values.endDate < values.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date cannot be earlier than start date.",
      });
    }
  });

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

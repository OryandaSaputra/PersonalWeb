import { z } from "zod";

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

const optionalDateSchema = z
  .string()
  .refine((value) => value === "" || isValidIsoDate(value), "Enter a valid date.");

const optionalUrlSchema = z
  .string()
  .trim()
  .max(2048, "Credential URL is too long.")
  .refine(
    (value) => value === "" || z.string().url().safeParse(value).success,
    "Enter a valid credential URL.",
  );

export const certificationFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Certification name is required.")
      .max(220, "Certification name is too long."),

    issuer: z
      .string()
      .trim()
      .min(2, "Issuing organization is required.")
      .max(220, "Issuing organization is too long."),

    issueDate: optionalDateSchema,

    expirationDate: optionalDateSchema,

    credentialId: z.string().trim().max(240, "Credential ID is too long."),

    credentialUrl: optionalUrlSchema,

    displayOrder: z
      .number()
      .int("Display order must be an integer.")
      .min(0, "Display order cannot be negative.")
      .max(10000, "Display order is too large."),

    isVisible: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.issueDate && values.expirationDate && values.expirationDate < values.issueDate) {
      context.addIssue({
        code: "custom",
        path: ["expirationDate"],
        message: "Expiration date cannot be earlier than issue date.",
      });
    }
  });

export type CertificationFormValues = z.infer<typeof certificationFormSchema>;

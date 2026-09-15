import { z } from "zod";

const adminEmailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(320, "Email is too long.")
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase());

export const loginSchema = z.object({
  email: adminEmailSchema,
  password: z.string().min(1, "Password is required.").max(128, "Password is too long."),
});

export const provisionAdminSchema = z.object({
  email: adminEmailSchema,
  password: z
    .string()
    .min(14, "Admin password must contain at least 14 characters.")
    .max(128, "Admin password must not exceed 128 characters."),
});

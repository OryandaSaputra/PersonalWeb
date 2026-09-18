import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required.").max(160),
  professionalTitle: z.string().trim().min(2, "Professional title is required.").max(160),
  shortIntroduction: z.string().trim().max(1200),
  about: z.string().trim().max(6000),
  location: z.string().trim().max(160),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(320)
    .email("Enter a valid email address."),
  phone: z.string().trim().max(50),
  showPhonePublicly: z.boolean(),
  careerFocus: z.string().trim().max(200),
  heroTagline: z.string().trim().max(240),
});

export const socialLinkFormSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(2, "Platform is required.")
    .max(80)
    .regex(/^[A-Za-z0-9._ -]+$/, "Platform contains unsupported characters."),
  label: z.string().trim().min(2, "Label is required.").max(120),
  url: z.string().trim().min(1, "URL is required.").max(2048).url("Enter a valid URL."),
  displayOrder: z.number().int().min(0).max(10000),
  isVisible: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type SocialLinkFormValues = z.infer<typeof socialLinkFormSchema>;

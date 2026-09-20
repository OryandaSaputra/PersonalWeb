import { z } from "zod";

import { PROJECT_IMAGE_TYPES } from "@/features/admin/media/config";

const uuidSchema = z.string().uuid();

export const uploadedBlobSchema = z.object({
  url: z.string().url().max(2048),

  pathname: z.string().min(1).max(500),

  originalFilename: z
    .string()
    .trim()
    .min(1, "Original filename is required.")
    .max(255, "Filename is too long."),
});

export const mediaUploadIntentSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("profile-image"),
  }),

  z.object({
    kind: z.literal("cv"),
  }),

  z.object({
    kind: z.literal("certification-image"),
    targetId: uuidSchema,
  }),

  z.object({
    kind: z.literal("project-image"),
    targetId: uuidSchema,
  }),
]);

export const projectImageMetadataSchema = z.object({
  imageType: z.enum(PROJECT_IMAGE_TYPES),

  altText: z.string().trim().min(3, "Alt text is required.").max(220, "Alt text is too long."),

  caption: z.string().trim().max(500, "Caption is too long."),

  displayOrder: z
    .number()
    .int("Display order must be an integer.")
    .min(0, "Display order cannot be negative.")
    .max(10000, "Display order is too large."),
});

export const createProjectImageSchema = projectImageMetadataSchema.extend({
  projectId: uuidSchema,
  upload: uploadedBlobSchema,
});

export const updateProjectImageSchema = projectImageMetadataSchema.extend({
  imageId: uuidSchema,
});

export const mediaIdSchema = uuidSchema;

export type UploadedBlobInput = z.infer<typeof uploadedBlobSchema>;

export type MediaUploadIntent = z.infer<typeof mediaUploadIntentSchema>;

export type ProjectImageMetadataInput = z.infer<typeof projectImageMetadataSchema>;

export type CreateProjectImageInput = z.infer<typeof createProjectImageSchema>;

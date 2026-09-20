export const IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const PDF_CONTENT_TYPES = ["application/pdf"] as const;

export const PROJECT_IMAGE_TYPES = ["cover", "screenshot"] as const;

export const MEDIA_UPLOAD_KINDS = [
  "profile-image",
  "cv",
  "certification-image",
  "project-image",
] as const;

export type MediaUploadKind = (typeof MEDIA_UPLOAD_KINDS)[number];

export type ProjectImageType = (typeof PROJECT_IMAGE_TYPES)[number];

export const MEDIA_UPLOAD_RULES = {
  "profile-image": {
    maximumSizeInBytes: 5 * 1024 * 1024,
    allowedContentTypes: IMAGE_CONTENT_TYPES,
  },
  cv: {
    maximumSizeInBytes: 10 * 1024 * 1024,
    allowedContentTypes: PDF_CONTENT_TYPES,
  },
  "certification-image": {
    maximumSizeInBytes: 5 * 1024 * 1024,
    allowedContentTypes: IMAGE_CONTENT_TYPES,
  },
  "project-image": {
    maximumSizeInBytes: 12 * 1024 * 1024,
    allowedContentTypes: IMAGE_CONTENT_TYPES,
  },
} as const satisfies Record<
  MediaUploadKind,
  {
    maximumSizeInBytes: number;
    allowedContentTypes: readonly string[];
  }
>;

export function getMediaUploadRules(kind: MediaUploadKind) {
  return MEDIA_UPLOAD_RULES[kind];
}

export function getUploadPathPrefix(kind: MediaUploadKind, targetId?: string): string {
  switch (kind) {
    case "profile-image":
      return "portfolio/profile/";

    case "cv":
      return "portfolio/cv/";

    case "certification-image":
      if (!targetId) {
        throw new Error("Certification target is required.");
      }

      return `portfolio/certifications/${targetId}/`;

    case "project-image":
      if (!targetId) {
        throw new Error("Project target is required.");
      }

      return `portfolio/projects/${targetId}/`;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

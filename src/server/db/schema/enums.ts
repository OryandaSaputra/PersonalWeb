import { pgEnum } from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", ["draft", "published", "hidden"]);

export const caseStudyVisibilityEnum = pgEnum("case_study_visibility", [
  "public",
  "limited",
  "private",
]);

export const projectImageTypeEnum = pgEnum("project_image_type", ["cover", "screenshot"]);

export const contactMessageStatusEnum = pgEnum("contact_message_status", [
  "unread",
  "read",
  "archived",
]);

export const mediaVisibilityEnum = pgEnum("media_visibility", ["public", "private"]);

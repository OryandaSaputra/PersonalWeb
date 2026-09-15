import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { caseStudyVisibilityEnum, projectImageTypeEnum, projectStatusEnum } from "./enums";
import { mediaAssets } from "./media";
import { timestamps } from "./shared";

export const technologies = pgTable(
  "technologies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull().unique(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    ...timestamps(),
  },
  (table) => [
    check("technologies_slug_format_check", sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 220 }).notNull(),
    slug: varchar("slug", { length: 240 }).notNull().unique(),
    projectType: varchar("project_type", { length: 80 }),
    organization: varchar("organization", { length: 220 }),
    shortDescription: varchar("short_description", { length: 500 }).notNull(),
    fullDescription: text("full_description"),
    background: text("background"),
    problem: text("problem"),
    solution: text("solution"),
    role: text("role"),
    keyFeatures: jsonb("key_features")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    challenges: text("challenges"),
    learning: text("learning"),
    repositoryUrl: text("repository_url"),
    liveUrl: text("live_url"),
    documentationUrl: text("documentation_url"),
    startDate: date("start_date", { mode: "string" }),
    endDate: date("end_date", { mode: "string" }),
    status: projectStatusEnum("status").default("draft").notNull(),
    caseStudyVisibility: caseStudyVisibilityEnum("case_study_visibility")
      .default("public")
      .notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    publishedAt: date("published_at", { mode: "string" }),
    ...timestamps(),
  },
  (table) => [
    index("projects_status_order_idx").on(table.status, table.displayOrder),
    index("projects_featured_order_idx").on(table.isFeatured, table.displayOrder),
    check("projects_slug_format_check", sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
    check("projects_display_order_check", sql`${table.displayOrder} >= 0`),
    check(
      "projects_date_range_check",
      sql`${table.startDate} IS NULL OR ${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`,
    ),
    check(
      "projects_featured_published_check",
      sql`${table.isFeatured} = false OR ${table.status} = 'published'`,
    ),
    check(
      "projects_published_at_check",
      sql`${table.status} <> 'published' OR ${table.publishedAt} IS NOT NULL`,
    ),
  ],
);

export const projectTechnologies = pgTable(
  "project_technologies",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technologyId: uuid("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "restrict" }),
    displayOrder: integer("display_order").default(0).notNull(),
  },
  (table) => [
    primaryKey({
      name: "project_technologies_pk",
      columns: [table.projectId, table.technologyId],
    }),
    index("project_technologies_technology_idx").on(table.technologyId),
    check("project_technologies_display_order_check", sql`${table.displayOrder} >= 0`),
  ],
);

export const projectImages = pgTable(
  "project_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    mediaAssetId: uuid("media_asset_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "restrict" }),
    imageType: projectImageTypeEnum("image_type").default("screenshot").notNull(),
    caption: varchar("caption", { length: 300 }),
    altText: varchar("alt_text", { length: 300 }).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    ...timestamps(),
  },
  (table) => [
    index("project_images_project_order_idx").on(table.projectId, table.displayOrder),
    uniqueIndex("project_images_single_cover_idx")
      .on(table.projectId)
      .where(sql`${table.imageType} = 'cover'`),
    check("project_images_display_order_check", sql`${table.displayOrder} >= 0`),
  ],
);

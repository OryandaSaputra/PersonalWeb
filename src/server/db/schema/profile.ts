import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  smallint,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { mediaAssets } from "./media";
import { timestamps } from "./shared";

export const profiles = pgTable(
  "profiles",
  {
    id: smallint("id").default(1).primaryKey(),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    professionalTitle: varchar("professional_title", { length: 160 }).notNull(),
    shortIntroduction: text("short_introduction"),
    about: text("about"),
    location: varchar("location", { length: 160 }),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    showPhonePublicly: boolean("show_phone_publicly").default(false).notNull(),
    careerFocus: varchar("career_focus", { length: 200 }),
    heroTagline: varchar("hero_tagline", { length: 240 }),
    profileImageMediaId: uuid("profile_image_media_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    cvMediaId: uuid("cv_media_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    ...timestamps(),
  },
  (table) => [check("profiles_singleton_check", sql`${table.id} = 1`)],
);

export const socialLinks = pgTable(
  "social_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: smallint("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    platform: varchar("platform", { length: 80 }).notNull(),
    label: varchar("label", { length: 120 }).notNull(),
    url: text("url").notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex("social_links_profile_platform_unique_idx").on(table.profileId, table.platform),
    index("social_links_visible_order_idx").on(table.isVisible, table.displayOrder),
    check("social_links_display_order_check", sql`${table.displayOrder} >= 0`),
  ],
);

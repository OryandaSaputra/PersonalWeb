import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

import { mediaVisibilityEnum } from "./enums";
import { timestamps } from "./shared";

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    provider: varchar("provider", { length: 50 }).default("vercel_blob").notNull(),
    storageKey: text("storage_key").notNull().unique(),
    originalFilename: varchar("original_filename", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 120 }).notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    visibility: mediaVisibilityEnum("visibility").default("private").notNull(),
    ...timestamps(),
  },
  (table) => [
    index("media_assets_visibility_idx").on(table.visibility),
    check("media_assets_size_positive_check", sql`${table.sizeBytes} > 0`),
    check("media_assets_width_positive_check", sql`${table.width} IS NULL OR ${table.width} > 0`),
    check(
      "media_assets_height_positive_check",
      sql`${table.height} IS NULL OR ${table.height} > 0`,
    ),
  ],
);

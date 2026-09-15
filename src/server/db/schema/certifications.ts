import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { mediaAssets } from "./media";
import { timestamps } from "./shared";

export const certifications = pgTable(
  "certifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 220 }).notNull(),
    issuer: varchar("issuer", { length: 200 }).notNull(),
    status: varchar("status", { length: 100 }),
    issueDate: date("issue_date", { mode: "string" }),
    expirationDate: date("expiration_date", { mode: "string" }),
    credentialId: varchar("credential_id", { length: 200 }),
    credentialUrl: text("credential_url"),
    certificateMediaId: uuid("certificate_media_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    displayOrder: integer("display_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps(),
  },
  (table) => [
    index("certifications_visible_order_idx").on(table.isVisible, table.displayOrder),
    check(
      "certifications_date_range_check",
      sql`${table.issueDate} IS NULL OR ${table.expirationDate} IS NULL OR ${table.expirationDate} >= ${table.issueDate}`,
    ),
    check("certifications_display_order_check", sql`${table.displayOrder} >= 0`),
  ],
);

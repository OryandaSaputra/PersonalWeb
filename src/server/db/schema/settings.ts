import { sql } from "drizzle-orm";
import { boolean, check, pgTable, smallint, text, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "./shared";

export const siteSettings = pgTable(
  "site_settings",
  {
    id: smallint("id").default(1).primaryKey(),
    siteName: varchar("site_name", { length: 160 }).default("Oryanda Saputra").notNull(),
    siteTagline: varchar("site_tagline", { length: 240 }),
    defaultSeoTitle: varchar("default_seo_title", { length: 200 }),
    defaultSeoDescription: text("default_seo_description"),
    defaultLanguage: varchar("default_language", { length: 10 }).default("en").notNull(),
    contactFormEnabled: boolean("contact_form_enabled").default(true).notNull(),
    ...timestamps(),
  },
  (table) => [check("site_settings_singleton_check", sql`${table.id} = 1`)],
);

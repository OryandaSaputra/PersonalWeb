import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestamps } from "./shared";

export const skillCategories = pgTable(
  "skill_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull().unique(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    displayOrder: integer("display_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps(),
  },
  (table) => [
    index("skill_categories_visible_order_idx").on(table.isVisible, table.displayOrder),
    check("skill_categories_slug_format_check", sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
    check("skill_categories_display_order_check", sql`${table.displayOrder} >= 0`),
  ],
);

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => skillCategories.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    icon: varchar("icon", { length: 120 }),
    displayOrder: integer("display_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex("skills_category_name_unique_idx").on(table.categoryId, table.name),
    index("skills_category_visible_order_idx").on(
      table.categoryId,
      table.isVisible,
      table.displayOrder,
    ),
    check("skills_display_order_check", sql`${table.displayOrder} >= 0`),
  ],
);

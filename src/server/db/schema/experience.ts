import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  smallint,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestamps } from "./shared";

export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    company: varchar("company", { length: 200 }).notNull(),
    position: varchar("position", { length: 200 }).notNull(),
    employmentType: varchar("employment_type", { length: 80 }),
    location: varchar("location", { length: 160 }),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }),
    isCurrent: boolean("is_current").default(false).notNull(),
    description: text("description"),
    responsibilities: jsonb("responsibilities")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    technologies: jsonb("technologies")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    achievements: jsonb("achievements")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps(),
  },
  (table) => [
    index("experiences_visible_order_idx").on(table.isVisible, table.displayOrder),
    index("experiences_start_date_idx").on(table.startDate),
    check(
      "experiences_date_range_check",
      sql`${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`,
    ),
    check(
      "experiences_current_end_date_check",
      sql`${table.isCurrent} = false OR ${table.endDate} IS NULL`,
    ),
    check("experiences_display_order_check", sql`${table.displayOrder} >= 0`),
  ],
);

export const organizationExperiences = pgTable(
  "organization_experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organization: varchar("organization", { length: 200 }).notNull(),
    position: varchar("position", { length: 200 }).notNull(),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }),
    isCurrent: boolean("is_current").default(false).notNull(),
    description: text("description"),
    responsibilities: jsonb("responsibilities")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps(),
  },
  (table) => [
    index("organization_experiences_visible_order_idx").on(table.isVisible, table.displayOrder),
    check(
      "organization_experiences_date_range_check",
      sql`${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`,
    ),
    check(
      "organization_experiences_current_end_date_check",
      sql`${table.isCurrent} = false OR ${table.endDate} IS NULL`,
    ),
    check("organization_experiences_display_order_check", sql`${table.displayOrder} >= 0`),
  ],
);

export const educations = pgTable(
  "educations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    institution: varchar("institution", { length: 220 }).notNull(),
    degree: varchar("degree", { length: 160 }).notNull(),
    major: varchar("major", { length: 160 }).notNull(),
    startYear: smallint("start_year").notNull(),
    graduationYear: smallint("graduation_year"),
    gpa: numeric("gpa", { precision: 3, scale: 2, mode: "number" }),
    gpaScale: numeric("gpa_scale", {
      precision: 3,
      scale: 2,
      mode: "number",
    })
      .default(4)
      .notNull(),
    description: text("description"),
    displayOrder: integer("display_order").default(0).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    ...timestamps(),
  },
  (table) => [
    index("educations_visible_order_idx").on(table.isVisible, table.displayOrder),
    check("educations_start_year_check", sql`${table.startYear} BETWEEN 1900 AND 2100`),
    check(
      "educations_graduation_year_check",
      sql`${table.graduationYear} IS NULL OR ${table.graduationYear} BETWEEN 1900 AND 2100`,
    ),
    check(
      "educations_year_range_check",
      sql`${table.graduationYear} IS NULL OR ${table.graduationYear} >= ${table.startYear}`,
    ),
    check("educations_gpa_scale_check", sql`${table.gpaScale} > 0`),
    check(
      "educations_gpa_check",
      sql`${table.gpa} IS NULL OR (${table.gpa} >= 0 AND ${table.gpa} <= ${table.gpaScale})`,
    ),
    check("educations_display_order_check", sql`${table.displayOrder} >= 0`),
  ],
);

import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { contactMessageStatusEnum } from "./enums";
import { timestamps } from "./shared";

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    subject: varchar("subject", { length: 220 }).notNull(),
    message: text("message").notNull(),
    status: contactMessageStatusEnum("status").default("unread").notNull(),
    readAt: timestamp("read_at", {
      withTimezone: true,
      mode: "date",
    }),
    archivedAt: timestamp("archived_at", {
      withTimezone: true,
      mode: "date",
    }),
    ...timestamps(),
  },
  (table) => [
    index("contact_messages_status_created_idx").on(table.status, table.createdAt),
    index("contact_messages_created_at_idx").on(table.createdAt),
  ],
);

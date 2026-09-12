import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  integer,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formStatusEnum = pgEnum("form_status_enum", ["publish", "unpublish", "closed"]);

export const formsTable = pgTable("forms", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 70 }).notNull(),
  description: varchar("description", { length: 200 }),
  userId: uuid("userId")
    .notNull()
    .references(() => usersTable.id),

  expireAt: timestamp("expire_at"),
  status: formStatusEnum("status").default("publish"),
  responseLimit: integer("response_limit"),
  isPrivate: boolean("is_private").default(false).notNull(),
  hashPassword: text("hash_password"),
  templateId: text("template_id"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

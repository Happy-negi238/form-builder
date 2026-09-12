import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const templatesTable = pgTable("template", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 70 }).notNull(),
  description: varchar("description", { length: 200 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

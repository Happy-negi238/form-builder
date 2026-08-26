import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formsTable = pgTable("forms", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 70 }).notNull(),
  description: varchar("description", { length: 200 }),
  userId: uuid("userId")
    .notNull()
    .references(() => usersTable.id),
  

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

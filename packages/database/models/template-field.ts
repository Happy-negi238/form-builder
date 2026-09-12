import { pgTable, uuid, varchar, timestamp, pgEnum, json } from "drizzle-orm/pg-core";
import { templatesTable } from "./templates";

// export interface FormTemplateFieldValue {
//   formFieldName: string;
// }

// export type FormTemplateValueRow = FormTemplateFieldValue[];

export const templateFieldTypeEnum = pgEnum("template_field_type_enum", [
  "TEXT",
  "EMAIL",
  "PASSWORD",
  "NUMBER",
  "YES_NO",
]);

export const templateFieldTable = pgTable("template_field", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: varchar("label", { length: 70 }).notNull(),
  description: varchar("description", { length: 100 }),

  templateId: uuid("template_id").references(() => templatesTable.id),
  type: templateFieldTypeEnum("type").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

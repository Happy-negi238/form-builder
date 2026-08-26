import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  numeric,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type_enum", [
  "TEXT",
  "EMAIL",
  "PASSWORD",
  "NUMBER",
  "YES_NO",
]);

export const formField = pgTable(
  "form_fields",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    label: varchar("label", { length: 70 }).notNull(),
    labelKey: varchar("label_key", { length: 100 }).notNull(),
    description: varchar("description", { length: 100 }),
    type: fieldTypeEnum("type").notNull(),

    placeholder: varchar("placeholder", { length: 70 }),
    isRequired: boolean("is_required").default(false).notNull(),
    index: numeric("index", { scale: 2 }).notNull(),

    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => {
    return [unique("form_fields_index_form_id_unique").on(table.index, table.formId)];
  },
);

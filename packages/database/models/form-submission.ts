import {
  pgTable,
  uuid,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export interface FormSubmissionValue {
  formFieldId: string;
  value: string;
}

export type FormSubmissionValueRow = FormSubmissionValue[];

export const formSubmission = pgTable("form_submissons", {
  id: uuid("id").defaultRandom().primaryKey(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id),

  values: json("values").$type<FormSubmissionValueRow>(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

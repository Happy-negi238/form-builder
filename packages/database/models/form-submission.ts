import { pgTable, uuid, timestamp, json, text, uniqueIndex } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export interface FormSubmissionValue {
  formFieldId: string;
  value: string;
}

export type FormSubmissionValueRow = FormSubmissionValue[];

export const formSubmission = pgTable(
  "form_submissons",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id),
    fingerprint: text("fingerprint").notNull(),

    values: json("values").$type<FormSubmissionValueRow>(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => [
    {
      // One fingerprint can submit only once per form
      fingerprintUnique: uniqueIndex("submissions_form_fingerprint_idx").on(
        table.formId,
        table.fingerprint,
      ),
    },
  ],
);

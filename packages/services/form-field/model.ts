import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "EMAIL", "PASSWORD", "NUMBER", "YES_NO"]);

export const createFormFieldInput = z.object({
  label: z.string().min(2).max(70).describe("Label for the field"),
  type: fieldTypeEnum.describe("Form field enums"),
  formId: z.string().describe("UUID of the form this field belong to"),
  placeholder: z.string().max(70).optional().describe("Placeholder for the field"),
  description: z.string().max(100).optional().describe("Description of the field"),
  isRequired: z.boolean().default(false).optional().describe("Wheather the field is required"),
});

export type CreateFormFieldInputType = z.infer<typeof createFormFieldInput>;

export const formFieldBulkUpsertItemInput = z.object({
  id: z.string().uuid().nullable().optional().describe("Field ID when updating, null or omitted when creating"),
  label: z.string().min(2).max(70).describe("Label for the field"),
  type: fieldTypeEnum.optional().default("TEXT").describe("Field type; defaults to TEXT when omitted"),
  placeholder: z.string().max(70).optional().nullable().describe("Placeholder for the field"),
  desc: z.string().max(100).optional().nullable().describe("Description of the field"),
  description: z.string().max(100).optional().nullable().describe("Alias for desc"),
  isRequired: z.boolean().default(false).optional().describe("Whether the field is required"),
});

export type FormFieldBulkUpsertItemInputType = z.infer<typeof formFieldBulkUpsertItemInput>;

export const bulkUpsertFormFieldInput = z.object({
  formId: z.string().describe("UUID of the form this field belongs to"),
  fields: z.array(formFieldBulkUpsertItemInput).min(1).describe("Array of fields to upsert"),
});

export type BulkUpsertFormFieldInputType = z.infer<typeof bulkUpsertFormFieldInput>;

export const updateFormFieldInput = z.object({
  label: z.string().min(2).max(70).describe("Label for the field"),
  type: fieldTypeEnum.describe("Form field enums"),
  fieldId: z.string().describe("UUID of the field"),
  placeholder: z.string().max(70).optional().nullable().describe("Placeholder for the field"),
  description: z.string().max(100).optional().nullable().describe("Description of the field"),
  isRequired: z.boolean().optional().nullable().describe("Wheather the field is required"),
});

export type UpdateFormFieldInputType = z.infer<typeof updateFormFieldInput>;

export const getFormFieldInput = z.object({
  formId: z.string().describe("UUID of the form"),
});

export type GetFormFieldInputType = z.infer<typeof getFormFieldInput>;

export const deleteFormFieldInput = z.object({
  fieldId: z.string().describe("UUID of the form field"),
});

export type DeleteFormFieldInputType = z.infer<typeof deleteFormFieldInput>;

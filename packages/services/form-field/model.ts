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

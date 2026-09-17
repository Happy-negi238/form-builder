import z from "zod";
import { templateFieldTypeEnum } from "@repo/database/models/template-field";

export const createTemplateFieldInput = z.object({
  label: z.string().max(70).describe("name of the template field"),
  description: z.string().max(100).optional().describe("description of the template field"),
  type: z.enum(templateFieldTypeEnum.enumValues).describe("type of the template field"),
  isRequired: z.boolean().default(false).describe("whether the field is required or not"),
  templateId: z.string().describe("Id of the template to which the field belongs"),
});

export type CreateTemplateFieldInputType = z.infer<typeof createTemplateFieldInput>;

export const deleteTemplateFieldInput = z.object({
  templateFieldId: z.string().describe("Id of the template field to be deleted"),
});

export type DeleteTemplateFieldInputType = z.infer<typeof deleteTemplateFieldInput>;

import { z } from "zod";

export const createTemplateInput = z.object({
  title: z.string().max(70).describe("title of the template"),
  description: z.string().max(200).optional().describe("description of the template"),
});

export type CreateTemplateInputType = z.infer<typeof createTemplateInput>;

export const getTemplateByIdInput = z.object({
  templateId: z.string().describe("Id of the template to fetch"),
});

export type GetTemplateByIdInputType = z.infer<typeof getTemplateByIdInput>;


export const deleteTemplateInput = z.object({
  templateId: z.string().describe("Id of the template"),
});

export type DeleteTemplateInputType = z.infer<typeof deleteTemplateInput>;

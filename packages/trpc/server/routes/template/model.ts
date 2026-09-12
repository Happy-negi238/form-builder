import z from "zod";

export const createTemplateInputModel = z.object({
  title: z.string().max(70).describe("title of the template"),
  description: z.string().max(200).optional().describe("description of the template"),
});

export const createTemplateOutputModel = z.object({
  id: z.string().describe("Id of the template"),
});

export const deleteTemplateInputModel = z.object({
  templateId: z.string().describe("Id of the template"),
});

export const deleteTemplateOutputModel = z.object({
  id: z.string().describe("Id of the template"),
});

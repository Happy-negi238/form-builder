import z from "zod";

// Template to Form input and output models
export const insertTemplateDataToFormInputModel = z.object({
  title: z.string().max(70).describe("title of the form"),
  description: z.string().max(200).describe("Description of the form"),
  expireAt: z.coerce.date().nullable().optional().describe("expire time of the form"),
  templateId: z.string().nullable().optional().describe("template id of the form"),
  status: z
    .enum(["unpublish", "publish", "closed"])
    .nullable()
    .optional()
    .default("publish")
    .describe("status of the form"),
  responseLimit: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe("response limit of the value"),
  isPrivate: z.boolean().default(false).describe("private value of the form"),
  password: z
    .string()
    .min(8)
    .max(100)
    .nullable()
    .optional()
    .describe("raw password for a private form"),
  fields: z.array(
    z.object({
      label: z.string().describe("The label of the form field"),
      description: z.string().describe("The description of the form field").nullable(),
      type: z
        .enum(["TEXT", "EMAIL", "NUMBER", "YES_NO", "PASSWORD"])
        .describe("The type of the form field"),
      isRequired: z.boolean().default(false).describe("Whether the form field is required"),
    }),
  ),
});

export const insertTemplateDataToFormOutputModel = z.object({
  id: z.string().describe("Id of the created form"),
  title: z.string().max(70).describe("title of the form"),
  description: z.string().max(200).nullable().optional().describe("Description of the form"),
  templateId: z.string().nullable().optional().describe("template id of the form"),
  userId: z.string().describe("user id of the user who create the form"),
  expireAt: z.date().nullable().optional().describe("expire time of the form"),
  status: z
    .enum(["unpublish", "publish", "closed"])
    .nullable()
    .optional()
    .default("publish")
    .describe("status of the form"),
  responseLimit: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe("response limit of the value"),
  isPrivate: z.boolean().default(false).describe("private value of the form"),
  fields: z.array(
    z.object({
      id: z.string().describe("Id of the created form field"),
      label: z.string().describe("The label of the form field"),
      description: z.string().max(100).nullable().describe("The description of the form field"),
      type: z
        .enum(["TEXT", "EMAIL", "NUMBER", "YES_NO", "PASSWORD"])
        .describe("The type of the form field"),
      isRequired: z.boolean().default(false).describe("Whether the form field is required"),
    }),
  ),
});

// Template input and output models
export const createTemplateInputModel = z.object({
  title: z.string().max(70).describe("title of the template"),
  description: z.string().max(200).optional().describe("description of the template"),
});

export const createTemplateOutputModel = z.object({
  id: z.string().describe("Id of the template"),
});

export const getAllTemplatesInputModel = z.undefined();

export const getAllTemplatesOutputModel = z.array(
  z.object({
    id: z.string().describe("Id of the template"),
    title: z.string().max(70).describe("title of the template"),
    description: z.string().max(200).nullable().describe("description of the template"),
    createdAt: z.date().describe("creation date of the template").nullable(),
    updatedAt: z.date().describe("last update date of the template").nullable(),
  }),
);

export const getTemplateByIdInputModel = z.object({
  templateId: z.string().describe("Id of the template"),
});

export const getTemplateByIdOutputModel = z.object({
  id: z.string().describe("Id of the template"),
  title: z.string().max(70).describe("title of the template"),
  description: z.string().max(200).nullable().describe("description of the template"),
  fields: z.array(
    z.object({
      id: z.string().describe("Id of the template field"),
      label: z.string().max(70).describe("name of the template field"),
      description: z.string().max(100).nullable().describe("description of the template field"),
      type: z
        .enum(["NUMBER", "TEXT", "EMAIL", "PASSWORD", "YES_NO"])
        .describe("type of the template field"),
      isRequired: z.boolean().default(false).describe("whether the field is required or not"),
    }),
  ),
});

export const deleteTemplateInputModel = z.object({
  templateId: z.string().describe("Id of the template"),
});

export const deleteTemplateOutputModel = z.object({
  id: z.string().describe("Id of the template"),
});

// Template Field input and output models
export const createTemplateFieldInputModel = z.object({
  label: z.string().max(70).describe("name of the template field"),
  description: z.string().max(100).optional().describe("description of the template field"),
  type: z
    .enum(["NUMBER", "TEXT", "EMAIL", "PASSWORD", "YES_NO"])
    .describe("type of the template field"),
  isRequired: z.boolean().default(false).describe("whether the field is required or not"),
  templateId: z.string().describe("Id of the template to which the field belongs"),
});

export const createTemplateFieldOutputModel = z.object({
  id: z.string().describe("Id of the template field"),
});

export const deleteTemplateFieldInputModel = z.object({
  templateFieldId: z.string().describe("Id of the template field to be deleted"),
});

export const deleteTemplateFieldOutputModel = z.object({
  id: z.string().describe("Id of the template field"),
});

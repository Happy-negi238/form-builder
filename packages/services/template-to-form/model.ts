import z from "zod";

export const insertTemplateDataToFormInput = z.object({
  title: z.string().max(70).describe("title of the form"),
  description: z.string().max(200).describe("Description of the form"),
  userId: z.string().describe("user id of the user who create the form"),
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

export type InsertTemplateDataToFormInputType = z.infer<typeof insertTemplateDataToFormInput>;

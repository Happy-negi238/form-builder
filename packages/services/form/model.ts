import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().max(70).describe("title of the form"),
  description: z.string().max(200).describe("Description of the form"),
  userId: z.string().describe("user id of the user who create the form"),
  expireAt: z.coerce.date().nullable().optional().describe("expire time of the form"),
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
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const getFromByIdInput = z.object({
  formId: z.string().describe("Id of the form"),
});

export type GetFromByIdInputType = z.infer<typeof getFromByIdInput>;

export const listFormByUserIdInput = z.object({
  userId: z.string().describe("User id"),
});

export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>;

export const checkFromPasswordInput = z.object({
  password: z.string().describe("password of the form"),
  formId: z.string().describe("Id of the form"),
});

export type CheckFromPasswordInputType = z.infer<typeof checkFromPasswordInput>;

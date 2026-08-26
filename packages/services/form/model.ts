import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().max(70).describe("title of the form"),
  description: z.string().max(200).describe("Description of the form"),
  userId: z.string().describe("user id of the user who create the form"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const listFormByUserIdInput = z.object({
  userId: z.string().describe("User id"),
});

export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>;

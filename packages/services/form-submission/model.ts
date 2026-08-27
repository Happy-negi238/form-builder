import z from "zod";

export const formSubmissionObject = z.object({
  formFieldId: z.string().describe("UUID of the form field"),
  value: z.string().describe("Values of the form field filled by user"),
});

export const formSubmissionInput = z.object({
  formId: z.string().describe("UUID of the form"),
  values: z.array(formSubmissionObject).min(1, "At least one field is required"),
});

export type FormSubmissionInputType = z.infer<typeof formSubmissionInput>;

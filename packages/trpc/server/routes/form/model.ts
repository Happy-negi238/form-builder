import { z } from "zod";

// FORM ZOD MODEL
const fieldTypeEnum = z.enum(["TEXT", "EMAIL", "PASSWORD", "NUMBER", "YES_NO"]);

export const getFromByIdInputModel = z.object({
  formId: z.string().describe("Id of the form"),
});

export const getFormFieldOutputObject = z.object({
  id: z.string().describe("UUID of the form field"),
  label: z.string().describe("Label of the form field"),
  labelKey: z.string().describe("Label key of the form field"),
  description: z.string().nullable().describe("Description of the form field"),
  type: fieldTypeEnum.describe("Type of the form field"),
  placeholder: z.string().nullable().describe("Placeholder of the form field"),
  isRequired: z.boolean().describe("Whether the form field is required"),
  index: z.string().describe("Fractional index of the form field"),
});

export const getFormFieldOutputModel = getFormFieldOutputObject;

export const getFromByIdOuputModel = z
  .object({
    id: z.string().describe("Id of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().optional().describe("Description of the form"),
    createdAt: z.date().nullable().describe("when form is created"),
    updatedAt: z.date().nullable().describe("when form is update"),
    fields: z.array(getFormFieldOutputModel).describe("form fields"),
    isPrivate: z.boolean().default(false).describe("form is private or not"),
    expireAt: z.date().nullable().describe("expire date of the form"),
    status: z
      .enum(["publish", "unpublish", "closed"])
      .default("publish")
      .nullable()
      .describe("current status of the form"),
  })
  .nullable();

export const checkFromPasswordInputModel = z.object({
  password: z.string().describe("password of the form"),
  formId: z.string().describe("Id of the form"),
});

export const checkFromPasswordOutputModel = z.object({
  data: z.string().describe("meesage while form password is checking"),
});

export const createFormInputModel = z.object({
  title: z.string().max(70).describe("title of the form"),
  description: z.string().max(200).describe("Description of the form"),
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

export const createFormOutputModel = z.object({
  id: z.string().describe("id of the form"),
});

export const deleteFormOutputModel = z.object({
  id: z.string().describe("id of the form"),
});

export const deleteFormInputModel = z.object({
  id: z.string().describe("id of the form"),
});

export const listFormByUserIdOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the form"),
    title: z.string().describe("title of the form"),
    description: z.string().describe("description of the form").nullable(),
    userId: z.string().describe("id of the user"),
    expireAt: z.date().nullable().describe("expire time of the form"),
    status: z
      .enum(["unpublish", "publish", "closed"])
      .nullable()
      .default("publish")
      .describe("status of the form"),
    responseLimit: z.number().nullable().describe("response limit of the value"),
    isPrivate: z.boolean().default(false).describe("private value of the form"),
    createdAt: z.date().nullable().describe("created at of the form"),
    updatedAt: z.date().nullable().describe("updated at time of the form"),
  }),
);

// FORM FIELD ZOD MODEL

export const createFormFieldInputModel = z.object({
  label: z.string().min(2).max(70).describe("Label for the field"),
  type: fieldTypeEnum.describe("Form field enums"),
  formId: z.string().describe("UUID of the form this field belong to"),
  placeholder: z.string().max(70).optional().describe("Placeholder for the field"),
  description: z.string().max(100).optional().describe("Description of the field"),
  isRequired: z.boolean().default(false).optional().describe("Wheather the field is required"),
});

export const bulkUpsertFormFieldItemInputModel = z.object({
  id: z
    .string()
    .uuid()
    .nullable()
    .optional()
    .describe("Field ID when updating, null or omitted when creating"),
  label: z.string().min(2).max(70).describe("Label for the field"),
  type: fieldTypeEnum
    .optional()
    .default("TEXT")
    .describe("Field type; defaults to TEXT when omitted"),
  placeholder: z.string().max(70).nullable().optional().describe("Placeholder for the field"),
  isRequired: z.boolean().default(false).optional().describe("Whether the field is required"),
  desc: z.string().max(100).nullable().optional().describe("Description of the field"),
  description: z.string().max(100).nullable().optional().describe("Alias description of the field"),
});

export const bulkUpsertFormFieldInputModel = z.object({
  formId: z.string().describe("UUID of the form this field belongs to"),
  fields: z.array(bulkUpsertFormFieldItemInputModel).min(1).describe("List of fields to upsert"),
});

export const bulkUpsertFormFieldOutputModel = z.object({
  data: z.array(
    z.object({
      id: z.string().describe("UUID of the form field"),
      label: z.string().describe("Label of the form field"),
      placeholder: z.string().nullable().describe("Placeholder of the form field"),
      description: z.string().nullable().describe("Description of the form field"),
      isRequired: z.boolean().describe("Whether the form field is required"),
    }),
  ),
});

export const createFormFieldOutputModel = z.object({
  id: z.string().describe("Id of the form field"),
  labelKey: z.string().describe("Label key of the form field"),
  index: z.string().describe("Fractional index of the form field"),
});

export const getFormFieldInputModel = z.object({
  formId: z.string().describe("UUID of the form"),
});

export const getFormFieldOuputModel = z.array(
  z.object({
    id: z.string().describe("UUID of the form field"),
    label: z.string().describe("Label of the form field"),
    labelKey: z.string().describe("Label key of the form field"),
    description: z.string().nullable().describe("Description of the form field"),
    type: fieldTypeEnum.describe("Type of the form field"),
    placeholder: z.string().nullable().describe("Placeholder of the form field"),
    isRequired: z.boolean().describe("Whether the form field is required"),
    index: z.string().describe("Fractional index of the form field"),
    formId: z.string().describe("UUID of the form"),
    createdAt: z.date().nullable().describe("Creation date of the form field"),
    updatedAt: z.date().nullable().describe("Last update date of the form field"),
  }),
);

export const updateFormFieldInputModel = z.object({
  label: z.string().min(2).max(70).describe("Label for the field"),
  type: fieldTypeEnum.describe("Form field enums"),
  fieldId: z.string().describe("UUID of the field"),
  placeholder: z.string().max(70).optional().nullable().describe("Placeholder for the field"),
  description: z.string().max(100).optional().nullable().describe("Description of the field"),
  isRequired: z.boolean().optional().nullable().describe("Wheather the field is required"),
});

export const updateFormFieldOutputModel = z.object({
  id: z.string().describe("UUID of the form field"),
});

export const deleteFormFieldInputModel = z.object({
  fieldId: z.string().describe("UUID of the form field"),
});

export const deleteFormFieldOutputModel = z.object({
  id: z.string().describe("UUID of the form field"),
});

// FORM SUBMISSION MODEL
export const formSubmissionInputObject = z.object({
  formFieldId: z.string().describe("UUID of the form field"),
  value: z.string().describe("Values of the form field filled by user"),
});

export const formSubmissionInputModel = z.object({
  formId: z.string().describe("UUID of the form"),
  values: z.array(formSubmissionInputObject).min(1, "At least one field is required"),
});

export const formSubmissionOuputModel = z.object({
  formSubmissionId: z.string().describe("UUID of the form submission"),
});

export const getFormSubmissionByIdInputObject = z.object({
  id: z.string().describe("UUID of the form submission"),
  formId: z.string().describe("UUID of the form"),
  values: z.array(
    z.object({
      formFieldId: z.string().describe("UUID of the form field"),
      value: z.string().describe("Value of the form field"),
    }),
  ),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});
export const getFormSubmissionByIdIntputModel = z.object({
  formId: z.string().describe("UUID of the form"),
});

export const getFormSubmissionByIdOutputModel = z.array(getFormSubmissionByIdInputObject);

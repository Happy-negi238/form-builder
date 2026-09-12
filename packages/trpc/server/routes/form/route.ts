import z from "zod";
import { formFieldService, formService, formSubmissionService } from "../../services";
import { authenticationProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  bulkUpsertFormFieldInputModel,
  bulkUpsertFormFieldOutputModel,
  checkFromPasswordInputModel,
  checkFromPasswordOutputModel,
  createFormFieldInputModel,
  createFormFieldOutputModel,
  createFormInputModel,
  createFormOutputModel,
  deleteFormFieldInputModel,
  deleteFormFieldOutputModel,
  deleteFormInputModel,
  deleteFormOutputModel,
  formSubmissionInputModel,
  formSubmissionOuputModel,
  getFormFieldInputModel,
  getFormFieldOuputModel,
  getFormSubmissionByIdIntputModel,
  getFormSubmissionByIdOutputModel,
  getFromByIdInputModel,
  getFromByIdOuputModel,
  listFormByUserIdOutputModel,
  updateFormFieldInputModel,
  updateFormFieldOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  // FORM PROCEDURE
  getFromById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFromById"),
        tags: TAGS,
      },
    })
    .input(getFromByIdInputModel)
    .output(getFromByIdOuputModel)
    .query(async ({ input }) => {
      const { formId } = input;

      const { id, createdAt, description, title, updatedAt, fields, expireAt, isPrivate, status } =
        await formService.getFromById({ formId });

      return { id, createdAt, description, title, updatedAt, fields, expireAt, isPrivate, status };
    }),

  checkFromPassword: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/checkFromPassword"),
      },
    })
    .input(checkFromPasswordInputModel)
    .output(checkFromPasswordOutputModel)
    .query(async ({ input }) => {
      const { formId, password } = input;

      const data = await formService.checkFromPassword({ formId, password });
      return data;
    }),

  createForm: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { description, title, expireAt, isPrivate, password, responseLimit, status } = input;

      const { id } = await formService.createForm({
        description,
        title,
        userId: ctx.userId,
        expireAt,
        isPrivate,
        password,
        responseLimit,
        status,
      });
      return {
        id,
      };
    }),

  deleteForm: authenticationProcedure
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { id } = await formService.deleteFormById(input.id, ctx.userId);
      return { id };
    }),

  listFormByUserId: authenticationProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listFormByUserId"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(z.undefined())
    .output(listFormByUserIdOutputModel)
    .query(async ({ ctx }) => {
      const { userId } = ctx;
      const forms = await formService.listFormByUserId({ userId });
      return forms;
    }),

  // FORM FIELD PROCEDURE
  createFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormFieldInputModel)
    .output(createFormFieldOutputModel)
    .mutation(async ({ input }) => {
      const { formId, label, type, description, isRequired, placeholder } = input;
      const { id, index, labelKey } = await formFieldService.createFormField({
        formId,
        label,
        type,
        description,
        isRequired,
        placeholder,
      });

      return {
        id,
        index,
        labelKey,
      };
    }),

  getFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFormFieldInputModel)
    .output(getFormFieldOuputModel)
    .query(async ({ input }) => {
      const { formId } = input;
      const { data } = await formFieldService.getFormField({ formId });
      return data;
    }),

  bulkUpsertFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/bulkUpsertFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(bulkUpsertFormFieldInputModel)
    .output(bulkUpsertFormFieldOutputModel)
    .mutation(async ({ input }) => {
      const { formId, fields } = input;
      const { data } = await formFieldService.bulkUpsertFormFields({
        formId,
        fields,
      });

      return { data };
    }),

  updateFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFormFieldInputModel)
    .output(updateFormFieldOutputModel)
    .mutation(async ({ input }) => {
      const { fieldId, label, type, description, isRequired, placeholder } = input;
      const { id } = await formFieldService.updateFormField({
        fieldId,
        label,
        type,
        description,
        isRequired,
        placeholder,
      });
      return { id };
    }),

  deleteFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/deleteFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFormFieldInputModel)
    .output(deleteFormFieldOutputModel)
    .mutation(async ({ input }) => {
      const { fieldId } = input;
      const { id } = await formFieldService.deleteFormField({ fieldId });
      return { id };
    }),

  // FORM SUBMISSION
  formSubmission: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/formSubmission"),
        tags: TAGS,
      },
    })
    .input(formSubmissionInputModel)
    .output(formSubmissionOuputModel)
    .mutation(async ({ input }) => {
      const { formId, values } = input;

      const { formSubmissionId } = await formSubmissionService.formSubmission({ formId, values });
      return { formSubmissionId };
    }),

  getFormSubmissionById: authenticationProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/getFormSubmissionById"),
        protect: true,
      },
    })
    .input(getFormSubmissionByIdIntputModel)
    .output(getFormSubmissionByIdOutputModel)
    .query(async ({ input }) => {
      const { formId } = input;

      const { data } = await formSubmissionService.getFormSubmissionById({ formId });
      const filterData = data.map((submission) => ({
        ...submission,
        values: submission.values ?? [],
      }));

      return filterData;
    }),
});

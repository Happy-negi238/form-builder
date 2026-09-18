import { importTemplateToFormService, templateFieldService, templateService } from "../../services";
import { adminAuthenticateProcedure, authenticationProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createTemplateFieldInputModel,
  createTemplateFieldOutputModel,
  createTemplateInputModel,
  createTemplateOutputModel,
  deleteTemplateFieldInputModel,
  deleteTemplateFieldOutputModel,
  deleteTemplateInputModel,
  deleteTemplateOutputModel,
  getAllTemplatesInputModel,
  getAllTemplatesOutputModel,
  getTemplateByIdInputModel,
  getTemplateByIdOutputModel,
  insertTemplateDataToFormInputModel,
  insertTemplateDataToFormOutputModel,
} from "./model";

const TAGS = ["Authentication", "Admin"];
const getPath = generatePath("/authentication");

export const templateRouter = router({
  // Template to from route
  insertTemplateDataToForm: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/insertTemplateDataToForm"),
      },
    })
    .input(insertTemplateDataToFormInputModel)
    .output(insertTemplateDataToFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { templateId, ...formData } = input;
      const { userId } = ctx;

      const result = await importTemplateToFormService.InsertTemplateDataToForm({
        templateId,
        ...formData,
        userId,
      });
      return result;
    }),

  // Template routes
  createTemplate: adminAuthenticateProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/createTemplate"),
      },
    })
    .input(createTemplateInputModel)
    .output(createTemplateOutputModel)
    .mutation(async ({ input }) => {
      const { title, description } = input;

      const { id } = await templateService.createTemplate({ title, description });
      return { id };
    }),

  getAllTemplates: authenticationProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/getAllTemplates"),
      },
    })
    .input(getAllTemplatesInputModel)
    .output(getAllTemplatesOutputModel)
    .query(async () => {
      const templates = await templateService.getAllTemplates();
      return templates;
    }),

  getTemplateById: authenticationProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/getTemplateById"),
      },
    })
    .input(getTemplateByIdInputModel)
    .output(getTemplateByIdOutputModel)
    .query(async ({ input }) => {
      const { templateId } = input;

      const result = await templateService.getTemplateById({ templateId });
      return result;
    }),

  deleteTemplate: adminAuthenticateProcedure
    .meta({
      openapi: {
        method: "DELETE",
        tags: TAGS,
        path: getPath("/deleteTemplate"),
      },
    })
    .input(deleteTemplateInputModel)
    .output(deleteTemplateOutputModel)
    .mutation(async ({ input }) => {
      const { templateId } = input;

      const { id } = await templateService.deleteTemplate({ templateId });
      return { id };
    }),

  // Template Field routes
  createTemplateField: adminAuthenticateProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/createTemplateField"),
      },
    })
    .input(createTemplateFieldInputModel)
    .output(createTemplateFieldOutputModel)
    .mutation(async ({ input }) => {
      const { label, description, type, isRequired, templateId } = input;

      const { id } = await templateFieldService.createTemplateField({
        label,
        description,
        type,
        isRequired,
        templateId,
      });
      return { id };
    }),

  deleteTemplateField: adminAuthenticateProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: TAGS,
        path: getPath("/deleteTemplateField"),
      },
    })
    .input(deleteTemplateFieldInputModel)
    .output(deleteTemplateFieldOutputModel)
    .mutation(async ({ input }) => {
      const { templateFieldId } = input;

      const { id } = await templateFieldService.deleteTemplateField({ templateFieldId });
      return { id };
    }),
});

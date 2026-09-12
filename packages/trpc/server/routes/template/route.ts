import { templateService } from "../../services";
import { adminAuthenticateProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createTemplateInputModel,
  createTemplateOutputModel,
  deleteTemplateInputModel,
  deleteTemplateOutputModel,
} from "./model";

const TAGS = ["Authentication", "Admin"];
const getPath = generatePath("/authentication");

export const templateRouter = router({
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

  deleteTemplate: adminAuthenticateProcedure
    .meta({
      openapi: {
        method: "POST",
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
});

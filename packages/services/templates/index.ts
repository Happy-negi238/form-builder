import db, { eq } from "@repo/database";
import {
  createTemplateInput,
  CreateTemplateInputType,
  DeleteTemplateInputType,
  deleteTemplateInput,
} from "./model";
import { templatesTable } from "@repo/database/schema";

class TemplateService {
  public async createTemplate(payload: CreateTemplateInputType) {
    const { title, description } = await createTemplateInput.parseAsync(payload);

    const insertTemplate = await db
      .insert(templatesTable)
      .values({ title, description })
      .returning({ id: templatesTable.id });

    if (!insertTemplate || !insertTemplate[0]?.id) {
      throw new Error("Something went wrong while inserting values");
    }

    return { id: insertTemplate[0].id };
  }

  public async deleteTemplate(payload: DeleteTemplateInputType) {
    const { templateId } = await deleteTemplateInput.parseAsync(payload);

    const result = await db
      .delete(templatesTable)
      .where(eq(templatesTable.id, templateId))
      .returning({ id: templatesTable.id });

    if (!result || !result[0]?.id) {
      throw new Error("Error to delete the template");
    }

    return { id: result[0].id };
  }
}

export default TemplateService;

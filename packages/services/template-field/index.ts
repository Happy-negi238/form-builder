import { templateFieldTable } from "@repo/database/schema";
import {
  createTemplateFieldInput,
  CreateTemplateFieldInputType,
  deleteTemplateFieldInput,
  DeleteTemplateFieldInputType,
} from "./models";
import db, { eq } from "@repo/database";

class TemplateFieldService {
  public async createTemplateField(payload: CreateTemplateFieldInputType) {
    const { label, description, type, isRequired, templateId } =
      await createTemplateFieldInput.parseAsync(payload);

    const [newTemplateField] = await db
      .insert(templateFieldTable)
      .values({ label, description, type, isRequired, templateId })
      .returning({ id: templateFieldTable.id });

    if (!newTemplateField || !newTemplateField.id) {
      throw new Error("Something went wrong while inserting values");
    }

    return { id: newTemplateField.id };
  }

  public async deleteTemplateField(payload: DeleteTemplateFieldInputType) {
    const { templateFieldId } = await deleteTemplateFieldInput.parseAsync(payload);

    const result = await db
      .delete(templateFieldTable)
      .where(eq(templateFieldTable.id, templateFieldId))
      .returning({ id: templateFieldTable.id });

    if (!result || !result[0]?.id) {
      throw new Error("Something went wrong while deleting the template field");
    }

    return { id: result[0].id };
  }
}

export default TemplateFieldService;

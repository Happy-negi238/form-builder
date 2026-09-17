import db, { desc, eq } from "@repo/database";
import {
  createTemplateInput,
  CreateTemplateInputType,
  DeleteTemplateInputType,
  deleteTemplateInput,
  GetTemplateByIdInputType,
  getTemplateByIdInput,
} from "./model";
import { templateFieldTable, templatesTable } from "@repo/database/schema";

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

  public async getAllTemplates() {
    const templates = await db
      .select()
      .from(templatesTable)
      .orderBy(desc(templatesTable.createdAt));

    if (!templates || templates.length === 0) {
      throw new Error("No templates found");
    }

    return templates;
  }

  public async getTemplateById(payload: GetTemplateByIdInputType) {
    const { templateId } = await getTemplateByIdInput.parseAsync(payload);

    // Use left join to fetch the template along with its fields
    const template = await db
      .select({
        id: templatesTable.id,
        title: templatesTable.title,
        description: templatesTable.description,
        fields: {
          id: templateFieldTable.id,
          label: templateFieldTable.label,
          description: templateFieldTable.description,
          isRequired: templateFieldTable.isRequired,
          type: templateFieldTable.type,
        },
      })
      .from(templatesTable)
      .leftJoin(templateFieldTable, eq(templateFieldTable.templateId, templatesTable.id))
      .where(eq(templatesTable.id, templateId));

    if (!template || template.length === 0) {
      throw new Error("Template not found");
    }
    // Group fields by template ID
    const { id, title, description } = template[0]!;

    const fields = template.flatMap((row) => (row.fields ? [row.fields] : []));

    return {
      id,
      title,
      description,
      fields,
    };
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

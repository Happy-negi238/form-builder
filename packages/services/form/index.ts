import db, { and, asc, desc, eq } from "@repo/database";
import {
  createFormInput,
  CreateFormInputType,
  getFromByIdInput,
  GetFromByIdInputType,
  listFormByUserIdInput,
  ListFormByUserIdInputType,
} from "./model";
import { formField, formsTable, usersTable } from "@repo/database/schema";

class FormService {
  private async insertFormValues({ title, description, userId }: CreateFormInputType) {
    const insertValues = await db
      .insert(formsTable)
      .values({
        title,
        userId,
        description,
      })
      .returning({
        id: formsTable.id,
      });

    if (insertValues.length <= 0 || !insertValues[0]?.id) {
      throw new Error("Something went wrong while creating the form");
    }

    return {
      id: insertValues[0].id,
    };
  }

  public async getUserByClerkId(clerkId: string) {
    if (!clerkId) {
      throw new Error("Id is not provided");
    }

    const userInfo = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
    if (userInfo.length <= 0 || !userInfo[0]?.clerkId) {
      throw new Error("User not found");
    }

    const { id } = userInfo[0];

    return {
      userId: id,
    };
  }

  public async getFromById(payload: GetFromByIdInputType) {
    const { formId } = await getFromByIdInput.parseAsync(payload);

    const result = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
        field: {
          id: formField.id,
          label: formField.label,
          placeholder: formField.placeholder,
          description: formField.description,
          labelKey: formField.labelKey,
          type: formField.type,
          index: formField.index,
          isRequired: formField.isRequired,
        },
      })
      .from(formsTable)
      .leftJoin(formField, eq(formField.formId, formsTable.id))
      .where(eq(formsTable.id, formId))
      .orderBy(asc(formField.index));

    if (result.length === 0) {
      throw new Error("Not any form exist");
    }

    const { id, description, createdAt, title, updatedAt } = result[0]!;
    const fields = result
      .filter((r) => r.field?.id !== null)
      .map((r) => r.field as NonNullable<typeof r.field>);

    return { id, description, createdAt, title, updatedAt, fields };
  }

  public async createForm(payload: CreateFormInputType) {
    const { description, title, userId } = await createFormInput.parseAsync(payload);

    const { id } = await this.insertFormValues({ title, description, userId });

    return {
      id,
    };
  }

  public async listFormByUserId(payload: ListFormByUserIdInputType) {
    const { userId } = await listFormByUserIdInput.parseAsync(payload);

    const forms = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.userId, userId))
      .orderBy(desc(formsTable.createdAt));
    return forms;
  }

  public async deleteFormById(id: string, userId: string) {
    const deletedForms = await db
      .delete(formsTable)
      .where(and(eq(formsTable.id, id), eq(formsTable.userId, userId)))
      .returning({ id: formsTable.id });

    if (deletedForms.length === 0) {
      throw new Error("Form not found");
    }

    return { id };
  }
}

export default FormService;

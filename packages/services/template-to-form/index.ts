import db from "@repo/database";
import { formsTable, formField } from "@repo/database/schema";
import bcrypt from "bcrypt";
import { InsertTemplateDataToFormInputType, insertTemplateDataToFormInput } from "./model";

class ImportTemplateToFormService {
  private async createHash(password: string): Promise<string> {
    const SALT_ROUND = 10;
    const hashPassword = await bcrypt.hash(password, SALT_ROUND);
    return hashPassword;
  }

  private toLabelKey(label: string): string {
    return label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  public async InsertTemplateDataToForm(payload: InsertTemplateDataToFormInputType) {
    const {
      title,
      description,
      templateId,
      isPrivate,
      status,
      userId,
      expireAt,
      password,
      responseLimit,
      fields,
    } = await insertTemplateDataToFormInput.parseAsync(payload);

    if (isPrivate && !password) {
      throw new Error("Password is required for private forms");
    }

    const hashPassword = isPrivate && password ? await this.createHash(password) : null;

    const transaction = db.transaction(async (tx) => {
      const [createdForm] = await tx
        .insert(formsTable)
        .values({
          title,
          description,
          templateId: templateId ?? null,
          isPrivate,
          status: status ?? "publish",
          userId,
          expireAt: expireAt ?? null,
          hashPassword,
          responseLimit: responseLimit ?? null,
        })
        .returning({
          id: formsTable.id,
        });

      if (!createdForm?.id) {
        throw new Error("Something went wrong while creating the form from template");
      }

      const createdFields = await Promise.all(
        fields.map(async (field, index) => {
          const label = field.label.trim();
          const [createdField] = await tx
            .insert(formField)
            .values({
              formId: createdForm.id,
              label,
              labelKey: this.toLabelKey(label),
              description: field.description ?? null,
              type: field.type,
              isRequired: field.isRequired,
              index: (index + 1).toFixed(2),
            })
            .returning({
              id: formField.id,
              label: formField.label,
              description: formField.description,
              type: formField.type,
              isRequired: formField.isRequired,
            });

          if (!createdField?.id) {
            throw new Error(`Something went wrong while inserting field: ${label}`);
          }

          return {
            id: createdField.id,
            label: createdField.label,
            description: createdField.description,
            type: createdField.type,
            isRequired: createdField.isRequired,
          };
        }),
      );

      return {
        id: createdForm.id,
        title,
        description,
        templateId: templateId ?? null,
        userId,
        expireAt: expireAt ?? null,
        isPrivate,
        status: status ?? "publish",
        responseLimit: responseLimit ?? null,
        fields: createdFields,
      };
    });
    return transaction;
  }
}

export default ImportTemplateToFormService;

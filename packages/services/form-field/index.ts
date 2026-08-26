import db, { desc, eq, max } from "@repo/database";
import {
  createFormFieldInput,
  CreateFormFieldInputType,
  deleteFormFieldInput,
  DeleteFormFieldInputType,
  getFormFieldInput,
  GetFormFieldInputType,
  updateFormFieldInput,
  UpdateFormFieldInputType,
} from "./model";
import { formField } from "@repo/database/schema";

class FormFieldService {
  private async getNextIndex(formId: string): Promise<string> {
    const result = await db
      .select({
        maxIndex: max(formField.index),
      })
      .from(formField)
      .where(eq(formField.formId, formId));

    const current = result[0]?.maxIndex;
    const next = current ? parseFloat(current) + 1 : 1;
    return next.toFixed(2);
  }

  private toLabelKey(label: string): string {
    return label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  public async getFormField(payload: GetFormFieldInputType) {
    const { formId } = await getFormFieldInput.parseAsync(payload);

    const result = await db
      .select()
      .from(formField)
      .where(eq(formField.formId, formId))

    if (result.length === 0 || !result[0]?.id) {
      throw new Error(`Form with this id ${formId} does not exist`);
    }

    return { data: result };
  }

  public async createFormField(payload: CreateFormFieldInputType) {
    const { formId, label, type, description, isRequired, placeholder } =
      await createFormFieldInput.parseAsync(payload);

    const index = await this.getNextIndex(formId);
    const labelKey = this.toLabelKey(label);

    const result = await db
      .insert(formField)
      .values({
        formId,
        index,
        label,
        labelKey,
        type,
        description,
        isRequired,
        placeholder,
      })
      .returning({
        id: formField.id,
      });

    if (result.length === 0 || !result[0]?.id) {
      throw new Error("Something went wrong while create form field");
    }

    return { id: result[0].id, labelKey, index };
  }

  public async updateFormField(payload: UpdateFormFieldInputType) {
    const { fieldId, label, type, description, isRequired, placeholder } =
      await updateFormFieldInput.parseAsync(payload);

    const patch: Partial<typeof formField.$inferInsert> = {};
    if (label !== undefined) patch.label = label;
    if (type !== undefined) patch.type = type;
    if (isRequired !== null) patch.isRequired = isRequired;
    if (description) patch.description = description;
    if (placeholder) patch.placeholder = placeholder;

    if (Object.keys(patch).length === 0) {
      throw new Error("No field to modify");
    }

    const result = await db
      .update(formField)
      .set(patch)
      .where(eq(formField.id, fieldId))
      .returning({ id: formField.id });

    if (result.length === 0 || !result[0]?.id) {
      throw new Error(`Field with this ID ${fieldId} does not exist`);
    }

    return { id: result[0].id };
  }

  public async deleteFormField(payload: DeleteFormFieldInputType) {
    const { fieldId } = await deleteFormFieldInput.parseAsync(payload);

    const result = await db
      .delete(formField)
      .where(eq(formField.id, fieldId))
      .returning({ id: formField.id });

    if (result.length === 0 || !result[0]?.id) {
      throw new Error(`Form field with this id ${fieldId} does not exist`);
    }

    return { id: result[0].id };
  }
}

export default FormFieldService;

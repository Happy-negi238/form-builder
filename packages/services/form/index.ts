import db, { and, asc, desc, eq, inArray } from "@repo/database";
import bcrypt from "bcrypt";
import {
  checkFromPasswordInput,
  CheckFromPasswordInputType,
  createFormInput,
  CreateFormInputType,
  getFromByIdInput,
  GetFromByIdInputType,
  listFormByUserIdInput,
  ListFormByUserIdInputType,
} from "./model";
import { formField, formsTable, formSubmission, usersTable } from "@repo/database/schema";

class FormService {
  private async insertFormValues({
    title,
    description,
    userId,
    expireAt,
    isPrivate,
    hashPassword,
    responseLimit,
    status,
  }: {
    title: string;
    description: string | null;
    userId: string;
    expireAt?: Date | null;
    isPrivate: boolean;
    hashPassword: string | null;
    responseLimit?: number | null;
    status?: "unpublish" | "publish" | "closed" | null;
  }) {
    const insertValues = await db
      .insert(formsTable)
      .values({
        title,
        userId,
        description,
        expireAt,
        isPrivate,
        hashPassword,
        responseLimit,
        status,
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

  private async createHash(password: string): Promise<string> {
    const SALT_ROUND = 10;
    const hashPassword = await bcrypt.hash(password, SALT_ROUND);
    return hashPassword;
  }

  private async checkHash(plainPassword: string, hashPassword: string): Promise<boolean> {
    const result = await bcrypt.compare(plainPassword, hashPassword);
    return result;
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
        expireAt: formsTable.expireAt,
        status: formsTable.status,
        responseLimit: formsTable.responseLimit,
        isPrivate: formsTable.isPrivate,
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

    if (result.length === 0 || !result[0]?.status) {
      throw new Error("Not any form exist");
    }

    if (result[0].status !== "publish") {
      throw new Error("Form is not publish yet");
    }

    if (!result[0].expireAt || result[0].expireAt < new Date()) {
      await db.update(formsTable).set({ status: "closed" }).where(eq(formsTable.id, formId));
      throw new Error("From is expired");
    }

    const formSubmissionResult = await db
      .select()
      .from(formSubmission)
      .where(eq(formSubmission.formId, formId));

    if (!result[0].responseLimit || result[0].responseLimit <= formSubmissionResult.length) {
      throw new Error("Form submission limit exceed");
    }

    const { id, description, createdAt, title, updatedAt, isPrivate, expireAt, status } =
      result[0]!;
    const fields = result
      .filter((r) => r.field?.id !== null)
      .map((r) => r.field as NonNullable<typeof r.field>);

    return { id, description, createdAt, title, updatedAt, fields, isPrivate, expireAt, status };
  }

  public async checkFromPassword(payload: CheckFromPasswordInputType) {
    const { password, formId } = await checkFromPasswordInput.parseAsync(payload);

    const result = await db
      .select({ hashPassword: formsTable.hashPassword })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (result.length === 0 || !result[0]?.hashPassword) {
      throw new Error("Not any password required");
    }

    const passwordValue = await this.checkHash(password, result[0].hashPassword);
    if (!passwordValue) throw new Error("Password is incorrect");

    return { data: "Password is matched" };
  }

  public async createForm(payload: CreateFormInputType) {
    const { description, title, userId, expireAt, isPrivate, password, responseLimit, status } =
      await createFormInput.parseAsync(payload);

    if (isPrivate && !password) {
      throw new Error("Password is required for private forms");
    }

    const hashGeneratedPassword = isPrivate ? await this.createHash(password!) : null;

    const { id } = await this.insertFormValues({
      title,
      description,
      userId,
      expireAt,
      isPrivate,
      hashPassword: hashGeneratedPassword,
      responseLimit,
      status,
    });

    return {
      id,
    };
  }

  public async listFormByUserId(payload: ListFormByUserIdInputType) {
    const { userId } = await listFormByUserIdInput.parseAsync(payload);

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        userId: formsTable.userId,
        expireAt: formsTable.expireAt,
        status: formsTable.status,
        responseLimit: formsTable.responseLimit,
        isPrivate: formsTable.isPrivate,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.userId, userId))
      .orderBy(desc(formsTable.createdAt));

    const now = new Date();
    const expiredFormIds = forms
      .filter((form) => form.expireAt !== null && form.expireAt <= now)
      .map((form) => form.id);

    if (expiredFormIds.length > 0) {
      await db
        .update(formsTable)
        .set({ status: "closed" })
        .where(and(eq(formsTable.userId, userId), inArray(formsTable.id, expiredFormIds)));
    }

    return forms.map((form) =>
      expiredFormIds.includes(form.id) ? { ...form, status: "closed" as const } : form,
    );
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

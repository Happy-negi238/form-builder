import db, { eq } from "@repo/database";
import {
  FormSubmissionInputType,
  GetFormSubmissionByIdInputType,
  formSubmissionInput,
  getFormSubmissionByIdInputType,
} from "./model";
import { formSubmission } from "@repo/database/schema";

class FormSubmissionService {
  public async formSubmission(payload: FormSubmissionInputType) {
    const { formId, values } = await formSubmissionInput.parseAsync(payload);

    const result = await db
      .insert(formSubmission)
      .values({ formId, values })
      .returning({ formSubmissionId: formSubmission.id });

    if (result.length === 0 || !result[0]?.formSubmissionId) {
      throw new Error("Something went wrong while inserting submission");
    }

    return { formSubmissionId: result[0].formSubmissionId };
  }

  public async getFormSubmissionById(payload: GetFormSubmissionByIdInputType) {
    const { formId } = await getFormSubmissionByIdInputType.parseAsync(payload);

    const result = await db.select().from(formSubmission).where(eq(formSubmission.formId, formId));
    if (result.length === 0) {
      throw new Error("Not any submission found");
    }

    return { data: result };
  }
}

export default FormSubmissionService;

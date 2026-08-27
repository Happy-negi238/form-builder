import db from "@repo/database";
import { FormSubmissionInputType, formSubmissionInput } from "./model";
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
}

export default FormSubmissionService;

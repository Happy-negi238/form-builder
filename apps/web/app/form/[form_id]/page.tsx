import { getFingerprint } from "~/lib/fingerprint"
import FormSubmission from "~/modules/form/components/form-submission"

const FormPage = async ({ params }: { params: Promise<{ form_id: string }> }) => {
  const { form_id: formId } = await params

  return <FormSubmission formId={formId}  />
}

export default FormPage

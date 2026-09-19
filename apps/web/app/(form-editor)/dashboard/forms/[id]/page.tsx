import { requireAuth } from "~/modules/authentication/actions";
import { FormBuilderLayout } from "~/modules/form/components/form-builder-layout"

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAuth();

  const { id } = await params;

  return <FormBuilderLayout formId={id} />
}

"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Spinner } from "~/components/ui/spinner"
import { useGetAllFormField, useGetFromSubmissionById, useListForm } from "~/hooks/api/form"

const FormSubmissionList = ({ formId }: { formId: string }) => {
  const { forms, isPending: isFormsPending, isError: isFormsError } = useListForm()
  const {
    formFields,
    isPending: isFieldsPending,
    isError: isFieldsError,
  } = useGetAllFormField(formId)
  const {
    formSubmissions,
    isPending: isSubmissionsPending,
    isError: isSubmissionsError,
  } = useGetFromSubmissionById(formId)

  if (isFormsPending || isFieldsPending || isSubmissionsPending) {
    return (
      <div className="flex items-center justify-center h-screen py-12 text-muted-foreground">
        <Spinner />
      </div>
    )
  }

  if (isFormsError || isFieldsError || isSubmissionsError) {
    return (
      <p className="py-8 text-center text-sm text-destructive" role="alert">
        Could not load form submissions.
      </p>
    )
  }

  const formTitle = forms?.find((form) => form.id === formId)?.title ?? "Form submissions"

  if (!formFields?.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">{formTitle}</h2>
        <p className="py-8 text-center text-sm text-muted-foreground">This form has no fields.</p>
      </div>
    )
  }

  if (!formSubmissions?.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">{formTitle}</h2>
        <p className="py-8 text-center text-sm text-muted-foreground">No submissions yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl capitalize font-semibold tracking-tight">{formTitle} Submissions</h2>
      <div className="overflow-x-auto rounded-sm border bg-card mt-6">
        <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            {formFields.map((field) => (
              <TableHead key={field.id} className="px-6 py-3">{field.label}</TableHead>
            ))}
            <TableHead className="px-6 py-3">Submitted at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              {formFields.map((field) => {
                const value = submission.values.find((item) => item.formFieldId === field.id)?.value

                return <TableCell key={field.id} className="px-6 py-4">{value || "-"}</TableCell>
              })}
              <TableCell className="px-6 py-4 text-muted-foreground">
                {submission.createdAt ? new Date(submission.createdAt).toLocaleString() : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default FormSubmissionList

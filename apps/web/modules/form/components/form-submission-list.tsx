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
import { useGetAllFormField, useGetFromSubmissionById } from "~/hooks/api/form"

const FormSubmissionList = ({ formId }: { formId: string }) => {
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

  if (isFieldsPending || isSubmissionsPending) {
    return (
      <div className="flex items-center justify-center h-screen py-12 text-muted-foreground">
        <Spinner />
      </div>
    )
  }

  if (isFieldsError || isSubmissionsError) {
    return (
      <p className="py-8 text-center text-sm text-destructive" role="alert">
        Could not load form submissions.
      </p>
    )
  }

  if (!formFields?.length) {
    return <p className="py-8 text-center text-sm text-muted-foreground">This form has no fields.</p>
  }

  if (!formSubmissions?.length) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No submissions yet.</p>
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {formFields.map((field) => (
              <TableHead key={field.id}>{field.label}</TableHead>
            ))}
            <TableHead>Submitted at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              {formFields.map((field) => {
                const value = submission.values.find((item) => item.formFieldId === field.id)?.value

                return <TableCell key={field.id}>{value || "-"}</TableCell>
              })}
              <TableCell className="text-muted-foreground">
                {submission.createdAt ? new Date(submission.createdAt).toLocaleString() : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default FormSubmissionList

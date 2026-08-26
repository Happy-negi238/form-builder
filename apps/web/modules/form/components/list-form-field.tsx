"use client"

import { Pencil, Trash2 } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Spinner } from "~/components/ui/spinner"
import { useDeleteFormField, useGetAllFormField } from "~/hooks/api/form"

type ListFormFieldProps = {
  formId: string
}

const ListFormField = ({ formId }: ListFormFieldProps) => {
  const { formFields, isPending, isError, error } = useGetAllFormField(formId)
  const { deleteFormFieldAsync, isPending: isDeleting } = useDeleteFormField()

  const handleDelete = async (fieldId: string) => {
    if (!window.confirm("Delete this form field?")) return

    await deleteFormFieldAsync({ fieldId })
  }

  if (isPending) {
    return <p className="flex items-center justify-center h-full text-sm text-muted-foreground">
      <Spinner/>
    </p>
  }

  if (!formFields?.length) {
    return (
      <Card>
        <CardContent className="px-3">
          <p className="text-sm text-muted-foreground">No fields have been added to this form yet.</p>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error?.message ?? "Could not load form fields."}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {formFields.map((field) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div className="flex items-start gap-3 min-w-0 space-y-1">
              <div className="">
                <CardTitle className="truncate">{field.label}</CardTitle>
                <CardDescription>{field.description || "No description"}</CardDescription>
              </div>
              <div className="flex text-xs gap-3">
                <CardContent className="bg-neutral-700/60 rounded-full px-4 py-0.5 border border-white/10">{field.type}</CardContent>
                <CardContent className="bg-neutral-700/60 rounded-full px-4 py-0.5 border border-white/10">{field.isRequired ? "Required" : "Not Required"}</CardContent>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button type="button" variant="ghost" size="icon-sm" aria-label={`Edit ${field.label}`} title={`Edit ${field.label}`}>
                <Pencil />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${field.label}`}
                title={`Delete ${field.label}`}
                onClick={() => handleDelete(field.id)}
                disabled={isDeleting}
              >
                <Trash2 />
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export default ListFormField

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { TemplateDialog, type TemplateFormValues } from "~/modules/templates/components/template-dialog"
import { TemplateFieldsShow } from "~/modules/templates/components/template-fields-show"
import { useGetTemplateById, useInsertTemplateDataToForm } from "~/hooks/api/template"

const createDefaultValues = (): TemplateFormValues => ({
  title: "",
  description: "",
  isPrivate: false,
  password: "",
  expireAt: "",
  responseLimit: "",
  status: "publish",
  fields: [],
})

export default function TemplateDetailsPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const templateId = params.id
  const { getTemplateByIdData, isPending, isError, error } = useGetTemplateById(templateId)
  const { insertTemplateDataToFormAsync, isPending: isSubmitting } = useInsertTemplateDataToForm()
  const form = useForm<TemplateFormValues>({
    defaultValues: createDefaultValues(),
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!getTemplateByIdData) return

    form.reset({
      title: getTemplateByIdData.title,
      description: getTemplateByIdData.description ?? "",
      isPrivate: false,
      password: "",
      expireAt: "",
      responseLimit: "",
      status: "publish",
      fields:
        getTemplateByIdData.fields?.map((field) => ({
          id: field.id,
          label: field.label,
          description: field.description ?? "",
          type: field.type,
          isRequired: field.isRequired,
        })) ?? [],
    })
  }, [form, getTemplateByIdData])

  const updateField = (key: keyof TemplateFormValues, value: string | boolean) => {
    form.setValue(key, value as never, { shouldDirty: true, shouldTouch: true })
  }

  const updateTemplateField = (
    index: number,
    key: "label" | "description" | "type" | "isRequired",
    value: string | boolean,
  ) => {
    const fields = [...form.getValues("fields")]
    const current = fields[index]
    if (!current) return

    const nextField = { ...current }

    if (key === "label" || key === "description") {
      nextField[key] = value as string
    }

    if (key === "type") {
      nextField.type = value as TemplateFormValues["fields"][number]["type"]
    }

    if (key === "isRequired") {
      nextField.isRequired = value as boolean
    }

    fields[index] = nextField
    form.setValue("fields", fields, { shouldDirty: true, shouldTouch: true })
  }

  const onSubmit = async (values: TemplateFormValues) => {
    if (!getTemplateByIdData) return

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      templateId,
      isPrivate: values.isPrivate,
      password: values.isPrivate ? values.password.trim() || null : null,
      expireAt: values.expireAt ? new Date(values.expireAt) : null,
      responseLimit: values.responseLimit === "" ? null : Number(values.responseLimit),
      status: values.status,
      fields: values.fields.map((field) => ({
        label: field.label.trim(),
        description: field.description.trim() || null,
        type: field.type,
        isRequired: field.isRequired,
      })),
    }

    const result = await insertTemplateDataToFormAsync(payload)

    if (result?.id) {
      router.push(`/dashboard/forms/${result.id}`)
    }

    setIsOpen(false)
  }

  if (isPending) {
    return <div className="p-6 text-sm text-muted-foreground">Loading template...</div>
  }

  if (isError || !getTemplateByIdData) {
    return (
      <div className="p-6 text-sm text-destructive">
        {error?.message ?? "Template could not be loaded."}
      </div>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <section className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{getTemplateByIdData.title}</h1>
          <p className="text-muted-foreground">
            {getTemplateByIdData.description ?? "No description provided."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Use template
        </button>
      </section>

      <TemplateFieldsShow fields={getTemplateByIdData.fields} />

      <TemplateDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        form={form}
        isSubmitting={isSubmitting}
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </main>
  )
}

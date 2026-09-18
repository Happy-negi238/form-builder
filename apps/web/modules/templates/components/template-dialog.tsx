"use client"

import { useForm, type UseFormReturn } from "react-hook-form"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

export type TemplateFormValues = {
  title: string
  description: string
  isPrivate: boolean
  password: string
  expireAt: string
  responseLimit: string
  status: "publish" | "unpublish" | "closed"
  fields: Array<{
    id: string
    label: string
    description: string
    type: "TEXT" | "EMAIL" | "NUMBER" | "YES_NO" | "PASSWORD"
    isRequired: boolean
  }>
}

type TemplateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<TemplateFormValues>
  isSubmitting: boolean
  onSubmit: () => void
}

export function TemplateDialog({
  open,
  onOpenChange,
  form,
  isSubmitting,
  onSubmit,
}: TemplateDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto p-4 sm:p-5">
        <DialogHeader className="gap-1.5">
          <DialogTitle className="text-lg font-semibold">Use template</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Review and edit the form details before creating it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium">Form title</span>
              <input
                value={form.watch("title")}
                onChange={(event) => updateField("title", event.target.value)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0"
              />
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium">Description</span>
              <textarea
                value={form.watch("description")}
                onChange={(event) => updateField("description", event.target.value)}
                className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-0"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">Status</span>
              <select
                value={form.watch("status")}
                onChange={(event) =>
                  updateField("status", event.target.value as "publish" | "unpublish" | "closed")
                }
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0"
              >
                <option value="publish">Publish</option>
                <option value="unpublish">Unpublish</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">Expire at</span>
              <input
                type="datetime-local"
                value={form.watch("expireAt")}
                onChange={(event) => updateField("expireAt", event.target.value)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0"
              />
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium">Response limit</span>
              <input
                type="number"
                min={1}
                value={form.watch("responseLimit")}
                onChange={(event) => updateField("responseLimit", event.target.value)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0"
              />
            </label>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.watch("isPrivate")}
              onChange={(event) => updateField("isPrivate", event.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">Private form</span>
          </label>

          {form.watch("isPrivate") && (
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-sm font-medium">Password</span>
              <input
                type="password"
                value={form.watch("password")}
                onChange={(event) => updateField("password", event.target.value)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0"
              />
            </label>
          )}

          <div className="space-y-3 border-t pt-3">
            <h3 className="text-sm font-semibold">Template fields</h3>

            {form.watch("fields").map((field, index) => (
              <div key={field.id} className="rounded-lg border p-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-1.5 md:col-span-2">
                    <span className="text-sm font-medium">Label</span>
                    <input
                      value={field.label}
                      onChange={(event) => updateTemplateField(index, "label", event.target.value)}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0"
                    />
                  </label>

                  <label className="space-y-1.5 md:col-span-2">
                    <span className="text-sm font-medium">Description</span>
                    <input
                      value={field.description}
                      onChange={(event) =>
                        updateTemplateField(index, "description", event.target.value)
                      }
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">Type</span>
                    <select
                      value={field.type}
                      onChange={(event) =>
                        updateTemplateField(
                          index,
                          "type",
                          event.target.value as
                            | "TEXT"
                            | "EMAIL"
                            | "NUMBER"
                            | "YES_NO"
                            | "PASSWORD",
                        )
                      }
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-0"
                    >
                      <option value="TEXT">TEXT</option>
                      <option value="EMAIL">EMAIL</option>
                      <option value="NUMBER">NUMBER</option>
                      <option value="YES_NO">YES_NO</option>
                      <option value="PASSWORD">PASSWORD</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-2 pt-7">
                    <input
                      type="checkbox"
                      checked={field.isRequired}
                      onChange={(event) =>
                        updateTemplateField(index, "isRequired", event.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium">Required</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border px-3 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create form"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { MoveLeftIcon, Plus, Sparkles } from "lucide-react"
import Link from "next/link"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { Textarea } from "~/components/ui/textarea"
import {
  useBulkUpsertFormField,
  useCreatFormField,
  useDeleteFormField,
  useGetAllFormField,
  useUpdateFormField,
} from "~/hooks/api/form"
import { DeleteFieldDialog } from "~/modules/form/components/delete-field-dialog"
import {
  CanvasField,
  createField,
  supportedFields,
  ToolField,
  type FieldType,
  type FormField,
} from "~/modules/form/components/form-builder-components"

export function FormBuilderLayout({ formId }: { formId: string }) {
  const { formFields, isPending, error } = useGetAllFormField(formId)
  const { creatFormFieldAsync } = useCreatFormField()
  const { updateFormFieldAsync } = useUpdateFormField()
  const { deleteFormFieldAsync } = useDeleteFormField()
  const { bulkUpsertFormFieldAsync, isPending: isBulkSaving } = useBulkUpsertFormField()

  const [selectedType, setSelectedType] = useState<FieldType>("TEXT")
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState<string>("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const selectedField = useMemo(
    () => fields.find((field) => field.id === selectedFieldId) ?? fields[0] ?? null,
    [fields, selectedFieldId]
  )

  useEffect(() => {
    console.log("formFields: ", formFields);
    if (!formFields) {
      setFields([])
      setSelectedFieldId("")
      return
    }

    const nextFields = formFields.map((field) => ({
      id: field.id,
      dbId: field.id,
      type: field.type,
      label: field.label,
      description: field.description ?? "",
      placeholder: field.placeholder ?? "",
      required: field.isRequired,
    }))

    setFields(nextFields)
    if (!selectedFieldId && nextFields[0]) {
      setSelectedFieldId(nextFields[0].id)
    }
  }, [formFields])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const { setNodeRef: setCanvasDropRef, isOver: isCanvasOver } = useDroppable({
    id: "canvas-dropzone",
  })

  const handleAddField = (type: FieldType) => {
    const newField = createField(type)
    setFields((prev) => [...prev, newField])
    setSelectedFieldId(newField.id)
    setSelectedType(type)
  }

  const handleUpdateField = async (fieldId: string, updates: Partial<FormField>) => {
    const field = fields.find((item) => item.id === fieldId)
    if (!field) return

    const nextField = { ...field, ...updates }
    setFields((prev) => prev.map((item) => (item.id === fieldId ? nextField : item)))
    setSelectedFieldId(fieldId)

    if (!field.dbId) {
      return
    }

    await updateFormFieldAsync({
      fieldId: field.dbId,
      label: nextField.label,
      type: nextField.type,
      placeholder: nextField.placeholder || null,
      description: nextField.description || null,
      isRequired: nextField.required,
    })
  }

  const handleRemoveField = async (field: FormField) => {
    const persistedFieldId = field.dbId ?? null

    if (persistedFieldId && persistedFieldId !== "undefined" && persistedFieldId !== "null") {
      await deleteFormFieldAsync({ fieldId: persistedFieldId })
    }

    setFields((prev) => {
      const next = prev.filter((item) => item.id !== field.id)
      if (!next.length) {
        setSelectedFieldId("")
        return next
      }

      const nextSelected = next[0]
      if (nextSelected) {
        setSelectedFieldId(nextSelected.id)
      }
      return next
    })

    setIsDeleteDialogOpen(false)
  }

  const handleSaveFields = async () => {
    if (!fields.length) return

    const payload = {
      formId,
      fields: fields.map((field) => ({
        id: field.dbId ?? null,
        label: field.label,
        type: field.type,
        placeholder: field.placeholder || null,
        isRequired: field.required,
        desc: field.description || null,
        description: field.description || null,
      })),
    }

    console.log(payload);

    const response = await bulkUpsertFormFieldAsync(payload)

    setFields((prev) =>
      prev.map((field, index) => {
        const savedField = response?.data?.[index]
        if (!savedField) return field

        return {
          ...field,
          dbId: savedField.id,
        }
      })
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)
    const isToolItem = activeId.startsWith("tool-")

    if (isToolItem) {
      const type = activeId.replace("tool-", "") as FieldType
      const newField = createField(type)
      setFields((prev) => {
        const targetIndex = prev.findIndex((field) => field.id === overId)

        if (targetIndex === -1) {
          return [...prev, newField]
        }

        const next = [...prev]
        next.splice(targetIndex, 0, newField)
        return next
      })
      setSelectedFieldId(newField.id)
      setSelectedType(type)
      return
    }

    if (activeId === overId) return

    setFields((prev) => {
      const oldIndex = prev.findIndex((field) => field.id === activeId)
      const newIndex = prev.findIndex((field) => field.id === overId)

      if (oldIndex === -1 || newIndex === -1) return prev
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <main className="flex h-[calc(100vh-0rem)] flex-1 flex-col gap-6 p-4 bg-background text-foreground">
      <div className="flex items-center justify-between gap-4 px-1">
        <Button asChild variant="secondary" size="sm" className="border border-border bg-background text-muted-foreground transition hover:text-foreground">
          <Link href="/dashboard/forms">
            <MoveLeftIcon className="h-4 w-4" />
            Back to forms
          </Link>
        </Button>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <aside className="w-65 border-r border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            Form fields
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <div className="space-y-3">
              {supportedFields.map((field) => (
                <ToolField
                  key={field.type}
                  type={field.type}
                  label={field.label}
                  isSelected={selectedType === field.type}
                  onSelect={setSelectedType}
                  onAdd={handleAddField}
                />
              ))}
            </div>
          </DndContext>
        </aside>

        <section className="flex flex-1 flex-col bg-background p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Builder form</h1>
            {/* <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]">
              {formId}
            </Badge> */}
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <div
              ref={setCanvasDropRef}
              className={[
                "flex h-full flex-col gap-4 rounded-2xl border border-dashed bg-muted/20 p-6 transition-colors",
                isCanvasOver ? "border-primary/60 bg-accent/20" : "border-border",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Form canvas</div>
                <Badge variant="outline">{fields.length} fields</Badge>
              </div>

              <div className="flex flex-1 flex-col gap-4 overflow-auto">
                {isPending ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                    Loading form fields...
                  </div>
                ) : fields.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                    No fields yet. Drag a field here or click Add on the left.
                  </div>
                ) : (
                  fields.map((field) => (
                    <CanvasField
                      key={field.id}
                      field={field}
                      isSelected={selectedField?.id === field.id}
                      onSelect={setSelectedFieldId}
                    />
                  ))
                )}
              </div>
            </div>
          </DndContext>
        </section>

        <aside className="w-[320px] border-l border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Field settings</h2>
            <Button
              variant="secondary"
              size="sm"
              disabled={isBulkSaving}
              onClick={handleSaveFields}
            >
              {isBulkSaving ? "Saving..." : "Save"}
            </Button>
          </div>

          <Separator className="mb-4" />

          {selectedField ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Selected type</div>
                <div className="mt-2 text-xl font-medium uppercase text-foreground">{selectedField.type}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-label" className="text-sm text-muted-foreground">
                  Label
                </Label>
                <Input
                  id="field-label"
                  value={selectedField.label}
                  onChange={(event) => handleUpdateField(selectedField.id, { label: event.target.value })}
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-description" className="text-sm text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  id="field-description"
                  value={selectedField.description}
                  onChange={(event) => handleUpdateField(selectedField.id, { description: event.target.value })}
                  className="min-h-25 border-input bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-placeholder" className="text-sm text-muted-foreground">
                  Placeholder
                </Label>
                <Input
                  id="field-placeholder"
                  value={selectedField.placeholder}
                  onChange={(event) => handleUpdateField(selectedField.id, { placeholder: event.target.value })}
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3">
                <div>
                  <div className="text-sm font-medium text-foreground">Required</div>
                  <div className="text-xs text-muted-foreground">Make this field mandatory</div>
                </div>
                <Checkbox
                  checked={selectedField.required}
                  onCheckedChange={(checked) => handleUpdateField(selectedField.id, { required: checked === true })}
                />
              </div>

              <DeleteFieldDialog
                fieldId={selectedField.dbId ?? null}
                fieldLabel={selectedField.label || "Unnamed field"}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={() => handleRemoveField(selectedField)}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              Select a field to edit its properties.
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

import {
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus } from "lucide-react"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "PASSWORD" | "YES_NO"

type FormField = {
  id: string
  dbId?: string | null
  type: FieldType
  label: string
  description: string
  placeholder: string
  required: boolean
}

const supportedFields: Array<{ type: FieldType; label: string }> = [
  { type: "TEXT", label: "Text input" },
  { type: "NUMBER", label: "Number" },
  { type: "EMAIL", label: "Email" },
  { type: "PASSWORD", label: "Password" },
  { type: "YES_NO", label: "Yes / No" },
]

const createField = (type: FieldType): FormField => ({
  id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  dbId: null,
  type,
  label: type === "TEXT" ? "Label" : `${type.charAt(0)}${type.slice(1).toLowerCase()} field`,
  description: "Input box description",
  placeholder: type === "EMAIL" ? "you@example.com" : "",
  required: false,
})

function ToolField({
  type,
  label,
  isSelected,
  onSelect,
  onAdd,
}: {
  type: FieldType
  label: string
  isSelected: boolean
  onSelect: (type: FieldType) => void
  onAdd: (type: FieldType) => void
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `tool-${type}`,
  })

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={[
        "overflow-hidden transition-all",
        isSelected ? "border-primary/60 bg-accent/30" : "border-border bg-card",
      ].join(" ")}
    >
      <CardHeader className="gap-2 px-3 flex">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => onSelect(type)}
        >
          <CardTitle className="text-sm font-medium text-foreground">{label}</CardTitle>
        </button>
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            size="xs"
            variant="outline"
            className="h-7"
            onClick={(event) => {
              event.stopPropagation()
              onAdd(type)
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}

function CanvasField({
  field,
  isSelected,
  onSelect,
}: {
  field: FormField
  isSelected: boolean
  onSelect: (fieldId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: field.id,
    data: { type: "field" },
  })
  const { isOver, setNodeRef: setDropRef } = useDroppable({ id: field.id })

  const combinedRef = (node: HTMLElement | null) => {
    setNodeRef(node)
    setDropRef(node)
  }

  const inputType =
    field.type === "EMAIL"
      ? "email"
      : field.type === "NUMBER"
        ? "number"
        : field.type === "PASSWORD"
          ? "password"
          : "text"

  return (
    <Card
      ref={combinedRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={[
        "w-full max-w-2xl shadow-sm transition-all",
        isSelected ? "border-primary/60 bg-accent/20" : "border-border bg-card",
        isDragging ? "opacity-60" : "opacity-100",
        isOver ? "ring-2 ring-ring/40" : "",
      ].join(" ")}
      onClick={() => onSelect(field.id)}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-1 px-4">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <GripVertical className="h-4 w-4" {...attributes} {...listeners} />
          {field.type}
        </div>
        {isSelected ? <Badge variant="default">Selected</Badge> : null}
      </CardHeader>

      <CardContent className="space-y-3 px-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">{field.label || "Label"}</label>
          {field.description ? <p className="text-sm text-muted-foreground">{field.description}</p> : null}
        </div>

        <div className="space-y-2">
          <input
            type={inputType}
            placeholder={field.placeholder || "Enter value"}
            disabled
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
        </div>

        {field.required ? (
          <Badge variant="destructive" className="rounded-md px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
            Required
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { CanvasField, createField, supportedFields, ToolField }
export type { FieldType, FormField }

"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowUpRight, Eye, GripVertical, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { useDeleteForm, useListForm } from "~/hooks/api/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

type FormTableRow = {
  id: string
  title: string
  description: string | null
  expireAt: string | Date | null
  status: string | null
  isPrivate: boolean
  responseLimit: number | null
  createdAt: string | Date | null
}

function FormActionsCell({ form }: { form: FormTableRow }) {
  const { deleteFormAsync, isPending: isDeletePending } = useDeleteForm()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    await deleteFormAsync({ id: form.id })
    setIsDeleteDialogOpen(false)
    toast.success("Form deleted")
  }

  return (
    <div
      className="flex items-center justify-start gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <Button asChild variant="ghost" size="icon" title="Open submissions" className="size-7">
        <Link href={`/dashboard/forms/${form.id}/submissions`} aria-label={`Open ${form.title}`}>
          <Eye className="size-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Delete form"
        aria-label={`Delete ${form.title}`}
        onClick={() => setIsDeleteDialogOpen(true)}
        disabled={isDeletePending}
        className="size-7"
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Open form"
        aria-label={`Open ${form.title}`}
        onClick={() => window.location.assign(`/dashboard/forms/${form.id}`)}
        className="size-7"
      >
        <ArrowUpRight className="size-4" />
      </Button>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this form?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{form.title}&quot; and its submissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeletePending}>
              {isDeletePending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function SortableRow({ row }: { row: FormTableRow }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging}
      className="relative z-0 cursor-pointer data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={() => window.location.assign(`/dashboard/forms/${row.id}`)}
    >
      <TableCell className="w-10">
        <Button
          {...attributes}
          {...listeners}
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:bg-transparent"
        >
          <GripVertical className="size-3 text-muted-foreground" />
          <span className="sr-only">Drag to reorder</span>
        </Button>
      </TableCell>

      <TableCell className="min-w-[220px]">
        <div className="font-medium">{row.title}</div>
        <div className="text-xs text-muted-foreground">{row.description || "No description"}</div>
      </TableCell>

      <TableCell className="font-mono text-xs text-muted-foreground">
        {row.expireAt ? new Date(row.expireAt).toLocaleString() : "-"}
      </TableCell>

      <TableCell>
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.status || "-"}
        </Badge>
      </TableCell>

      <TableCell className="text-muted-foreground">{row.isPrivate ? "Yes" : "No"}</TableCell>

      <TableCell className="text-muted-foreground">
        {row.responseLimit ?? "Unlimited"}
      </TableCell>

      <TableCell className="font-mono text-xs text-muted-foreground">
        {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
      </TableCell>

      <TableCell>
        <FormActionsCell form={row} />
      </TableCell>
    </TableRow>
  )
}

export function DataTable({ data: initialData }: { data: FormTableRow[] }) {

  const [data, setData] = useState<FormTableRow[]>(() => initialData)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    // useSensor(KeyboardSensor, {})
  )

  const dataIds = useMemo<UniqueIdentifier[]>(() => data.map(({ id }) => id), [data])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setData((current) => {
      const oldIndex = dataIds.indexOf(active.id as string)
      const newIndex = dataIds.indexOf(over.id as string)
      if (oldIndex === -1 || newIndex === -1) return current

      return arrayMove(current, oldIndex, newIndex)
    })
  }

  return (
    <div className="overflow-hidden rounded border @container/card">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Table>
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Form name</TableHead>
              <TableHead>Expire At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Private</TableHead>
              <TableHead>Response Limit</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                {data.map((row) => (
                  <SortableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No forms yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}

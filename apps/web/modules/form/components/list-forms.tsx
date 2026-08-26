"use client"

import React from 'react'
import Link from "next/link"
import { Hammer, Trash2 } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  useDeleteForm,
  useListForm,
} from "~/hooks/api/form"

const ListForms = () => {
  const { forms, isPending: isListPending, isError: isListError } = useListForm()
  const { deleteFormAsync, isPending: isDeletePending } = useDeleteForm()

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this form?")) return

    await deleteFormAsync({ id })
  }

  return (
    <section className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Form name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isListPending && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                Loading forms...
              </TableCell>
            </TableRow>
          )}
          {isListError && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-destructive">
                Could not load forms.
              </TableCell>
            </TableRow>
          )}
          {!isListPending && !isListError && forms?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No forms yet.
              </TableCell>
            </TableRow>
          )}
          {forms?.map((form) => (
            <TableRow key={form.id}>
              <TableCell className="font-medium">{form.title}</TableCell>
              <TableCell className="max-w-md truncate text-muted-foreground">
                {form.description || "No description"}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {form.createdAt ? new Date(form.createdAt).toLocaleString() : "-"}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" title="Open form builder">
                    <Link href={`/dashboard/forms/${form.id}`} aria-label={`Build ${form.title}`}>
                      <Hammer />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete form"
                    aria-label={`Delete ${form.title}`}
                    onClick={() => handleDelete(form.id)}
                    disabled={isDeletePending}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export default ListForms

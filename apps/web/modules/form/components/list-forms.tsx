"use client"

import React from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EyeIcon, Hammer, Trash2 } from "lucide-react"

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
  const router = useRouter()
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
            <TableHead className='pl-5'>Form name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-24 text-left">Actions</TableHead>
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
            <TableRow
              key={form.id}
              className="cursor-pointer"
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/dashboard/forms/${form.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  router.push(`/dashboard/forms/${form.id}`)
                }
              }}
            >
              <TableCell className="font-medium pl-5">{form.title}</TableCell>
              <TableCell className="max-w-md truncate text-muted-foreground">
                {form.description || "No description"}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {form.createdAt ? new Date(form.createdAt).toLocaleString() : "-"}
              </TableCell>
              <TableCell onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-start gap-1">
                  <Button asChild variant="ghost" size="icon" title="Open form submissions" className='size-5'>
                    <Link href={`/dashboard/forms/${form.id}/submissions`} aria-label={`Build ${form.title}`}>
                      <EyeIcon />
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

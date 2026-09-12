"use client"

import { DataTable } from "~/components/data-table"
import { useListForm } from "~/hooks/api/form"

const ListForms = () => {
  const { forms, isPending, isError, error } = useListForm()

  if (isPending) {
    return (
      <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        Loading forms...
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-lg border border-destructive/30 bg-card p-4 text-sm text-destructive">
        {isError}
        Could not load forms.
      </section>
    )
  }

  return (
    <section className="rounded-lg border bg-card">
      <DataTable data={forms ?? []} />
    </section>
  )
}

export default ListForms

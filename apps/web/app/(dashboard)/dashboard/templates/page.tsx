"use client"

import Link from "next/link"

import { useGetAllTemplates } from "~/hooks/api/template"

export default function TemplatesPage() {
  const { getAllTemplatesData, isPending, error } = useGetAllTemplates()

  return (
    <main className="space-y-6 p-6">
      <section>
        <h1 className="text-2xl font-semibold">Templates</h1>
        <p className="text-muted-foreground">
          Select a template to view its fields.
        </p>
      </section>

      {isPending && (
        <p className="text-sm text-muted-foreground">Loading template...</p>
      )}

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      {!isPending && !error && getAllTemplatesData?.length === 0 && (
        <p className="text-sm text-muted-foreground">No templates found.</p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getAllTemplatesData?.map((template) => (
          <Link
            key={template.id}
            href={`/dashboard/templates/${template.id}`}
            className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <h2 className="font-semibold">{template.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {template.description ?? "No description provided."}
            </p>
          </Link>
        ))}
      </section>
    </main>
  )
}

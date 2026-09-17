"use client"

import { useParams } from "next/navigation"

import { useGetTemplateById } from "~/hooks/api/template"

export default function TemplateDetailsPage() {
  const params = useParams<{ id: string }>()
  const templateId = params.id
  const { getTemplateByIdData, isPending, isError, error } = useGetTemplateById(templateId)

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
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{getTemplateByIdData.title}</h1>
        <p className="text-muted-foreground">
          {getTemplateByIdData.description ?? "No description provided."}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Fields</h2>
        {getTemplateByIdData.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No fields have been added yet.</p>
        ) : (
          <div className="grid gap-3">
            {getTemplateByIdData.fields.map((field) => (
              <article key={field.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{field.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {field.description ?? "No description provided."}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {field.type}
                  </span>
                </div>
                {field.isRequired && (
                  <p className="mt-2 text-xs text-muted-foreground">Required</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
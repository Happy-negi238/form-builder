type TemplateField = {
  id: string
  label: string
  description?: string | null
  type: "TEXT" | "EMAIL" | "NUMBER" | "YES_NO" | "PASSWORD"
  isRequired: boolean
}

type TemplateFieldsShowProps = {
  fields: TemplateField[]
}

export function TemplateFieldsShow({ fields }: TemplateFieldsShowProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Fields</h2>

      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">No fields have been added yet.</p>
      ) : (
        <div className="grid gap-3">
          {fields.map((field) => (
            <article key={field.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{field.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {field.description ?? "No description provided."}
                  </p>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{field.type}</span>
              </div>

              {field.isRequired && (
                <p className="mt-2 text-xs text-muted-foreground">Required</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
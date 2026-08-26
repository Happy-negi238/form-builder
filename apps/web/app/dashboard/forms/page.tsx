import CreateForm from "~/modules/form/components/create-form"
import ListForms from "~/modules/form/components/list-forms"

const FormsPage = () => {
  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Forms</h1>
          <p className="text-muted-foreground text-sm">
            Create and manage your forms.
          </p>
        </div>
        <CreateForm />
      </div>

      <ListForms />
    </main>
  )
}

export default FormsPage

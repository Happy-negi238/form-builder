import { MoveLeftIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "~/components/ui/button"
import CreateFormField from "~/modules/form/components/create-form-field"
import ListFormField from "~/modules/form/components/list-form-field"

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <Button asChild variant="secondary" size="sm" className="bg-transparent text-muted-foreground hover:text-white transition">
          <Link href="/dashboard/forms"><MoveLeftIcon/> Back to forms</Link>
        </Button>
      </div>
      <div className="">
        <div className="mt-2 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Builder form</h1>
          <CreateFormField formId={id} />
        </div>
      </div>
      <ListFormField formId={id} />
    </main>
  )
}

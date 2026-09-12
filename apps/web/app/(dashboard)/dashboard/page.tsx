"use client"

import { ChartAreaInteractive } from "~/components/chart-area-interactive"
import { DataTable } from "~/components/data-table"
import { SectionCards } from "~/components/section-cards"
import { useListForm } from "~/hooks/api/form"

export default function Page() {
  const { forms, isPending, isError, error } = useListForm()

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards forms={forms ?? []} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive forms={forms ?? []} isPending={isPending} isError={isError} error={error} />
        </div>
        <div className="px-4 lg:px-6">
          {/* <DataTable data={forms ?? []} /> */}
        </div>
      </div>
    </div>
  )
}

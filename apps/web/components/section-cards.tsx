import { IconFileText, IconLock, IconShieldCheck, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "~/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

type FormStats = {
  status?: string | null
}[]

export function SectionCards({ forms = [] }: { forms?: FormStats }) {
  const totalForms = forms.length
  const publishCount = forms.filter((form) => form.status === "publish").length
  const unpublishCount = forms.filter((form) => form.status === "unpublish").length
  const closedCount = forms.filter((form) => form.status === "closed").length

  const cards = [
    {
      label: "Total Forms",
      value: totalForms,
      badge: "All forms",
      icon: IconFileText,
      footer: "Total forms created",
    },
    {
      label: "Publish",
      value: publishCount,
      badge: "Live",
      icon: IconTrendingUp,
      footer: "Currently published",
    },
    {
      label: "Unpublish",
      value: unpublishCount,
      badge: "Draft",
      icon: IconShieldCheck,
      footer: "Hidden but available",
    },
    {
      label: "Closed",
      value: closedCount,
      badge: "Stopped",
      icon: IconLock,
      footer: "No longer accepting responses",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map(({ label, value, badge, icon: Icon, footer }) => (
        <Card key={label} className="@container/card rounded-md">
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Icon className="size-3.5" />
                {badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">{footer}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

"use client"

import * as React from "react"
import { Cell, Pie, PieChart } from "recharts"

import { useIsMobile } from "~/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/components/ui/toggle-group"

type FormChartItem = {
  createdAt?: string | Date | null
  status?: string | null
}

export const description = "Form analytics chart"

const chartConfig = {
  total: {
    label: "Total forms",
    color: "var(--primary)",
  },
  publish: {
    label: "Publish",
    color: "#22c55e",
  },
  unpublish: {
    label: "Unpublish",
    color: "#f59e0b",
  },
  closed: {
    label: "Closed",
    color: "#ef4444",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({
  forms = [],
  isPending = false,
  isError = false,
  error,
}: {
  forms?: FormChartItem[]
  isPending?: boolean
  isError?: boolean
  error?: Error | { message?: string } | null
}) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const referenceDate = new Date()
  const startDate = new Date(referenceDate)
  let daysToSubtract = 90

  if (timeRange === "30d") {
    daysToSubtract = 30
  } else if (timeRange === "7d") {
    daysToSubtract = 7
  }

  startDate.setDate(referenceDate.getDate() - daysToSubtract)

  const pieData = React.useMemo(() => {
    const counts = {
      publish: 0,
      unpublish: 0,
      closed: 0,
    }

    for (const form of forms) {
      const createdAt = form.createdAt ? new Date(form.createdAt) : null

      if (!createdAt || Number.isNaN(createdAt.getTime()) || createdAt < startDate) {
        continue
      }

      if (form.status === "publish") {
        counts.publish += 1
      } else if (form.status === "unpublish") {
        counts.unpublish += 1
      } else if (form.status === "closed") {
        counts.closed += 1
      }
    }

    return [
      {
        name: "Total",
        value: counts.publish + counts.unpublish + counts.closed,
        color: chartConfig.total.color,
      },
      { name: "Publish", value: counts.publish, color: chartConfig.publish.color },
      { name: "Unpublish", value: counts.unpublish, color: chartConfig.unpublish.color },
      { name: "Closed", value: counts.closed, color: chartConfig.closed.color },
    ].filter((item) => item.value > 0)
  }, [forms, startDate])

  if (isPending) {
    return (
      <Card className="@container/card rounded-md">
        <CardContent className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
          Loading form analytics...
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="@container/card rounded-md">
        <CardContent className="flex h-[250px] items-center justify-center text-sm text-destructive">
          {error?.message ?? "Could not load form analytics."}
        </CardContent>
      </Card>
    )
  }

  if (!pieData.length) {
    return (
      <Card className="@container/card rounded-md">
        <CardContent className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
          No form activity yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card rounded-md">
      <CardHeader>
        <CardTitle>Form Status Distribution</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total form activity for the last {timeRange === "90d" ? "3 months" : timeRange === "30d" ? "30 days" : "7 days"}
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "90d" ? "Last 3 months" : timeRange === "30d" ? "Last 30 days" : "Last 7 days"}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[260px] w-full max-w-[360px]">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={4}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="name" indicator="dot" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

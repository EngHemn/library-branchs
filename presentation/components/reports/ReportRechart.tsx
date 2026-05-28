"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ReportChart } from "@/domain/entities/reports/Reports"

type ReportRechartProps = {
  chart: ReportChart
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
]

type ChartRow = {
  name: string
  value: number
}

function formatTooltipValue(
  value: number,
  prefix?: string,
  suffix?: string
): string {
  const formatted =
    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString()
  return `${prefix ?? ""}${formatted}${suffix ?? ""}`
}

function ChartTooltip({
  active,
  payload,
  prefix,
  suffix,
}: {
  active?: boolean
  payload?: { value: number; payload: ChartRow }[]
  prefix?: string
  suffix?: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]
  if (!item) {
    return null
  }

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
      <p className="font-medium">{item.payload.name}</p>
      <p className="text-muted-foreground">
        {formatTooltipValue(item.value, prefix, suffix)}
      </p>
    </div>
  )
}

export function ReportRechart({ chart }: ReportRechartProps) {
  const data: ChartRow[] = chart.points.map((point) => ({
    name: point.label,
    value: point.value,
  }))

  const tooltip = (
    <ChartTooltip prefix={chart.valuePrefix} suffix={chart.valueSuffix} />
  )

  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{chart.title}</CardTitle>
        <CardDescription>{chart.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chart.type === "pie" ? (
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={96}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={tooltip} />
              </PieChart>
            ) : chart.type === "line" ? (
              <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={tooltip} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            ) : chart.type === "area" ? (
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={tooltip} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={tooltip} />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

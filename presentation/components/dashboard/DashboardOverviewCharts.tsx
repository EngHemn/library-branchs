"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import type {
  DashboardChartBar,
  DashboardChartTrend,
} from "@/domain/entities/dashboard/DashboardSummary"
import { localizeChartBars } from "@/presentation/i18n/dashboardChartLabels"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardOverviewChartsProps = {
  bookingsByStatus: DashboardChartBar[]
  salesTrend: DashboardChartTrend[]
}

type TooltipPayloadItem = {
  value: number
  payload: { label?: string; date?: string }
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  if (!item) return null
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
      <p className="font-medium">{item.payload.label ?? item.payload.date ?? label}</p>
      <p className="text-muted-foreground">{item.value.toLocaleString()}</p>
    </div>
  )
}

export function DashboardOverviewCharts({
  bookingsByStatus,
  salesTrend,
}: DashboardOverviewChartsProps) {
  const { t } = useTranslation()
  const localizedBookingsByStatus = localizeChartBars(t, bookingsByStatus)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("dashboard.charts.bookingsByStatus")}</CardTitle>
          <CardDescription>{t("dashboard.charts.bookingsByStatusOverview")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={localizedBookingsByStatus}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                className="stroke-border"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={68}
              />
              <Tooltip cursor={{ fill: "#f9fafb" }} content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {localizedBookingsByStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("dashboard.charts.salesTrend")}</CardTitle>
          <CardDescription>{t("dashboard.charts.salesTrendDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={salesTrend}
              margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="overviewSalesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-2)"
                strokeWidth={2}
                fill="url(#overviewSalesGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "var(--chart-2)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

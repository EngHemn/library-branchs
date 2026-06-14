"use client"

import {
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
import type { DashboardChartBar } from "@/domain/entities/dashboard/DashboardSummary"
import { localizeChartBars } from "@/presentation/i18n/dashboardChartLabels"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardBookChartsProps = {
  booksByStatus: DashboardChartBar[]
  booksByCategory: DashboardChartBar[]
}

type TooltipPayloadItem = {
  value: number
  payload: { label: string }
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  if (!item) return null
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
      <p className="font-medium">{item.payload.label}</p>
      <p className="text-muted-foreground">{item.value.toLocaleString()}</p>
    </div>
  )
}

export function DashboardBookCharts({
  booksByStatus,
  booksByCategory,
}: DashboardBookChartsProps) {
  const { t } = useTranslation()
  const localizedBooksByStatus = localizeChartBars(t, booksByStatus)
  const localizedBooksByCategory = localizeChartBars(t, booksByCategory)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("dashboard.charts.booksByStatus")}</CardTitle>
          <CardDescription>
            {t("dashboard.charts.booksByStatusDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={localizedBooksByStatus}
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
                tickFormatter={(v: number) => v.toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={78}
              />
              <Tooltip cursor={{ fill: "#f9fafb" }} content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {localizedBooksByStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("dashboard.charts.booksByCategory")}</CardTitle>
          <CardDescription>
            {t("dashboard.charts.booksByCategoryDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={localizedBooksByCategory}
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
                tickFormatter={(v: number) => v.toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={78}
              />
              <Tooltip cursor={{ fill: "#f9fafb" }} content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {localizedBooksByCategory.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

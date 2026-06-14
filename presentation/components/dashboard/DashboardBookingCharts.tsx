"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import type { DashboardChartBar } from "@/domain/entities/dashboard/DashboardSummary"
import { localizeChartBars } from "@/presentation/i18n/dashboardChartLabels"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardBookingChartsProps = {
  bookingsByStatus: DashboardChartBar[]
  bookingsByType: DashboardChartBar[]
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

export function DashboardBookingCharts({
  bookingsByStatus,
  bookingsByType,
}: DashboardBookingChartsProps) {
  const { t } = useTranslation()
  const localizedBookingsByStatus = localizeChartBars(t, bookingsByStatus)
  const localizedBookingsByType = localizeChartBars(t, bookingsByType)
  const total = bookingsByType.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("dashboard.charts.bookingsByStatus")}</CardTitle>
          <CardDescription>
            {t("dashboard.charts.bookingsByStatusDetail")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={210}>
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
          <CardTitle className="text-base">{t("dashboard.charts.bookingsByType")}</CardTitle>
          <CardDescription>
            {t("dashboard.charts.bookingsByTypeDescription", {
              total: total.toLocaleString(),
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={localizedBookingsByType}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                dataKey="value"
                nameKey="label"
                paddingAngle={3}
              >
                {localizedBookingsByType.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4">
            {localizedBookingsByType.map((entry) => (
              <div key={entry.label} className="flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: entry.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {entry.label}{" "}
                  <span className="font-medium text-foreground">
                    {entry.value.toLocaleString()}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

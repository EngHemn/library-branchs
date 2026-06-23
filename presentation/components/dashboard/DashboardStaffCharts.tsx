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

type DashboardStaffChartsProps = {
  staffByRole: DashboardChartBar[]
  staffByBranch?: DashboardChartBar[]
  showBranchChart?: boolean
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

export function DashboardStaffCharts({
  staffByRole,
  staffByBranch = [],
  showBranchChart = false,
}: DashboardStaffChartsProps) {
  const { t } = useTranslation()
  const localizedStaffByRole = localizeChartBars(t, staffByRole)
  const localizedStaffByBranch = localizeChartBars(t, staffByBranch)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {t("dashboard.charts.staffByRole")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.charts.staffByRoleDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={localizedStaffByRole}
              margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "#f9fafb" }}
                content={<ChartTooltip />}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {localizedStaffByRole.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showBranchChart ? (
        <Card className="rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {t("dashboard.charts.staffByBranch")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.charts.staffByBranchDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={localizedStaffByBranch}
                margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  content={<ChartTooltip />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {localizedStaffByBranch.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

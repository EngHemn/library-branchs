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
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Staff by Role</CardTitle>
          <CardDescription>
            Headcount distribution across all staff role types.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={staffByRole}
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
              <Tooltip cursor={{ fill: "#f9fafb" }} content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {staffByRole.map((entry, index) => (
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
            <CardTitle className="text-base">Staff by Branch</CardTitle>
            <CardDescription>
              Headcount distribution across library branches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={staffByBranch}
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
                <Tooltip cursor={{ fill: "#f9fafb" }} content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {staffByBranch.map((entry, index) => (
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

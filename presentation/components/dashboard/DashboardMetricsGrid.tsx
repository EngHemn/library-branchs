"use client"

import {
  AlertTriangleIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
  BookmarkIcon,
  DollarSignIcon,
  MinusIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import type {
  DashboardMetric,
  DashboardMetricTrend,
} from "@/domain/entities/dashboard/DashboardSummary"

type DashboardMetricsGridProps = {
  metrics: DashboardMetric[]
}

const metricIconMap: Record<string, LucideIcon> = {
  "metric-books": BookOpenIcon,
  "metric-members": UsersIcon,
  "metric-borrowings": BookmarkIcon,
  "metric-overdue": AlertTriangleIcon,
  "metric-sales": DollarSignIcon,
  "metric-stock": AlertTriangleIcon,
}

function TrendIcon({ trend }: { trend: DashboardMetricTrend }) {
  if (trend === "up") return <ArrowUpRightIcon className="size-4 text-emerald-500" />
  if (trend === "down") return <ArrowDownRightIcon className="size-4 text-rose-500" />
  return <MinusIcon className="size-4 text-muted-foreground" />
}

function trendChangeClass(trend: DashboardMetricTrend): string {
  if (trend === "up") return "text-emerald-600"
  if (trend === "down") return "text-rose-600"
  return "text-muted-foreground"
}

export function DashboardMetricsGrid({ metrics }: DashboardMetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {metrics.map((metric) => {
        const Icon = metricIconMap[metric.id] ?? BookOpenIcon
        return (
          <Card key={metric.id} className="rounded-xl">
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wide">
                {metric.label}
              </CardDescription>
              <span className="rounded-md bg-muted p-1.5">
                <Icon className="size-4 text-muted-foreground" />
              </span>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
              <div className="flex items-center gap-1.5 text-xs">
                <TrendIcon trend={metric.trend} />
                <span className={`font-semibold ${trendChangeClass(metric.trend)}`}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground">{metric.helperText}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

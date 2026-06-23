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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import type {
  DashboardMetric,
  DashboardMetricTrend,
} from "@/domain/entities/dashboard/DashboardSummary"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { Separator } from "@/components/ui/separator"
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
  if (trend === "up")
    return <ArrowUpRightIcon className="size-4 text-emerald-500" />
  if (trend === "down")
    return <ArrowDownRightIcon className="size-4 text-rose-500" />
  return <MinusIcon className="size-4 text-muted-foreground" />
}

function trendChangeClass(trend: DashboardMetricTrend): string {
  if (trend === "up") return "text-emerald-600"
  if (trend === "down") return "text-rose-600"
  return "text-muted-foreground"
}

function trendBadgeClass(trend: DashboardMetricTrend): string {
  if (trend === "up")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
  if (trend === "down")
    return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
  return "bg-muted text-muted-foreground"
}

const METRIC_LABEL_KEYS: Record<
  string,
  { label: TranslationKey; helperText: TranslationKey }
> = {
  "metric-books": {
    label: "dashboard.metrics.metric-books.label",
    helperText: "dashboard.metrics.metric-books.helperText",
  },
  "metric-members": {
    label: "dashboard.metrics.metric-members.label",
    helperText: "dashboard.metrics.metric-members.helperText",
  },
  "metric-borrowings": {
    label: "dashboard.metrics.metric-borrowings.label",
    helperText: "dashboard.metrics.metric-borrowings.helperText",
  },
  "metric-overdue": {
    label: "dashboard.metrics.metric-overdue.label",
    helperText: "dashboard.metrics.metric-overdue.helperText",
  },
  "metric-sales": {
    label: "dashboard.metrics.metric-sales.label",
    helperText: "dashboard.metrics.metric-sales.helperText",
  },
  "metric-stock": {
    label: "dashboard.metrics.metric-stock.label",
    helperText: "dashboard.metrics.metric-stock.helperText",
  },
}

export function DashboardMetricsGrid({ metrics }: DashboardMetricsGridProps) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {metrics.map((metric) => {
        const Icon = metricIconMap[metric.id] ?? BookOpenIcon
        const labelKeys = METRIC_LABEL_KEYS[metric.id]
        return (
          <Card key={metric.id} className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <span className="rounded-md bg-muted p-1.5">
                <Icon className="size-4 text-muted-foreground" />
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${trendBadgeClass(metric.trend)}`}
              >
                {metric.change}
              </span>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <CardDescription className="mb-1 text-xs font-medium tracking-wide uppercase">
                  {labelKeys ? t(labelKeys.label) : metric.label}
                </CardDescription>
                <div className="text-2xl font-bold tracking-tight">
                  {metric.value}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

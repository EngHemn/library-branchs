"use client"

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  MinusIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import type { ReportKpi, ReportMetricTrend } from "@/domain/entities/reports/Reports"

type ReportsSummaryCardsProps = {
  kpis: ReportKpi[]
}

function TrendIcon({ trend }: { trend: ReportMetricTrend }) {
  if (trend === "up") {
    return <ArrowUpRightIcon className="size-4 text-emerald-600" />
  }

  if (trend === "down") {
    return <ArrowDownRightIcon className="size-4 text-rose-600" />
  }

  return <MinusIcon className="size-4 text-muted-foreground" />
}

export function ReportsSummaryCards({ kpis }: ReportsSummaryCardsProps) {
  if (kpis.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.id} className="rounded-lg">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>{kpi.label}</CardDescription>
            <TrendIcon trend={kpi.trend} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpi.value}</div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{kpi.change}</span>
              <span>{kpi.helperText}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

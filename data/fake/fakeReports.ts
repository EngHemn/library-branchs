import { differenceInCalendarDays, format, parseISO } from "date-fns"

import { fakeBranches } from "@/data/fake/fakeBranches"
import { reportChartTemplates } from "@/data/fake/fakeReportChartDefinitions"
import type {
  ReportCategory,
  ReportChart,
  ReportChartPoint,
  ReportKpi,
  ReportMetricTrend,
  ReportsBundle,
  ReportsQuery,
  ReportTable,
} from "@/domain/entities/reports/Reports"
import { REPORT_CHARTS_PER_TAB } from "@/domain/entities/reports/Reports"

const periodLabels: Record<ReportsQuery["period"], string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  ytd: "Year to date",
}

const timeLabelsShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const categoryLabels = [
  "Fiction",
  "Non-fiction",
  "Children",
  "Academic",
  "Self Help",
  "Poetry",
]
const statusLabels = ["Active", "Pending", "Completed", "Overdue", "Cancelled"]

const kpiTemplates: Record<
  ReportCategory,
  { label: string; baseValue: number; suffix?: string; prefix?: string }[]
> = {
  overview: [
    { label: "Total Revenue", baseValue: 48200, prefix: "$" },
    { label: "Transactions", baseValue: 1284 },
    { label: "Active Branches", baseValue: 6 },
    { label: "Catalog Titles", baseValue: 24800 },
  ],
  sales: [
    { label: "Revenue", baseValue: 48200, prefix: "$" },
    { label: "Units Sold", baseValue: 3240 },
    { label: "Avg Order", baseValue: 38, prefix: "$" },
    { label: "Conversion", baseValue: 24, suffix: "%" },
  ],
  inventory: [
    { label: "Stock Health", baseValue: 88, suffix: "%" },
    { label: "Low Stock SKUs", baseValue: 42 },
    { label: "Inbound Units", baseValue: 1240 },
    { label: "Critical Items", baseValue: 8 },
  ],
  events: [
    { label: "Events Held", baseValue: 24 },
    { label: "Attendance", baseValue: 840 },
    { label: "Capacity Used", baseValue: 82, suffix: "%" },
    { label: "No-Show Rate", baseValue: 9, suffix: "%" },
  ],
  members: [
    { label: "New Members", baseValue: 186 },
    { label: "Renewals", baseValue: 412 },
    { label: "Retention", baseValue: 94, suffix: "%" },
    { label: "Active Borrowers", baseValue: 1280 },
  ],
  authors: [
    { label: "Authors in Catalog", baseValue: 420 },
    { label: "New Authors", baseValue: 18 },
    { label: "Top Seller Titles", baseValue: 64 },
    { label: "Royalties Due", baseValue: 8400, prefix: "$" },
  ],
  translators: [
    { label: "Active Translators", baseValue: 32 },
    { label: "Projects Done", baseValue: 48 },
    { label: "Avg Turnaround", baseValue: 14, suffix: " days" },
    { label: "Pass Rate", baseValue: 91, suffix: "%" },
  ],
  bookings: [
    { label: "Total Bookings", baseValue: 312 },
    { label: "Active Holds", baseValue: 86 },
    { label: "Overdue", baseValue: 12 },
    { label: "Same-Day", baseValue: 44 },
  ],
  books: [
    { label: "Catalog Size", baseValue: 24800 },
    { label: "New Titles", baseValue: 124 },
    { label: "Out of Stock", baseValue: 218 },
    { label: "Circulation", baseValue: 1840 },
  ],
}

function hashSeed(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0
  }
  return Math.abs(hash)
}

function getBranchMultiplier(branchId: string): number {
  if (branchId === "all") {
    return 1
  }

  const branch = fakeBranches.find((item) => item.id === branchId)
  if (!branch) {
    return 0.85
  }

  return 0.55 + (branch.bookCount / 30000) * 0.5
}

function getDateMultiplier(query: ReportsQuery): number {
  const from = parseISO(query.dateFrom)
  const to = parseISO(query.dateTo)
  const days = Math.max(1, differenceInCalendarDays(to, from) + 1)
  return Math.min(3.5, 0.35 + days / 30)
}

function getTimeLabels(query: ReportsQuery): string[] {
  const from = parseISO(query.dateFrom)
  const to = parseISO(query.dateTo)
  const days = Math.max(1, differenceInCalendarDays(to, from) + 1)

  if (days <= 7) {
    return timeLabelsShort.slice(0, days)
  }

  if (days <= 14) {
    return Array.from({ length: 7 }, (_, index) => `D${index + 1}`)
  }

  return Array.from({ length: 7 }, (_, index) => {
    const offset = Math.floor((days / 7) * index)
    const date = new Date(from)
    date.setDate(from.getDate() + offset)
    return format(date, "MMM d")
  })
}

function buildPoints(
  labels: string[],
  base: number,
  seed: number
): ReportChartPoint[] {
  return labels.map((label, index) => {
    const variance = 0.65 + ((seed + index * 23) % 70) / 100
    return {
      label,
      value: Math.max(1, Math.round(base * variance)),
    }
  })
}

function formatKpiValue(
  value: number,
  prefix?: string,
  suffix?: string
): string {
  if (prefix === "$" && value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }

  return `${prefix ?? ""}${value.toLocaleString()}${suffix ?? ""}`
}

function buildKpis(query: ReportsQuery): ReportKpi[] {
  const seed = hashSeed(`${query.branchId}-${query.dateFrom}-${query.dateTo}`)
  const multiplier = getBranchMultiplier(query.branchId) * getDateMultiplier(query)
  const trends: ReportMetricTrend[] = ["up", "down", "neutral", "up"]

  return (Object.keys(kpiTemplates) as ReportCategory[]).flatMap((category) =>
    kpiTemplates[category].map((template, index) => {
      const value = Math.round(template.baseValue * multiplier * (0.9 + (seed % 20) / 100))
      const changeValue = ((seed + index * 7) % 18) - 4
      const change =
        changeValue === 0
          ? "No change"
          : `${changeValue > 0 ? "+" : ""}${changeValue}%`

      return {
        id: `kpi-${category}-${index}`,
        label: template.label,
        value: formatKpiValue(value, template.prefix, template.suffix),
        change,
        helperText: "vs previous period",
        trend: trends[index % trends.length] ?? "neutral",
        category,
      }
    })
  )
}

function buildCharts(query: ReportsQuery): ReportChart[] {
  const seed = hashSeed(`${query.branchId}-${query.dateFrom}-${query.dateTo}-${query.period}`)
  const multiplier = getBranchMultiplier(query.branchId) * getDateMultiplier(query)
  const timeLabels = getTimeLabels(query)

  return (Object.keys(reportChartTemplates) as ReportCategory[]).flatMap(
    (category) => {
      const templates = reportChartTemplates[category].slice(0, REPORT_CHARTS_PER_TAB)

      return templates.map((template, index) => {
        const labels =
          template.labelSet === "time"
            ? timeLabels
            : template.labelSet === "category"
              ? categoryLabels
              : statusLabels

        const base = Math.round(1200 * multiplier * (1 + index * 0.12))

        return {
          id: `chart-${category}-${index}`,
          title: template.title,
          description: template.description,
          category,
          type: template.type,
          valuePrefix: template.valuePrefix,
          valueSuffix: template.valueSuffix,
          points: buildPoints(labels, base, seed + index * 41),
        }
      })
    }
  )
}

function buildTables(query: ReportsQuery): ReportTable[] {
  const branchLabel =
    query.branchId === "all"
      ? "All branches"
      : (fakeBranches.find((b) => b.id === query.branchId)?.branchName ?? "Branch")

  return [
    {
      id: "table-summary",
      title: "Report Summary",
      description: `Snapshot for ${branchLabel}`,
      category: "overview",
      columns: [
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value", align: "right" },
      ],
      rows: [
        { metric: "Branch filter", value: branchLabel },
        { metric: "Date range", value: `${query.dateFrom} → ${query.dateTo}` },
        { metric: "Period preset", value: periodLabels[query.period] },
      ],
    },
  ]
}

export function getReportBranchOptions(): { id: string; name: string }[] {
  const activeBranches = fakeBranches
    .filter((branch) => branch.status === "active")
    .slice(0, 12)

  return [
    { id: "all", name: "All branches" },
    ...activeBranches.map((branch) => ({
      id: branch.id,
      name: branch.branchName,
    })),
  ]
}

export function getFakeReports(query: ReportsQuery): ReportsBundle {
  const branches = getReportBranchOptions()
  const branchName =
    branches.find((branch) => branch.id === query.branchId)?.name ?? "All branches"

  return {
    period: query.period,
    periodLabel: periodLabels[query.period],
    branchId: query.branchId,
    branchName,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    generatedAt: new Date().toISOString(),
    branches,
    kpis: buildKpis(query),
    charts: buildCharts(query),
    tables: buildTables(query),
  }
}

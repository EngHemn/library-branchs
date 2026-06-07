export type ReportPeriod = "7d" | "30d" | "90d" | "ytd"

export type ReportCategory =
  | "overview"
  | "sales"
  | "inventory"
  | "groups"
  | "members"
  | "authors"
  | "translators"
  | "bookings"
  | "books"
  | "orders"

export type ReportChartType = "bar" | "line" | "area" | "pie"

export type ReportMetricTrend = "up" | "down" | "neutral"

export type ReportBranchOption = {
  id: string
  name: string
}

export type ReportsQuery = {
  period: ReportPeriod
  branchId: string
  dateFrom: string
  dateTo: string
}

export type ReportKpi = {
  id: string
  label: string
  value: string
  change: string
  helperText: string
  trend: ReportMetricTrend
  category: ReportCategory | "all"
}

export type ReportChartPoint = {
  label: string
  value: number
}

export type ReportChart = {
  id: string
  title: string
  description: string
  category: ReportCategory
  type: ReportChartType
  points: ReportChartPoint[]
  valuePrefix?: string
  valueSuffix?: string
}

export type ReportTableColumn = {
  key: string
  label: string
  align?: "left" | "right"
}

export type ReportTableRow = Record<string, string>

export type ReportTable = {
  id: string
  title: string
  description: string
  category: ReportCategory
  columns: ReportTableColumn[]
  rows: ReportTableRow[]
}

export type ReportsBundle = {
  period: ReportPeriod
  periodLabel: string
  branchId: string
  branchName: string
  dateFrom: string
  dateTo: string
  generatedAt: string
  branches: ReportBranchOption[]
  kpis: ReportKpi[]
  charts: ReportChart[]
  tables: ReportTable[]
}

export const REPORT_CHARTS_PER_TAB = 10

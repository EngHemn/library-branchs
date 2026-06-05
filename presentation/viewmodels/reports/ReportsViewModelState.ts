"use client"

import type {
  ReportBranchOption,
  ReportCategory,
  ReportChart,
  ReportKpi,
  ReportPeriod,
  ReportsBundle,
  ReportTable,
} from "@/domain/entities/reports/Reports"

export type AsyncStatus = "idle" | "loading" | "success" | "error"

export type ReportsViewModelState = {
  reports: ReportsBundle | null
  status: AsyncStatus
  error: string | null
  period: ReportPeriod
  branchId: string
  dateFrom: string
  dateTo: string
  branches: ReportBranchOption[]
  category: ReportCategory
  isLoading: boolean
  isReady: boolean
  kpis: ReportKpi[]
  charts: ReportChart[]
  tables: ReportTable[]
}

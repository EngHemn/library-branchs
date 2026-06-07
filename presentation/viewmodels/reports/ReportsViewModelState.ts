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

export type ReportBranchFilter = "all" | "current" | string

export type ReportBranchFilterOption = {
  value: ReportBranchFilter
  label: string
}

export type ReportsViewModelState = {
  reports: ReportsBundle | null
  status: AsyncStatus
  error: string | null
  period: ReportPeriod
  branchId: ReportBranchFilter
  dateFrom: string
  dateTo: string
  branches: ReportBranchOption[]
  branchFilterOptions: ReportBranchFilterOption[]
  showBranchFilter: boolean
  category: ReportCategory
  isLoading: boolean
  isReady: boolean
  kpis: ReportKpi[]
  charts: ReportChart[]
  tables: ReportTable[]
}

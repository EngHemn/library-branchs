"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format, subDays, startOfYear } from "date-fns"

import type {
  ReportBranchOption,
  ReportCategory,
  ReportChart,
  ReportKpi,
  ReportPeriod,
  ReportsBundle,
  ReportsQuery,
  ReportTable,
} from "@/domain/entities/reports/Reports"
import { REPORT_CHARTS_PER_TAB } from "@/domain/entities/reports/Reports"
import type { GetReportsUseCase } from "@/domain/usecases/reports/GetReportsUseCase"

type AsyncStatus = "idle" | "loading" | "success" | "error"

type ReportsViewModelState = {
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

export type ReportsViewModel = {
  state: ReportsViewModelState
  setPeriod: (period: ReportPeriod) => void
  setBranchId: (branchId: string) => void
  setDateFrom: (dateFrom: string) => void
  setDateTo: (dateTo: string) => void
  setCategory: (category: ReportCategory) => void
  reload: () => void
}

function getDateRangeForPeriod(period: ReportPeriod): { dateFrom: string; dateTo: string } {
  const to = new Date()
  let from = new Date()
  switch (period) {
    case "7d":
      from = subDays(to, 6)
      break
    case "30d":
      from = subDays(to, 29)
      break
    case "90d":
      from = subDays(to, 89)
      break
    case "ytd":
      from = startOfYear(to)
      break
  }
  return { dateFrom: format(from, "yyyy-MM-dd"), dateTo: format(to, "yyyy-MM-dd") }
}

function filterKpis(kpis: ReportKpi[], category: ReportCategory): ReportKpi[] {
  return kpis.filter((kpi) => kpi.category === category)
}

function filterCharts(charts: ReportChart[], category: ReportCategory): ReportChart[] {
  return charts.filter((chart) => chart.category === category).slice(0, REPORT_CHARTS_PER_TAB)
}

function filterTables(tables: ReportTable[], category: ReportCategory): ReportTable[] {
  if (category !== "overview") return []
  return tables.filter((table) => table.category === "overview")
}

export function useReportsViewModel(getReportsUseCase: GetReportsUseCase): ReportsViewModel {
  const initialRange = getDateRangeForPeriod("30d")

  const [period, setPeriodState] = useState<ReportPeriod>("30d")
  const [branchId, setBranchId] = useState("all")
  const [dateFrom, setDateFrom] = useState(initialRange.dateFrom)
  const [dateTo, setDateTo] = useState(initialRange.dateTo)
  const [category, setCategory] = useState<ReportCategory>("overview")

  const query: ReportsQuery = { period, branchId, dateFrom, dateTo }

  const { data: reports, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["reports", query],
    queryFn: async () => {
      const result = await getReportsUseCase.getReports(query)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const status: AsyncStatus = (() => {
    if (isPending || isFetching) return "loading"
    if (isError) return "error"
    if (reports !== undefined) return "success"
    return "idle"
  })()

  function setPeriod(nextPeriod: ReportPeriod): void {
    const range = getDateRangeForPeriod(nextPeriod)
    setPeriodState(nextPeriod)
    setDateFrom(range.dateFrom)
    setDateTo(range.dateTo)
  }

  function reload(): void {
    void refetch()
  }

  const kpis = reports ? filterKpis(reports.kpis, category) : []
  const charts = reports ? filterCharts(reports.charts, category) : []
  const tables = reports ? filterTables(reports.tables, category) : []

  const state: ReportsViewModelState = {
    reports: reports ?? null,
    status,
    error: isError && error instanceof Error ? error.message : null,
    period,
    branchId,
    dateFrom,
    dateTo,
    branches: reports?.branches ?? [],
    category,
    isLoading: isPending || isFetching,
    isReady: status === "success" && reports !== undefined,
    kpis,
    charts,
    tables,
  }

  return { state, setPeriod, setBranchId, setDateFrom, setDateTo, setCategory, reload }
}

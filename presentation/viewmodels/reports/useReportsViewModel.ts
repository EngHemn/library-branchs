"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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

function getDateRangeForPeriod(period: ReportPeriod): {
  dateFrom: string
  dateTo: string
} {
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

  return {
    dateFrom: format(from, "yyyy-MM-dd"),
    dateTo: format(to, "yyyy-MM-dd"),
  }
}

function filterKpis(kpis: ReportKpi[], category: ReportCategory): ReportKpi[] {
  return kpis.filter((kpi) => kpi.category === category)
}

function filterCharts(charts: ReportChart[], category: ReportCategory): ReportChart[] {
  return charts
    .filter((chart) => chart.category === category)
    .slice(0, REPORT_CHARTS_PER_TAB)
}

function filterTables(tables: ReportTable[], category: ReportCategory): ReportTable[] {
  if (category !== "overview") {
    return []
  }

  return tables.filter((table) => table.category === "overview")
}

export function useReportsViewModel(
  getReportsUseCase: GetReportsUseCase
): ReportsViewModel {
  const initialRange = getDateRangeForPeriod("30d")
  const [reports, setReports] = useState<ReportsBundle | null>(null)
  const [status, setStatus] = useState<AsyncStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriodState] = useState<ReportPeriod>("30d")
  const [branchId, setBranchId] = useState("all")
  const [dateFrom, setDateFrom] = useState(initialRange.dateFrom)
  const [dateTo, setDateTo] = useState(initialRange.dateTo)
  const [category, setCategory] = useState<ReportCategory>("overview")

  const query: ReportsQuery = useMemo(
    () => ({
      period,
      branchId,
      dateFrom,
      dateTo,
    }),
    [period, branchId, dateFrom, dateTo]
  )

  const loadReports = useCallback(async () => {
    setStatus("loading")
    setError(null)

    const result = await getReportsUseCase.getReports(query)

    if (!result.success) {
      setReports(null)
      setStatus("error")
      setError(result.error)
      return
    }

    setReports(result.data)
    setStatus("success")
  }, [getReportsUseCase, query])

  useEffect(() => {
    void loadReports()
  }, [loadReports])

  const setPeriod = useCallback((nextPeriod: ReportPeriod) => {
    const range = getDateRangeForPeriod(nextPeriod)
    setPeriodState(nextPeriod)
    setDateFrom(range.dateFrom)
    setDateTo(range.dateTo)
  }, [])

  const kpis = useMemo(() => {
    if (!reports) {
      return []
    }

    return filterKpis(reports.kpis, category)
  }, [reports, category])

  const charts = useMemo(() => {
    if (!reports) {
      return []
    }

    return filterCharts(reports.charts, category)
  }, [reports, category])

  const tables = useMemo(() => {
    if (!reports) {
      return []
    }

    return filterTables(reports.tables, category)
  }, [reports, category])

  const branches = reports?.branches ?? []

  const state: ReportsViewModelState = {
    reports,
    status,
    error,
    period,
    branchId,
    dateFrom,
    dateTo,
    branches,
    category,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "success" && reports !== null,
    kpis,
    charts,
    tables,
  }

  return {
    state,
    setPeriod,
    setBranchId,
    setDateFrom,
    setDateTo,
    setCategory,
    reload: () => {
      void loadReports()
    },
  }
}

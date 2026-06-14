"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format, subDays, startOfYear } from "date-fns"

import { fakeBranches } from "@/data/fake/fakeBranches"
import type {
  ReportCategory,
  ReportChart,
  ReportKpi,
  ReportPeriod,
  ReportsBundle,
  ReportsQuery,
  ReportTable,
} from "@/domain/entities/reports/Reports"
import { REPORT_CHARTS_PER_TAB } from "@/domain/entities/reports/Reports"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetReportsUseCase } from "@/domain/usecases/reports/GetReportsUseCase"
import {
  getDashboardBranchScope,
  resolveUserBranchId,
  type DashboardBranchScope,
} from "@/lib/dashboardBranchScope"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  AsyncStatus,
  ReportBranchFilter,
  ReportBranchFilterOption,
  ReportsViewModelState,
} from "./ReportsViewModelState"

export type ReportsViewModel = {
  state: ReportsViewModelState
  setPeriod: (period: ReportPeriod) => void
  setBranchId: (branchId: ReportBranchFilter) => void
  setDateFrom: (dateFrom: string) => void
  setDateTo: (dateTo: string) => void
  setCategory: (category: ReportCategory) => void
  reload: () => void
}

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

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

function resolveBranchFilterId(
  branchFilter: ReportBranchFilter,
  userBranchId: string
): string {
  return branchFilter === "current" ? userBranchId : branchFilter
}

function getBranchFilterOptions(
  user: User,
  t: (key: TranslationKey) => string
): ReportBranchFilterOption[] {
  if (user.branchType === "sub") {
    return []
  }

  const userBranchId = resolveUserBranchId(user)
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)

  const otherBranches = branchScope.branches
    .filter((branch) => branch.id !== userBranchId)
    .map((branch) => ({ value: branch.id, label: branch.name }))
    .sort((left, right) => left.label.localeCompare(right.label))

  return [
    { value: "all", label: t("reports.filters.allBranches") },
    { value: "current", label: t("reports.filters.currentBranch") },
    ...otherBranches,
  ]
}

function isBranchSelectionValid(
  branchId: ReportBranchFilter,
  scope: DashboardBranchScope,
  userBranchId: string
): boolean {
  if (branchId === "all") {
    return scope.allowAllBranches
  }

  if (branchId === "current") {
    return scope.branchIds.includes(userBranchId)
  }

  return scope.branchIds.includes(branchId)
}

function resolveEffectiveBranchId(
  branchId: ReportBranchFilter,
  user: User,
  userBranchId: string
): string {
  if (user.branchType === "sub") {
    return userBranchId
  }

  return resolveBranchFilterId(branchId, userBranchId)
}

export function useReportsViewModel(
  authUseCase: AuthUseCase,
  getReportsUseCase: GetReportsUseCase
): ReportsViewModel {
  const { t } = useTranslation()
  const initialRange = getDateRangeForPeriod("30d")

  const [period, setPeriodState] = useState<ReportPeriod>("30d")
  const [branchId, setBranchIdState] = useState<ReportBranchFilter>("current")
  const [dateFrom, setDateFrom] = useState(initialRange.dateFrom)
  const [dateTo, setDateTo] = useState(initialRange.dateTo)
  const [category, setCategory] = useState<ReportCategory>("overview")

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const user = userQuery.data ?? null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const isSubBranch = user?.branchType === "sub"
  const branchScope = user ? getDashboardBranchScope(user, allDashboardBranches) : null
  const showBranchFilter = !isSubBranch
  const branchFilterOptions = user ? getBranchFilterOptions(user, t) : []

  useEffect(() => {
    if (!user || !branchScope) return

    if (isSubBranch) {
      setBranchIdState(userBranchId)
      return
    }

    setBranchIdState((current) =>
      isBranchSelectionValid(current, branchScope, userBranchId) ? current : "current"
    )
  }, [user, userBranchId, isSubBranch, branchScope?.branchIds.join(",")])

  const effectiveBranchId = user
    ? resolveEffectiveBranchId(branchId, user, userBranchId)
    : branchId === "current"
      ? "all"
      : branchId

  const query: ReportsQuery = { period, branchId: effectiveBranchId, dateFrom, dateTo }

  const { data: reports, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["reports", query, user?.branchType, userBranchId],
    queryFn: async () => {
      const result = await getReportsUseCase.getReports(query)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const status: AsyncStatus = (() => {
    if (userQuery.isPending || isPending || isFetching) return "loading"
    if (userQuery.isError || isError) return "error"
    if (reports !== undefined) return "success"
    return "idle"
  })()

  function setPeriod(nextPeriod: ReportPeriod): void {
    const range = getDateRangeForPeriod(nextPeriod)
    setPeriodState(nextPeriod)
    setDateFrom(range.dateFrom)
    setDateTo(range.dateTo)
  }

  function setBranchId(nextBranchId: ReportBranchFilter): void {
    if (isSubBranch) return
    if (branchScope && !isBranchSelectionValid(nextBranchId, branchScope, userBranchId)) return
    setBranchIdState(nextBranchId)
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
    error:
      (userQuery.isError && userQuery.error instanceof Error
        ? userQuery.error.message
        : null) ??
      (isError && error instanceof Error ? error.message : null),
    period,
    branchId,
    dateFrom,
    dateTo,
    branches: reports?.branches ?? [],
    branchFilterOptions,
    showBranchFilter,
    category,
    isLoading: userQuery.isPending || isPending || isFetching,
    isReady: status === "success" && reports !== undefined,
    kpis,
    charts,
    tables,
  }

  return { state, setPeriod, setBranchId, setDateFrom, setDateTo, setCategory, reload }
}

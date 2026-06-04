"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { isAfter, parseISO, startOfMonth, startOfWeek } from "date-fns"

import type {
  DashboardBooking,
  DashboardBook,
  DashboardMember,
  DashboardSale,
  DashboardStaff,
  DashboardSummary,
} from "@/domain/entities/dashboard/DashboardSummary"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetDashboardSummaryUseCase } from "@/domain/usecases/dashboard/GetDashboardSummaryUseCase"
import {
  getDashboardBranchScope,
  matchesDashboardBranchFilter,
  type DashboardBranchScope,
} from "@/lib/dashboardBranchScope"
import type { DashboardFilterState, DashboardStatus, DashboardViewModelState, DateRangeFilter } from "./DashboardViewModelState"
export type { DateRangeFilter } from "./DashboardViewModelState"

type DashboardViewModel = {
  state: DashboardViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  setBranchId: (branchId: string) => void
  setDateRange: (dateRange: DateRangeFilter) => void
}

type DashboardQueryData = {
  user: User | null
  summary: DashboardSummary | null
}

function filterByBranch<T extends { branchId: string }>(
  items: T[],
  branchId: string,
  scopedBranchIds: string[]
): T[] {
  return items.filter((item) =>
    matchesDashboardBranchFilter(item.branchId, branchId, scopedBranchIds)
  )
}

const defaultFilterState: DashboardFilterState = {
  branchId: "all",
  dateRange: "all",
}

function isInDateRange(dateStr: string, range: DateRangeFilter): boolean {
  if (range === "all") return true
  const now = new Date()
  const date = parseISO(dateStr)
  if (range === "today") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    )
  }
  if (range === "week") return isAfter(date, startOfWeek(now, { weekStartsOn: 1 }))
  if (range === "month") return isAfter(date, startOfMonth(now))
  return true
}

function applyFilters<
  T extends { branchId: string; createdAt?: string; addedAt?: string; registeredAt?: string },
>(
  items: T[],
  filterState: DashboardFilterState,
  scopedBranchIds: string[],
  dateKey: "createdAt" | "addedAt" | "registeredAt"
): T[] {
  return items.filter((item) => {
    if (
      !matchesDashboardBranchFilter(item.branchId, filterState.branchId, scopedBranchIds)
    ) {
      return false
    }
    const dateValue = item[dateKey]
    if (dateValue && !isInDateRange(dateValue, filterState.dateRange)) return false
    return true
  })
}

function isBranchSelectionValid(
  branchId: string,
  scope: DashboardBranchScope
): boolean {
  if (!scope.allowAllBranches && branchId === "all") return false
  if (branchId === "all") return true
  return scope.branchIds.includes(branchId)
}

export function useDashboardViewModel(
  authUseCase: AuthUseCase,
  getDashboardSummaryUseCase: GetDashboardSummaryUseCase
): DashboardViewModel {
  const queryClient = useQueryClient()
  const [filterState, setFilterState] = useState<DashboardFilterState>(defaultFilterState)
  const { data, isPending, isFetching, isError, error, refetch } = useQuery<DashboardQueryData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const currentUserResult = await authUseCase.getCurrentUser()
      if (!currentUserResult.success) throw new Error(currentUserResult.error)
      if (!currentUserResult.data) return { user: null, summary: null }
      const summaryResult = await getDashboardSummaryUseCase.getSummary()
      if (!summaryResult.success) throw new Error(summaryResult.error)
      return { user: currentUserResult.data, summary: summaryResult.data }
    },
  })

  const { mutateAsync: logoutAsync } = useMutation({
    mutationFn: async () => {
      const result = await authUseCase.logout()
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  })

  const status: DashboardStatus = (() => {
    if (isPending || isFetching) return "loading"
    if (isError) return "error"
    if (!data) return "idle"
    if (!data.user) return "unauthenticated"
    return "success"
  })()

  const user = data?.user ?? null
  const summary = data?.summary ?? null

  const branchScope: DashboardBranchScope | null =
    user && summary ? getDashboardBranchScope(user, summary.branches) : null

  const scopedBranchIds = branchScope?.branchIds ?? []

  useEffect(() => {
    if (!branchScope) return

    setFilterState((prev) => {
      if (isBranchSelectionValid(prev.branchId, branchScope)) return prev
      return { ...prev, branchId: branchScope.defaultBranchId }
    })
  }, [branchScope?.defaultBranchId, branchScope?.allowAllBranches, branchScope?.branchIds.join(",")])

  const filteredBookings: DashboardBooking[] =
    summary
      ? applyFilters(summary.recentBookings, filterState, scopedBranchIds, "createdAt")
      : []
  const filteredBooks: DashboardBook[] =
    summary
      ? applyFilters(summary.recentBooks, filterState, scopedBranchIds, "addedAt")
      : []
  const filteredMembers: DashboardMember[] =
    summary
      ? applyFilters(summary.recentMembers, filterState, scopedBranchIds, "registeredAt")
      : []
  const filteredSales: DashboardSale[] =
    summary
      ? applyFilters(summary.recentSales, filterState, scopedBranchIds, "createdAt")
      : []
  const filteredStaff: DashboardStaff[] =
    summary
      ? filterByBranch(summary.recentStaff, filterState.branchId, scopedBranchIds)
      : []

  async function reload(): Promise<void> {
    await refetch()
  }

  async function logout(): Promise<void> {
    await logoutAsync()
  }

  function setBranchId(branchId: string): void {
    if (branchScope && !branchScope.showBranchFilter) return
    if (branchScope && !isBranchSelectionValid(branchId, branchScope)) return
    setFilterState((prev) => ({ ...prev, branchId }))
  }

  function setDateRange(dateRange: DateRangeFilter): void {
    setFilterState((prev) => ({ ...prev, dateRange }))
  }

  const state: DashboardViewModelState = {
    status,
    user,
    summary,
    error: isError && error instanceof Error ? error.message : null,
    isLoading: isPending || isFetching,
    isReady: status === "success",
    isUnauthenticated: status === "unauthenticated",
    filterState,
    branchScope,
    filteredBookings,
    filteredBooks,
    filteredMembers,
    filteredSales,
    filteredStaff,
  }

  return { state, reload, logout, setBranchId, setDateRange }
}

"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
import type { DashboardFilterState, DashboardStatus, DashboardViewModelState } from "./DashboardViewModelState"

type DashboardViewModel = {
  state: DashboardViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  setBranchId: (branchId: string) => void
  setDateFrom: (dateFrom: string | null) => void
  setDateTo: (dateTo: string | null) => void
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
  dateFrom: null,
  dateTo: null,
}

function matchesDateFilter(
  dateStr: string | undefined,
  dateFrom: string | null,
  dateTo: string | null
): boolean {
  if (!dateFrom && !dateTo) return true
  if (!dateStr) return true

  const date = new Date(dateStr)

  if (dateFrom) {
    const from = new Date(dateFrom)
    from.setHours(0, 0, 0, 0)
    if (date < from) return false
  }

  if (dateTo) {
    const to = new Date(dateTo)
    to.setHours(23, 59, 59, 999)
    if (date > to) return false
  }

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
    if (!matchesDateFilter(dateValue, filterState.dateFrom, filterState.dateTo)) return false
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

  function setDateFrom(dateFrom: string | null): void {
    setFilterState((prev) => ({ ...prev, dateFrom }))
  }

  function setDateTo(dateTo: string | null): void {
    setFilterState((prev) => ({ ...prev, dateTo }))
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

  return { state, reload, logout, setBranchId, setDateFrom, setDateTo }
}

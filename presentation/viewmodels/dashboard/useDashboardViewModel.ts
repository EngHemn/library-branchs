"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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

export type DateRangeFilter = "today" | "week" | "month" | "all"

type DashboardFilterState = {
  branchId: string
  dateRange: DateRangeFilter
}

type DashboardAsyncState =
  | {
      status: "idle" | "loading"
      user: null
      summary: null
      error: null
    }
  | {
      status: "success"
      user: User
      summary: DashboardSummary
      error: null
    }
  | {
      status: "unauthenticated"
      user: null
      summary: null
      error: null
    }
  | {
      status: "error"
      user: null
      summary: null
      error: string
    }

type DashboardViewModelState = {
  status: DashboardAsyncState["status"]
  user: User | null
  summary: DashboardSummary | null
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
  filterState: DashboardFilterState
  filteredBookings: DashboardBooking[]
  filteredBooks: DashboardBook[]
  filteredMembers: DashboardMember[]
  filteredSales: DashboardSale[]
  filteredStaff: DashboardStaff[]
}

type DashboardViewModel = {
  state: DashboardViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  setBranchId: (branchId: string) => void
  setDateRange: (dateRange: DateRangeFilter) => void
}

function filterByBranch<T extends { branchId: string }>(
  items: T[],
  branchId: string
): T[] {
  if (branchId === "all") return items
  return items.filter((item) => item.branchId === branchId)
}

const idleState: DashboardAsyncState = {
  status: "idle",
  user: null,
  summary: null,
  error: null,
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
  if (range === "week") {
    return isAfter(date, startOfWeek(now, { weekStartsOn: 1 }))
  }
  if (range === "month") {
    return isAfter(date, startOfMonth(now))
  }
  return true
}

function applyFilters<T extends { branchId: string; createdAt?: string; addedAt?: string; registeredAt?: string }>(
  items: T[],
  filterState: DashboardFilterState,
  dateKey: "createdAt" | "addedAt" | "registeredAt"
): T[] {
  return items.filter((item) => {
    if (filterState.branchId !== "all" && item.branchId !== filterState.branchId) {
      return false
    }
    const dateValue = item[dateKey]
    if (dateValue && !isInDateRange(dateValue, filterState.dateRange)) {
      return false
    }
    return true
  })
}

export function useDashboardViewModel(
  authUseCase: AuthUseCase,
  getDashboardSummaryUseCase: GetDashboardSummaryUseCase
): DashboardViewModel {
  const [asyncState, setAsyncState] = useState<DashboardAsyncState>(idleState)
  const [filterState, setFilterState] = useState<DashboardFilterState>(defaultFilterState)

  const reload = useCallback(async (): Promise<void> => {
    setAsyncState({
      status: "loading",
      user: null,
      summary: null,
      error: null,
    })

    const currentUserResult = await authUseCase.getCurrentUser()

    if (!currentUserResult.success) {
      setAsyncState({
        status: "error",
        user: null,
        summary: null,
        error: currentUserResult.error,
      })
      return
    }

    if (!currentUserResult.data) {
      setAsyncState({
        status: "unauthenticated",
        user: null,
        summary: null,
        error: null,
      })
      return
    }

    const summaryResult = await getDashboardSummaryUseCase.getSummary()

    if (!summaryResult.success) {
      setAsyncState({
        status: "error",
        user: null,
        summary: null,
        error: summaryResult.error,
      })
      return
    }

    setAsyncState({
      status: "success",
      user: currentUserResult.data,
      summary: summaryResult.data,
      error: null,
    })
  }, [authUseCase, getDashboardSummaryUseCase])

  const logout = useCallback(async (): Promise<void> => {
    setAsyncState({
      status: "loading",
      user: null,
      summary: null,
      error: null,
    })

    const result = await authUseCase.logout()

    if (!result.success) {
      setAsyncState({
        status: "error",
        user: null,
        summary: null,
        error: result.error,
      })
      return
    }

    setAsyncState({
      status: "unauthenticated",
      user: null,
      summary: null,
      error: null,
    })
  }, [authUseCase])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reload()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [reload])

  const setBranchId = useCallback((branchId: string) => {
    setFilterState((prev) => ({ ...prev, branchId }))
  }, [])

  const setDateRange = useCallback((dateRange: DateRangeFilter) => {
    setFilterState((prev) => ({ ...prev, dateRange }))
  }, [])

  const filteredBookings = useMemo<DashboardBooking[]>(() => {
    if (asyncState.status !== "success") return []
    return applyFilters(asyncState.summary.recentBookings, filterState, "createdAt")
  }, [asyncState, filterState])

  const filteredBooks = useMemo<DashboardBook[]>(() => {
    if (asyncState.status !== "success") return []
    return applyFilters(asyncState.summary.recentBooks, filterState, "addedAt")
  }, [asyncState, filterState])

  const filteredMembers = useMemo<DashboardMember[]>(() => {
    if (asyncState.status !== "success") return []
    return applyFilters(asyncState.summary.recentMembers, filterState, "registeredAt")
  }, [asyncState, filterState])

  const filteredSales = useMemo<DashboardSale[]>(() => {
    if (asyncState.status !== "success") return []
    return applyFilters(asyncState.summary.recentSales, filterState, "createdAt")
  }, [asyncState, filterState])

  const filteredStaff = useMemo<DashboardStaff[]>(() => {
    if (asyncState.status !== "success") return []
    return filterByBranch(asyncState.summary.recentStaff, filterState.branchId)
  }, [asyncState, filterState.branchId])

  const state = useMemo<DashboardViewModelState>(
    () => ({
      status: asyncState.status,
      user: asyncState.status === "success" ? asyncState.user : null,
      summary: asyncState.status === "success" ? asyncState.summary : null,
      error: asyncState.status === "error" ? asyncState.error : null,
      isLoading: asyncState.status === "idle" || asyncState.status === "loading",
      isReady: asyncState.status === "success",
      isUnauthenticated: asyncState.status === "unauthenticated",
      filterState,
      filteredBookings,
      filteredBooks,
      filteredMembers,
      filteredSales,
      filteredStaff,
    }),
    [asyncState, filterState, filteredBookings, filteredBooks, filteredMembers, filteredSales, filteredStaff]
  )

  return {
    state,
    reload,
    logout,
    setBranchId,
    setDateRange,
  }
}

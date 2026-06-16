"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { fakeBranches } from "@/data/fake/fakeBranches"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"
import {
  getDashboardBranchScope,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"
import { isSingleBranchManagedUser } from "@/lib/salesStockBranchScope"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  SalesHistoryBranchFilter,
  SalesHistoryBranchFilterOption,
  SalesHistoryFilterState,
  SalesHistoryStatus,
  SalesHistoryStatusFilter,
  SalesHistoryViewModelState,
} from "./SalesHistoryViewModelState"
export type { SalesHistoryStatusFilter } from "./SalesHistoryViewModelState"
export type { SalesHistoryBranchFilter } from "./SalesHistoryViewModelState"
export type { SalesHistoryBranchFilterOption } from "./SalesHistoryViewModelState"
export type { SalesHistoryFilterState } from "./SalesHistoryViewModelState"

export type SalesHistoryViewModel = {
  state: SalesHistoryViewModelState
  setSearchQuery: (searchQuery: string) => void
  setStatusFilter: (statusFilter: SalesHistoryStatusFilter) => void
  setBranchFilter: (branchFilter: SalesHistoryBranchFilter) => void
  setDateFrom: (dateFrom: string | null) => void
  setDateTo: (dateTo: string | null) => void
  reload: () => Promise<void>
}

const defaultFilters: SalesHistoryFilterState = {
  searchQuery: "",
  statusFilter: "all",
  branchFilter: "current",
  dateFrom: null,
  dateTo: null,
}

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

function matchesBookSearch(sale: Sale, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return sale.items.some((item) =>
    item.book.title.toLowerCase().includes(normalizedQuery)
  )
}

function matchesDateRange(
  sale: Sale,
  dateFrom: string | null,
  dateTo: string | null
): boolean {
  const saleDate = new Date(sale.createdAt)

  if (dateFrom) {
    const from = new Date(dateFrom)
    from.setHours(0, 0, 0, 0)
    if (saleDate < from) {
      return false
    }
  }

  if (dateTo) {
    const to = new Date(dateTo)
    to.setHours(23, 59, 59, 999)
    if (saleDate > to) {
      return false
    }
  }

  return true
}

function getScopedBranchIds(user: User): string[] {
  return getDashboardBranchScope(user, allDashboardBranches).branchIds
}

function resolveBranchFilterId(
  branchFilter: SalesHistoryBranchFilter,
  userBranchId: string
): string {
  return branchFilter === "current" ? userBranchId : branchFilter
}

function getBranchFilterOptions(
  user: User,
  currentBranchLabel: string
): SalesHistoryBranchFilterOption[] {
  if (isSingleBranchManagedUser(user)) {
    return []
  }

  const userBranchId = resolveUserBranchId(user)
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)

  const otherBranches = branchScope.branches
    .filter((branch) => branch.id !== userBranchId)
    .map((branch) => ({ value: branch.id, label: branch.name }))
    .sort((left, right) => left.label.localeCompare(right.label))

  return [{ value: "current", label: currentBranchLabel }, ...otherBranches]
}

function filterSales(
  sales: Sale[],
  filters: SalesHistoryFilterState,
  scopedBranchIds: string[],
  isSubBranch: boolean,
  userBranchId: string
): Sale[] {
  const effectiveBranchId = isSubBranch
    ? userBranchId
    : resolveBranchFilterId(filters.branchFilter, userBranchId)

  return sales.filter((sale) => {
    if (!scopedBranchIds.includes(sale.branchId)) {
      return false
    }

    if (sale.branchId !== effectiveBranchId) {
      return false
    }

    if (
      filters.statusFilter !== "all" &&
      sale.status !== filters.statusFilter
    ) {
      return false
    }

    if (!matchesBookSearch(sale, filters.searchQuery)) {
      return false
    }

    return matchesDateRange(sale, filters.dateFrom, filters.dateTo)
  })
}

export function useSalesHistoryViewModel(
  authUseCase: AuthUseCase,
  salesUseCase: SalesUseCase
): SalesHistoryViewModel {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<SalesHistoryFilterState>(defaultFilters)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const salesHistoryQuery = useQuery({
    queryKey: ["sales-history"],
    queryFn: async () => {
      const result = await salesUseCase.getSalesHistory()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  async function reload(): Promise<void> {
    await Promise.all([userQuery.refetch(), salesHistoryQuery.refetch()])
  }

  const user = userQuery.data ?? null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const isSubBranch = user ? isSingleBranchManagedUser(user) : false
  const showBranchFilter = !isSubBranch
  const showBranchColumn = !isSubBranch && filters.branchFilter !== "current"
  const branchFilterOptions = user
    ? getBranchFilterOptions(user, t("sales.history.currentBranch"))
    : []
  const scopedBranchIds = user ? getScopedBranchIds(user) : []

  const sales = salesHistoryQuery.data ?? []
  const filteredSales =
    user && userBranchId
      ? filterSales(sales, filters, scopedBranchIds, isSubBranch, userBranchId)
      : []

  const status: SalesHistoryStatus =
    userQuery.isPending || salesHistoryQuery.isPending
      ? "loading"
      : userQuery.isError || salesHistoryQuery.isError
        ? "error"
        : userQuery.isSuccess && salesHistoryQuery.isSuccess
          ? "success"
          : "idle"

  const queryError =
    userQuery.error instanceof Error
      ? userQuery.error.message
      : salesHistoryQuery.error instanceof Error
        ? salesHistoryQuery.error.message
        : null

  function setSearchQuery(searchQuery: string): void {
    setFilters((current) => ({ ...current, searchQuery }))
  }

  function setStatusFilter(statusFilter: SalesHistoryStatusFilter): void {
    setFilters((current) => ({ ...current, statusFilter }))
  }

  function setBranchFilter(branchFilter: SalesHistoryBranchFilter): void {
    setFilters((current) => ({ ...current, branchFilter }))
  }

  function setDateFrom(dateFrom: string | null): void {
    setFilters((current) => ({ ...current, dateFrom }))
  }

  function setDateTo(dateTo: string | null): void {
    setFilters((current) => ({ ...current, dateTo }))
  }

  const state: SalesHistoryViewModelState = {
    status,
    sales,
    filteredSales,
    filters,
    branchFilterOptions,
    showBranchFilter,
    showBranchColumn,
    error: queryError,
  }

  return {
    state,
    setSearchQuery,
    setStatusFilter,
    setBranchFilter,
    setDateFrom,
    setDateTo,
    reload,
  }
}

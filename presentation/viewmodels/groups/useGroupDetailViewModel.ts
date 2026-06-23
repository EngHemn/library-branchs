"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { fakeBranches } from "@/data/fake/fakeBranches"
import type { GroupAssignedBook } from "@/domain/entities/group/Group"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"
import {
  getDashboardBranchScope,
  isBranchScopedDashboardUser,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { buildGroupSalesReport } from "@/domain/services/group/buildGroupSalesReport"
import { emptyGroupSalesReport } from "@/domain/entities/group/GroupSalesReport"
import type {
  GroupBooksFilterState,
  GroupBranchFilterOption,
  GroupDetailStatus,
  GroupDetailViewModelState,
  GroupSalesFilterState,
  GroupSalesHistoryStatus,
} from "./GroupDetailViewModelState"

type GroupDetailViewModel = {
  state: GroupDetailViewModelState
  setBooksSearchQuery: (searchQuery: string) => void
  setBooksCategoryFilter: (
    categoryFilter: GroupBooksFilterState["categoryFilter"]
  ) => void
  setBooksAuthorFilter: (
    authorFilter: GroupBooksFilterState["authorFilter"]
  ) => void
  setBooksBranchFilter: (
    branchFilter: GroupBooksFilterState["branchFilter"]
  ) => void
  setSalesBranchFilter: (
    branchFilter: GroupSalesFilterState["branchFilter"]
  ) => void
  setSalesDateFrom: (dateFrom: string | null) => void
  setSalesDateTo: (dateTo: string | null) => void
  reload: () => Promise<void>
}

const defaultBooksFilters: GroupBooksFilterState = {
  searchQuery: "",
  categoryFilter: "all",
  authorFilter: "all",
  branchFilter: "current",
}

const defaultSalesFilters: GroupSalesFilterState = {
  branchFilter: "current",
  dateFrom: null,
  dateTo: null,
}

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

function resolveBranchFilterId(
  branchFilter: string,
  userBranchId: string
): string {
  return branchFilter === "current" ? userBranchId : branchFilter
}

function getBranchFilterOptions(
  user: User,
  allBranchesLabel: string,
  currentBranchLabel: string
): GroupBranchFilterOption[] {
  if (isBranchScopedDashboardUser(user)) {
    return []
  }

  const userBranchId = resolveUserBranchId(user)
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)

  const otherBranches = branchScope.branches
    .filter((branch) => branch.id !== userBranchId)
    .map((branch) => ({ value: branch.id, label: branch.name }))
    .sort((left, right) => left.label.localeCompare(right.label))

  return [
    { value: "all", label: allBranchesLabel },
    { value: "current", label: currentBranchLabel },
    ...otherBranches,
  ]
}

function getUniqueBookValues(
  books: GroupAssignedBook[],
  accessor: (book: GroupAssignedBook) => string
): string[] {
  return Array.from(new Set(books.map(accessor))).sort()
}

function matchesBookSearch(
  book: GroupAssignedBook,
  searchQuery: string
): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  if (!normalizedQuery) return true
  return book.title.toLowerCase().includes(normalizedQuery)
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
    if (saleDate < from) return false
  }

  if (dateTo) {
    const to = new Date(dateTo)
    to.setHours(23, 59, 59, 999)
    if (saleDate > to) return false
  }

  return true
}

function filterGroupBooks(
  books: GroupAssignedBook[],
  filters: GroupBooksFilterState,
  userBranchId: string,
  isSubBranch: boolean,
  scopedBranchIds: string[]
): GroupAssignedBook[] {
  return books.filter((book) => {
    if (!scopedBranchIds.includes(book.branchId)) {
      return false
    }

    if (filters.branchFilter !== "all") {
      const effectiveBranchId = isSubBranch
        ? userBranchId
        : resolveBranchFilterId(filters.branchFilter, userBranchId)

      if (book.branchId !== effectiveBranchId) {
        return false
      }
    }

    if (
      filters.categoryFilter !== "all" &&
      book.category !== filters.categoryFilter
    ) {
      return false
    }

    if (
      filters.authorFilter !== "all" &&
      book.author !== filters.authorFilter
    ) {
      return false
    }

    return matchesBookSearch(book, filters.searchQuery)
  })
}

function filterGroupSales(
  sales: Sale[],
  filters: GroupSalesFilterState,
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

    return matchesDateRange(sale, filters.dateFrom, filters.dateTo)
  })
}

type GroupDetailViewModelOptions = {
  initialBooksBranchFilter?: GroupBooksFilterState["branchFilter"]
}

export function useGroupDetailViewModel(
  groupId: string,
  authUseCase: AuthUseCase,
  groupManagementUseCase: GroupManagementUseCase,
  options?: GroupDetailViewModelOptions
): GroupDetailViewModel {
  const { t } = useTranslation()
  const [booksFilters, setBooksFilters] = useState<GroupBooksFilterState>(
    () => ({
      ...defaultBooksFilters,
      branchFilter:
        options?.initialBooksBranchFilter ?? defaultBooksFilters.branchFilter,
    })
  )
  const [salesFilters, setSalesFilters] =
    useState<GroupSalesFilterState>(defaultSalesFilters)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const groupQuery = useQuery({
    queryKey: ["groups", groupId],
    queryFn: async () => {
      const result = await groupManagementUseCase.getGroupById(groupId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const salesQuery = useQuery({
    queryKey: ["groups", groupId, "sales-history"],
    queryFn: async () => {
      const result = await groupManagementUseCase.getGroupSalesHistory(groupId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: groupQuery.isSuccess && groupQuery.data !== null,
  })

  let status: GroupDetailStatus
  if (userQuery.isPending || groupQuery.isPending) {
    status = "loading"
  } else if (userQuery.isError || groupQuery.isError) {
    status = "error"
  } else if (groupQuery.data === null) {
    status = "not_found"
  } else {
    status = "ready"
  }

  let salesStatus: GroupSalesHistoryStatus
  if (salesQuery.isPending) {
    salesStatus = "loading"
  } else if (salesQuery.isError) {
    salesStatus = "error"
  } else if (salesQuery.isSuccess) {
    salesStatus = "success"
  } else {
    salesStatus = "idle"
  }

  const user = userQuery.data ?? null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const isBranchScopedUser = user ? isBranchScopedDashboardUser(user) : false
  const showBooksBranchFilter = !isBranchScopedUser
  const showSalesBranchFilter = !isBranchScopedUser
  const showSalesBranchColumn =
    !isBranchScopedUser && salesFilters.branchFilter !== "current"
  const branchFilterOptions = user
    ? getBranchFilterOptions(
        user,
        t("groups.filters.allBranches"),
        t("groups.filters.currentBranch")
      )
    : []
  const scopedBranchIds = user
    ? getDashboardBranchScope(user, allDashboardBranches).branchIds
    : []

  const groupBooks = groupQuery.data?.books ?? []
  const bookCategories = getUniqueBookValues(
    groupBooks,
    (book) => book.category
  )
  const bookAuthors = getUniqueBookValues(groupBooks, (book) => book.author)

  const filteredBooks =
    user && userBranchId
      ? filterGroupBooks(
          groupBooks,
          booksFilters,
          userBranchId,
          isBranchScopedUser,
          scopedBranchIds
        )
      : []

  const sales = salesQuery.data ?? []
  const filteredSales =
    user && userBranchId
      ? filterGroupSales(
          sales,
          salesFilters,
          scopedBranchIds,
          isBranchScopedUser,
          userBranchId
        )
      : []

  const salesReport =
    salesStatus === "success"
      ? buildGroupSalesReport(filteredSales)
      : emptyGroupSalesReport

  async function reload(): Promise<void> {
    await Promise.all([
      userQuery.refetch(),
      groupQuery.refetch(),
      salesQuery.refetch(),
    ])
  }

  function setBooksSearchQuery(searchQuery: string): void {
    setBooksFilters((current) => ({ ...current, searchQuery }))
  }

  function setBooksCategoryFilter(
    categoryFilter: GroupBooksFilterState["categoryFilter"]
  ): void {
    setBooksFilters((current) => ({ ...current, categoryFilter }))
  }

  function setBooksAuthorFilter(
    authorFilter: GroupBooksFilterState["authorFilter"]
  ): void {
    setBooksFilters((current) => ({ ...current, authorFilter }))
  }

  function setBooksBranchFilter(
    branchFilter: GroupBooksFilterState["branchFilter"]
  ): void {
    setBooksFilters((current) => ({ ...current, branchFilter }))
  }

  function setSalesBranchFilter(
    branchFilter: GroupSalesFilterState["branchFilter"]
  ): void {
    setSalesFilters((current) => ({ ...current, branchFilter }))
  }

  function setSalesDateFrom(dateFrom: string | null): void {
    setSalesFilters((current) => ({ ...current, dateFrom }))
  }

  function setSalesDateTo(dateTo: string | null): void {
    setSalesFilters((current) => ({ ...current, dateTo }))
  }

  return {
    state: {
      status,
      user,
      group: groupQuery.data ?? null,
      sales,
      filteredBooks,
      filteredSales,
      salesReport,
      booksFilters,
      salesFilters,
      bookCategories,
      bookAuthors,
      booksBranchFilterOptions: branchFilterOptions,
      salesBranchFilterOptions: branchFilterOptions,
      showBooksBranchFilter,
      showSalesBranchFilter,
      showSalesBranchColumn,
      salesStatus,
      salesError: salesQuery.error?.message ?? null,
      error: userQuery.error?.message ?? groupQuery.error?.message ?? null,
      isLoading: status === "loading",
      isReady: status === "ready",
      isNotFound: status === "not_found",
      isError: status === "error",
      isSalesLoading: salesStatus === "loading",
    },
    setBooksSearchQuery,
    setBooksCategoryFilter,
    setBooksAuthorFilter,
    setBooksBranchFilter,
    setSalesBranchFilter,
    setSalesDateFrom,
    setSalesDateTo,
    reload,
  }
}

"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fakeBranches } from "@/data/fake/fakeBranches"
import { findLibraryBookById } from "@/data/shared/libraryBooksStore"
import type { Order } from "@/domain/entities/order/Order"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import {
  getDashboardBranchScope,
  getSubBranchNetworkBranchIds,
  isBranchScopedDashboardUser,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  OrderBranchFilter,
  OrderBranchFilterOption,
  OrdersFilterState,
  OrdersStatus,
  OrdersViewModelState,
} from "./OrdersViewModelState"

export type { OrderBranchFilter } from "./OrdersViewModelState"
export type { OrderBranchFilterOption } from "./OrdersViewModelState"
export type { OrdersFilterState } from "./OrdersViewModelState"

type OrdersViewModel = {
  state: OrdersViewModelState
  setSearchQuery: (value: string) => void
  setBranchFilter: (value: OrderBranchFilter) => void
  setStatusFilter: (value: OrdersFilterState["statusFilter"]) => void
  setCategoryFilter: (value: OrdersFilterState["categoryFilter"]) => void
  setAuthorFilter: (value: OrdersFilterState["authorFilter"]) => void
  setTranslatorFilter: (value: OrdersFilterState["translatorFilter"]) => void
  setDateFrom: (dateFrom: string | null) => void
  setDateTo: (dateTo: string | null) => void
  clearFilters: () => void
  deleteOrder: (orderId: string) => Promise<boolean>
  reload: () => Promise<void>
}

const defaultFilters: OrdersFilterState = {
  searchQuery: "",
  branchFilter: "current",
  statusFilter: "all",
  categoryFilter: "all",
  authorFilter: "all",
  translatorFilter: "all",
  dateFrom: null,
  dateTo: null,
}

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

function resolveBranchFilterId(
  branchFilter: OrderBranchFilter,
  userBranchId: string
): string {
  if (branchFilter === "current" || branchFilter === "all") {
    return userBranchId
  }

  return branchFilter
}

function getScopedBranchIds(user: User): string[] {
  if (user.branchType === "sub") {
    return getSubBranchNetworkBranchIds(resolveUserBranchId(user))
  }

  return getDashboardBranchScope(user, allDashboardBranches).branchIds
}

function getBranchFilterOptions(
  user: User,
  allBranchesLabel: string,
  currentBranchLabel: string
): OrderBranchFilterOption[] {
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

function matchesBranchFilter(
  orderBranchId: string,
  branchFilter: OrderBranchFilter,
  userBranchId: string
): boolean {
  if (branchFilter === "all") {
    return true
  }

  const effectiveBranchId = resolveBranchFilterId(branchFilter, userBranchId)
  return orderBranchId === effectiveBranchId
}

function matchesDateRange(
  order: Order,
  dateFrom: string | null,
  dateTo: string | null
): boolean {
  const orderDate = new Date(order.orderDate)

  if (dateFrom) {
    const from = new Date(dateFrom)
    from.setHours(0, 0, 0, 0)
    if (orderDate < from) {
      return false
    }
  }

  if (dateTo) {
    const to = new Date(dateTo)
    to.setHours(23, 59, 59, 999)
    if (orderDate > to) {
      return false
    }
  }

  return true
}

function collectOrderFilterOptions(orders: Order[]): {
  categories: string[]
  authors: string[]
  translators: string[]
} {
  const categories = new Set<string>()
  const authors = new Set<string>()
  const translators = new Set<string>()

  for (const order of orders) {
    for (const bookId of order.bookIds) {
      const book = findLibraryBookById(bookId)
      if (!book) continue
      categories.add(book.category)
      authors.add(book.author)
      if (book.translator) {
        translators.add(book.translator)
      }
    }
  }

  return {
    categories: Array.from(categories).sort(),
    authors: Array.from(authors).sort(),
    translators: Array.from(translators).sort(),
  }
}

function orderMatchesBookFilters(
  order: Order,
  categoryFilter: OrdersFilterState["categoryFilter"],
  authorFilter: OrdersFilterState["authorFilter"],
  translatorFilter: OrdersFilterState["translatorFilter"]
): boolean {
  if (
    categoryFilter === "all" &&
    authorFilter === "all" &&
    translatorFilter === "all"
  ) {
    return true
  }

  return order.bookIds.some((bookId) => {
    const book = findLibraryBookById(bookId)
    if (!book) return false

    if (categoryFilter !== "all" && book.category !== categoryFilter) {
      return false
    }

    if (authorFilter !== "all" && book.author !== authorFilter) {
      return false
    }

    if (translatorFilter !== "all" && book.translator !== translatorFilter) {
      return false
    }

    return true
  })
}

function filterOrders(
  orders: Order[],
  filters: OrdersFilterState,
  scopedBranchIds: string[],
  userBranchId: string
): Order[] {
  const normalizedSearch = filters.searchQuery.trim().toLowerCase()

  return orders.filter((order) => {
    if (!scopedBranchIds.includes(order.branchId)) {
      return false
    }

    if (
      !matchesBranchFilter(order.branchId, filters.branchFilter, userBranchId)
    ) {
      return false
    }

    if (
      filters.statusFilter !== "all" &&
      order.status !== filters.statusFilter
    ) {
      return false
    }

    const matchesSearch =
      normalizedSearch.length === 0 ||
      order.supplierName.toLowerCase().includes(normalizedSearch) ||
      order.branchName.toLowerCase().includes(normalizedSearch) ||
      order.id.toLowerCase().includes(normalizedSearch) ||
      order.phoneNumber.toLowerCase().includes(normalizedSearch)

    if (!matchesSearch) {
      return false
    }

    if (
      !orderMatchesBookFilters(
        order,
        filters.categoryFilter,
        filters.authorFilter,
        filters.translatorFilter
      )
    ) {
      return false
    }

    return matchesDateRange(order, filters.dateFrom, filters.dateTo)
  })
}

export function useOrdersViewModel(
  authUseCase: AuthUseCase,
  getOrdersUseCase: GetOrdersUseCase
): OrdersViewModel {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<OrdersFilterState>(defaultFilters)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const {
    data: orders,
    status: queryStatus,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const result = await getOrdersUseCase.getOrders()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const {
    mutateAsync: deleteOrderAsync,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: async (orderId: string) => {
      const result = await getOrdersUseCase.deleteOrder(orderId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  })

  async function deleteOrder(orderId: string): Promise<boolean> {
    try {
      await deleteOrderAsync(orderId)
      return true
    } catch {
      return false
    }
  }

  async function reload(): Promise<void> {
    await Promise.all([userQuery.refetch(), refetch()])
  }

  const user = userQuery.data ?? null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const isBranchScopedUser = user ? isBranchScopedDashboardUser(user) : false
  const showSubBranchFilter = !isBranchScopedUser
  const showTranslatorFilter = !isBranchScopedUser
  const showBranchColumn = !isBranchScopedUser && filters.branchFilter !== "current"
  const branchFilterOptions = user
    ? getBranchFilterOptions(
        user,
        t("orders.filters.allBranches"),
        t("orders.filters.currentBranch")
      )
    : []
  const scopedBranchIds = user ? getScopedBranchIds(user) : []

  const allOrders = orders ?? []
  const filterOptions = collectOrderFilterOptions(allOrders)
  const filteredOrders =
    user && userBranchId
      ? filterOrders(
          allOrders,
          filters,
          scopedBranchIds,
          userBranchId
        )
      : []

  const status: OrdersStatus =
    userQuery.isPending || queryStatus === "pending"
      ? "loading"
      : userQuery.isError || queryStatus === "error"
        ? "error"
        : userQuery.isSuccess && queryStatus === "success"
          ? "ready"
          : "idle"

  function setSearchQuery(searchQuery: string): void {
    setFilters((current) => ({ ...current, searchQuery }))
  }

  function setBranchFilter(branchFilter: OrderBranchFilter): void {
    setFilters((current) => ({ ...current, branchFilter }))
  }

  function setStatusFilter(
    statusFilter: OrdersFilterState["statusFilter"]
  ): void {
    setFilters((current) => ({ ...current, statusFilter }))
  }

  function setCategoryFilter(
    categoryFilter: OrdersFilterState["categoryFilter"]
  ): void {
    setFilters((current) => ({ ...current, categoryFilter }))
  }

  function setAuthorFilter(
    authorFilter: OrdersFilterState["authorFilter"]
  ): void {
    setFilters((current) => ({ ...current, authorFilter }))
  }

  function setTranslatorFilter(
    translatorFilter: OrdersFilterState["translatorFilter"]
  ): void {
    setFilters((current) => ({ ...current, translatorFilter }))
  }

  function setDateFrom(dateFrom: string | null): void {
    setFilters((current) => ({ ...current, dateFrom }))
  }

  function setDateTo(dateTo: string | null): void {
    setFilters((current) => ({ ...current, dateTo }))
  }

  function clearFilters(): void {
    setFilters(defaultFilters)
  }

  const state: OrdersViewModelState = {
    status,
    orders: allOrders,
    filteredOrders,
    filters,
    branchFilterOptions,
    categories: filterOptions.categories,
    authors: filterOptions.authors,
    translators: filterOptions.translators,
    showSubBranchFilter,
    showTranslatorFilter,
    showBranchColumn,
    error: deleteError?.message ?? queryError?.message ?? null,
    isLoading: userQuery.isPending || queryStatus === "pending",
    isReady: userQuery.isSuccess && queryStatus === "success",
    isDeleting,
  }

  return {
    state,
    setSearchQuery,
    setBranchFilter,
    setStatusFilter,
    setCategoryFilter,
    setAuthorFilter,
    setTranslatorFilter,
    setDateFrom,
    setDateTo,
    clearFilters,
    deleteOrder,
    reload,
  }
}

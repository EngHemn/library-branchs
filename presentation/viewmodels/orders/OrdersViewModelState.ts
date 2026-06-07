"use client"

import type { Order } from "@/domain/entities/order/Order"

export type OrdersStatus = "idle" | "loading" | "ready" | "error"

export type OrderBranchFilter = "current" | "all" | string

export type OrderBranchFilterOption = {
  value: string
  label: string
}

export type OrderStatusFilter = "all" | Order["status"]

export type OrderCategoryFilter = "all" | string
export type OrderAuthorFilter = "all" | string
export type OrderTranslatorFilter = "all" | string

export type OrdersFilterState = {
  searchQuery: string
  branchFilter: OrderBranchFilter
  statusFilter: OrderStatusFilter
  categoryFilter: OrderCategoryFilter
  authorFilter: OrderAuthorFilter
  translatorFilter: OrderTranslatorFilter
  dateFrom: string | null
  dateTo: string | null
}

export type OrdersViewModelState = {
  status: OrdersStatus
  orders: Order[]
  filteredOrders: Order[]
  filters: OrdersFilterState
  branchFilterOptions: OrderBranchFilterOption[]
  categories: string[]
  authors: string[]
  translators: string[]
  showSubBranchFilter: boolean
  showTranslatorFilter: boolean
  showBranchColumn: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isDeleting: boolean
}

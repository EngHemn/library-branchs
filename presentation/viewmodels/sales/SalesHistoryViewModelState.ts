"use client"

import type { Sale } from "@/domain/entities/sales/Sale"
import type { SaleStatus } from "@/domain/entities/sales/SaleStatus"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"

export type SalesHistoryStatus = "idle" | "loading" | "success" | "error"
export type SalesHistoryStatusFilter = "all" | SaleStatus
export type SalesHistoryBranchFilter = "current" | string

export type SalesHistoryBranchFilterOption = {
  value: string
  label: string
}

export type SalesHistoryFilterState = {
  searchQuery: string
  statusFilter: SalesHistoryStatusFilter
  branchFilter: SalesHistoryBranchFilter
  dateFrom: string | null
  dateTo: string | null
}

export type SalesHistoryViewModelState = {
  status: SalesHistoryStatus
  sales: Sale[]
  filteredSales: Sale[]
  filters: SalesHistoryFilterState
  branchFilterOptions: SalesHistoryBranchFilterOption[]
  showBranchFilter: boolean
  showBranchColumn: boolean
  error: string | null
}

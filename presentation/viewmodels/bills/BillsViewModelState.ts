"use client"

import type { Bill } from "@/domain/entities/bill/Bill"

export type BillsStatus = "idle" | "loading" | "ready" | "error"

export type BillBranchFilter = "current" | string

export type BillBranchFilterOption = {
  value: string
  label: string
}

export type BillAddedByFilter = "all" | string

export type BillAddedByFilterOption = {
  value: string
  label: string
}

export type BillsFilterState = {
  searchQuery: string
  branchFilter: BillBranchFilter
  addedByFilter: BillAddedByFilter
  dateFrom: string | null
  dateTo: string | null
}

export type BillsViewModelState = {
  status: BillsStatus
  bills: Bill[]
  filteredBills: Bill[]
  filters: BillsFilterState
  branchFilterOptions: BillBranchFilterOption[]
  addedByFilterOptions: BillAddedByFilterOption[]
  showBranchFilter: boolean
  showBranchColumn: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isDeleting: boolean
}

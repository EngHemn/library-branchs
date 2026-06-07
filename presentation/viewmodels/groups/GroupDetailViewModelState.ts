import type { GroupAssignedBook, GroupDetail } from "@/domain/entities/group/Group"
import type { GroupSalesReport } from "@/domain/entities/group/GroupSalesReport"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { User } from "@/domain/entities/User"

export type GroupDetailStatus =
  | "loading"
  | "ready"
  | "not_found"
  | "error"

export type GroupSalesHistoryStatus = "idle" | "loading" | "success" | "error"

export type GroupBooksBranchFilter = "all" | "current" | string

export type GroupBooksCategoryFilter = "all" | string

export type GroupBooksAuthorFilter = "all" | string

export type GroupSalesBranchFilter = "current" | string

export type GroupBranchFilterOption = {
  value: GroupBooksBranchFilter
  label: string
}

export type GroupBooksFilterState = {
  searchQuery: string
  categoryFilter: GroupBooksCategoryFilter
  authorFilter: GroupBooksAuthorFilter
  branchFilter: GroupBooksBranchFilter
}

export type GroupSalesFilterState = {
  branchFilter: GroupSalesBranchFilter
  dateFrom: string | null
  dateTo: string | null
}

export type GroupDetailViewModelState = {
  status: GroupDetailStatus
  user: User | null
  group: GroupDetail | null
  sales: Sale[]
  filteredBooks: GroupAssignedBook[]
  filteredSales: Sale[]
  salesReport: GroupSalesReport
  booksFilters: GroupBooksFilterState
  salesFilters: GroupSalesFilterState
  bookCategories: string[]
  bookAuthors: string[]
  booksBranchFilterOptions: GroupBranchFilterOption[]
  salesBranchFilterOptions: GroupBranchFilterOption[]
  showBooksBranchFilter: boolean
  showSalesBranchFilter: boolean
  showSalesBranchColumn: boolean
  salesStatus: GroupSalesHistoryStatus
  salesError: string | null
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSalesLoading: boolean
}

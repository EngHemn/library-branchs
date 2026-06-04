"use client"

import type {
  Branch,
  BranchStats,
  BranchStatus,
  BranchType,
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import type { User } from "@/domain/entities/User"

export type BranchTypeFilter = "all" | BranchType
export type BranchStatusFilter = "all" | BranchStatus
export type ActiveBranchFilterId = "search" | "type" | "status"

export type BranchFilterState = {
  searchQuery: string
  typeFilter: BranchTypeFilter
  statusFilter: BranchStatusFilter
}

export type ActiveBranchFilter = {
  id: ActiveBranchFilterId
  label: string
  value: string
}

export type BranchManagementDialog = {
  title: string
  description: string
} | null

export type BranchManagementStatus =
  | "idle"
  | "loading"
  | "success"
  | "unauthenticated"
  | "error"

export type BranchManagementViewModelState = {
  status: BranchManagementStatus
  user: User | null
  branches: Branch[]
  filteredBranches: Branch[]
  mainBranchRequests: MainBranchRequest[]
  subBranchRequests: SubBranchRequest[]
  filters: BranchFilterState
  activeFilters: ActiveBranchFilter[]
  stats: BranchStats
  expandedMainRequestIds: string[]
  expandedSubRequestIds: string[]
  dialog: BranchManagementDialog
  error: string | null
  canResetFilters: boolean
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
}

"use client"

import type {
  StaffMember,
  StaffRole,
  StaffStats,
  StaffStatus,
} from "@/domain/entities/staff/StaffMember"
import type { User } from "@/domain/entities/User"

export type StaffRoleFilter = "all" | StaffRole
export type StaffStatusFilter = "all" | StaffStatus
export type StaffBranchFilter = "all" | "current" | string

export type StaffBranchFilterOption = {
  value: string
  label: string
}

export type StaffFilterState = {
  searchQuery: string
  roleFilter: StaffRoleFilter
  branchFilter: StaffBranchFilter
  statusFilter: StaffStatusFilter
}

export type StaffManagementDialog = {
  title: string
  description: string
} | null

export type StaffManagementPageStatus =
  | "idle"
  | "loading"
  | "success"
  | "unauthenticated"
  | "error"

export type StaffDeleteDialogState = {
  staffId: string
  staffName: string
}

export type StaffManagementViewModelState = {
  status: StaffManagementPageStatus
  user: User | null
  staff: StaffMember[]
  filteredStaff: StaffMember[]
  branchFilterOptions: StaffBranchFilterOption[]
  filters: StaffFilterState
  stats: StaffStats
  dialog: StaffManagementDialog
  deleteStaffDialog: StaffDeleteDialogState | null
  deleteStaffError: string | null
  isDeletingStaff: boolean
  showBranchFilter: boolean
  showBranchColumn: boolean
  showBranchAdminRole: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
}

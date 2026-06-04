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
export type StaffBranchFilter = "all" | string

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

export type StaffManagementViewModelState = {
  status: StaffManagementPageStatus
  user: User | null
  staff: StaffMember[]
  filteredStaff: StaffMember[]
  branches: string[]
  filters: StaffFilterState
  stats: StaffStats
  dialog: StaffManagementDialog
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
}

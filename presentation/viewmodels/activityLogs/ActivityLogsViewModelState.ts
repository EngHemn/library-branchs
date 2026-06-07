"use client"

import type {
  ActivityLog,
  ActivityLogAction,
  ActivityLogBranchOption,
  ActivityLogStaffOption,
} from "@/domain/entities/activity-log/ActivityLog"

export type AsyncStatus = "idle" | "loading" | "success" | "error"
export type ActivityActionFilter = "all" | ActivityLogAction
export type ActivityBranchFilter = "all" | "current" | string
export type ActivityStaffFilter = "all" | string

export type ActivityBranchFilterOption = {
  value: ActivityBranchFilter
  label: string
}

export type ActivityLogsViewModelState = {
  logs: ActivityLog[]
  status: AsyncStatus
  error: string | null
  searchQuery: string
  actionFilter: ActivityActionFilter
  branchFilter: ActivityBranchFilter
  staffFilter: ActivityStaffFilter
  branchOptions: ActivityLogBranchOption[]
  branchFilterOptions: ActivityBranchFilterOption[]
  showBranchFilter: boolean
  staffOptions: ActivityLogStaffOption[]
  filteredLogs: ActivityLog[]
  isLoading: boolean
  isReady: boolean
}

"use client"

import type {
  ActivityLog,
  ActivityLogAction,
  ActivityLogBranchOption,
  ActivityLogStaffOption,
} from "@/domain/entities/activity-log/ActivityLog"

export type AsyncStatus = "idle" | "loading" | "success" | "error"
export type ActivityActionFilter = "all" | ActivityLogAction
export type ActivityBranchFilter = "all" | string
export type ActivityStaffFilter = "all" | string

export type ActivityLogsViewModelState = {
  logs: ActivityLog[]
  status: AsyncStatus
  error: string | null
  searchQuery: string
  actionFilter: ActivityActionFilter
  branchFilter: ActivityBranchFilter
  staffFilter: ActivityStaffFilter
  branchOptions: ActivityLogBranchOption[]
  staffOptions: ActivityLogStaffOption[]
  filteredLogs: ActivityLog[]
  isLoading: boolean
  isReady: boolean
}

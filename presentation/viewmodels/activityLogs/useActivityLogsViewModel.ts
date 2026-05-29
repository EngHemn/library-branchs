"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type {
  ActivityLog,
  ActivityLogAction,
  ActivityLogBranchOption,
  ActivityLogStaffOption,
} from "@/domain/entities/activity-log/ActivityLog"
import type { GetActivityLogsUseCase } from "@/domain/usecases/activityLogs/GetActivityLogsUseCase"

type AsyncStatus = "idle" | "loading" | "success" | "error"
type ActivityActionFilter = "all" | ActivityLogAction
type ActivityBranchFilter = "all" | string
type ActivityStaffFilter = "all" | string

type ActivityLogsViewModelState = {
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

export type ActivityLogsViewModel = {
  state: ActivityLogsViewModelState
  setSearchQuery: (value: string) => void
  setActionFilter: (value: ActivityActionFilter) => void
  setBranchFilter: (value: ActivityBranchFilter) => void
  setStaffFilter: (value: ActivityStaffFilter) => void
  reload: () => Promise<void>
}

function matchesSearch(log: ActivityLog, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  const searchableValues = [
    log.description,
    log.entityType,
    log.entityId ?? "",
    log.staffName,
    log.staffId,
    log.branchName,
    log.id,
    log.ipAddress,
  ]

  return searchableValues.some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  )
}

function filterLogs(
  logs: ActivityLog[],
  searchQuery: string,
  actionFilter: ActivityActionFilter,
  branchFilter: ActivityBranchFilter,
  staffFilter: ActivityStaffFilter
): ActivityLog[] {
  return logs.filter((log) => {
    if (actionFilter !== "all" && log.action !== actionFilter) {
      return false
    }

    if (branchFilter !== "all" && log.branchId !== branchFilter) {
      return false
    }

    if (staffFilter !== "all" && log.staffId !== staffFilter) {
      return false
    }

    return matchesSearch(log, searchQuery)
  })
}

export function useActivityLogsViewModel(
  getActivityLogsUseCase: GetActivityLogsUseCase
): ActivityLogsViewModel {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [status, setStatus] = useState<AsyncStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<ActivityActionFilter>("all")
  const [branchFilter, setBranchFilter] = useState<ActivityBranchFilter>("all")
  const [staffFilter, setStaffFilter] = useState<ActivityStaffFilter>("all")
  const [branchOptions, setBranchOptions] = useState<ActivityLogBranchOption[]>([])
  const [staffOptions, setStaffOptions] = useState<ActivityLogStaffOption[]>([])

  const loadLogs = useCallback(async () => {
    setStatus("loading")
    setError(null)

    const result = await getActivityLogsUseCase.execute()

    if (!result.success) {
      setStatus("error")
      setError(result.error)
      return
    }

    setLogs(result.data.logs)
    setBranchOptions(result.data.branchOptions)
    setStaffOptions(result.data.staffOptions)
    setStatus("success")
  }, [getActivityLogsUseCase])

  useEffect(() => {
    void loadLogs()
  }, [loadLogs])

  const filteredLogs = useMemo(
    () =>
      filterLogs(logs, searchQuery, actionFilter, branchFilter, staffFilter),
    [logs, searchQuery, actionFilter, branchFilter, staffFilter]
  )

  const state: ActivityLogsViewModelState = {
    logs,
    status,
    error,
    searchQuery,
    actionFilter,
    branchFilter,
    staffFilter,
    branchOptions,
    staffOptions,
    filteredLogs,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "success",
  }

  return {
    state,
    setSearchQuery,
    setActionFilter,
    setBranchFilter,
    setStaffFilter,
    reload: loadLogs,
  }
}

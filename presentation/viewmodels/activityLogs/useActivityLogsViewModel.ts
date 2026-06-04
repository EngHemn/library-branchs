"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type {
  ActivityLog,
  ActivityLogAction,
  ActivityLogBranchOption,
  ActivityLogStaffOption,
} from "@/domain/entities/activity-log/ActivityLog"
import type { GetActivityLogsUseCase } from "@/domain/usecases/activityLogs/GetActivityLogsUseCase"
import type { ActivityActionFilter, ActivityBranchFilter, ActivityLogsViewModelState, ActivityStaffFilter, AsyncStatus } from "./ActivityLogsViewModelState"

export type ActivityLogsViewModel = {
  state: ActivityLogsViewModelState
  setSearchQuery: (value: string) => void
  setActionFilter: (value: ActivityActionFilter) => void
  setBranchFilter: (value: ActivityBranchFilter) => void
  setStaffFilter: (value: ActivityStaffFilter) => void
  reload: () => Promise<void>
}

type ActivityLogsQueryData = {
  logs: ActivityLog[]
  branchOptions: ActivityLogBranchOption[]
  staffOptions: ActivityLogStaffOption[]
}

function matchesSearch(log: ActivityLog, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true
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
  return searchableValues.some((value) => value.toLowerCase().includes(normalizedQuery))
}

function filterLogs(
  logs: ActivityLog[],
  searchQuery: string,
  actionFilter: ActivityActionFilter,
  branchFilter: ActivityBranchFilter,
  staffFilter: ActivityStaffFilter
): ActivityLog[] {
  return logs.filter((log) => {
    if (actionFilter !== "all" && log.action !== actionFilter) return false
    if (branchFilter !== "all" && log.branchId !== branchFilter) return false
    if (staffFilter !== "all" && log.staffId !== staffFilter) return false
    return matchesSearch(log, searchQuery)
  })
}

export function useActivityLogsViewModel(
  getActivityLogsUseCase: GetActivityLogsUseCase
): ActivityLogsViewModel {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<ActivityActionFilter>("all")
  const [branchFilter, setBranchFilter] = useState<ActivityBranchFilter>("all")
  const [staffFilter, setStaffFilter] = useState<ActivityStaffFilter>("all")

  const { data, isPending, isFetching, isError, error, refetch } =
    useQuery<ActivityLogsQueryData>({
      queryKey: ["activityLogs"],
      queryFn: async () => {
        const result = await getActivityLogsUseCase.execute()
        if (!result.success) throw new Error(result.error)
        return {
          logs: result.data.logs,
          branchOptions: result.data.branchOptions,
          staffOptions: result.data.staffOptions,
        }
      },
    })

  const status: AsyncStatus = (() => {
    if (isPending || isFetching) return "loading"
    if (isError) return "error"
    if (data !== undefined) return "success"
    return "idle"
  })()

  const logs = data?.logs ?? []
  const branchOptions = data?.branchOptions ?? []
  const staffOptions = data?.staffOptions ?? []

  const filteredLogs = filterLogs(logs, searchQuery, actionFilter, branchFilter, staffFilter)

  async function reload(): Promise<void> {
    await refetch()
  }

  const state: ActivityLogsViewModelState = {
    logs,
    status,
    error: isError && error instanceof Error ? error.message : null,
    searchQuery,
    actionFilter,
    branchFilter,
    staffFilter,
    branchOptions,
    staffOptions,
    filteredLogs,
    isLoading: isPending || isFetching,
    isReady: status === "success",
  }

  return { state, setSearchQuery, setActionFilter, setBranchFilter, setStaffFilter, reload }
}

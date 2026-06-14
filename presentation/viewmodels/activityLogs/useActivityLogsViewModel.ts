"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { fakeBranches } from "@/data/fake/fakeBranches"
import type {
  ActivityLog,
  ActivityLogAction,
  ActivityLogBranchOption,
  ActivityLogStaffOption,
} from "@/domain/entities/activity-log/ActivityLog"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetActivityLogsUseCase } from "@/domain/usecases/activityLogs/GetActivityLogsUseCase"
import {
  getDashboardBranchScope,
  resolveUserBranchId,
  type DashboardBranchScope,
} from "@/lib/dashboardBranchScope"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  ActivityActionFilter,
  ActivityBranchFilter,
  ActivityBranchFilterOption,
  ActivityLogsViewModelState,
  ActivityStaffFilter,
  AsyncStatus,
} from "./ActivityLogsViewModelState"

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

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

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

function resolveBranchFilterId(
  branchFilter: ActivityBranchFilter,
  userBranchId: string
): string {
  return branchFilter === "current" ? userBranchId : branchFilter
}

function getBranchFilterOptions(
  user: User,
  t: (key: TranslationKey) => string
): ActivityBranchFilterOption[] {
  if (user.branchType === "sub") {
    return []
  }

  const userBranchId = resolveUserBranchId(user)
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)

  const otherBranches = branchScope.branches
    .filter((branch) => branch.id !== userBranchId)
    .map((branch) => ({ value: branch.id, label: branch.name }))
    .sort((left, right) => left.label.localeCompare(right.label))

  return [
    { value: "all", label: t("activityLogs.filters.allBranches") },
    { value: "current", label: t("activityLogs.filters.currentBranch") },
    ...otherBranches,
  ]
}

function isBranchSelectionValid(
  branchFilter: ActivityBranchFilter,
  scope: DashboardBranchScope,
  userBranchId: string
): boolean {
  if (branchFilter === "all") {
    return scope.allowAllBranches
  }

  if (branchFilter === "current") {
    return scope.branchIds.includes(userBranchId)
  }

  return scope.branchIds.includes(branchFilter)
}

function filterLogs(
  logs: ActivityLog[],
  searchQuery: string,
  actionFilter: ActivityActionFilter,
  branchFilter: ActivityBranchFilter,
  staffFilter: ActivityStaffFilter,
  scopedBranchIds: string[],
  isSubBranch: boolean,
  userBranchId: string
): ActivityLog[] {
  return logs.filter((log) => {
    if (!scopedBranchIds.includes(log.branchId)) {
      return false
    }

    if (actionFilter !== "all" && log.action !== actionFilter) {
      return false
    }

    if (isSubBranch) {
      if (log.branchId !== userBranchId) {
        return false
      }
    } else if (branchFilter !== "all") {
      const effectiveBranchId = resolveBranchFilterId(branchFilter, userBranchId)
      if (log.branchId !== effectiveBranchId) {
        return false
      }
    }

    if (staffFilter !== "all" && log.staffId !== staffFilter) {
      return false
    }

    return matchesSearch(log, searchQuery)
  })
}

export function useActivityLogsViewModel(
  authUseCase: AuthUseCase,
  getActivityLogsUseCase: GetActivityLogsUseCase
): ActivityLogsViewModel {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<ActivityActionFilter>("all")
  const [branchFilter, setBranchFilterState] = useState<ActivityBranchFilter>("current")
  const [staffFilter, setStaffFilter] = useState<ActivityStaffFilter>("all")

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

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
      enabled: userQuery.isSuccess,
    })

  const user = userQuery.data ?? null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const isSubBranch = user?.branchType === "sub"
  const branchScope = user ? getDashboardBranchScope(user, allDashboardBranches) : null
  const scopedBranchIds = branchScope?.branchIds ?? []
  const showBranchFilter = !isSubBranch
  const branchFilterOptions = user ? getBranchFilterOptions(user, t) : []

  useEffect(() => {
    if (!user || !branchScope) return

    if (isSubBranch) {
      setBranchFilterState(userBranchId)
      return
    }

    setBranchFilterState((current) =>
      isBranchSelectionValid(current, branchScope, userBranchId) ? current : "current"
    )
  }, [user, userBranchId, isSubBranch, branchScope?.branchIds.join(",")])

  const status: AsyncStatus = (() => {
    if (userQuery.isPending || isPending || isFetching) return "loading"
    if (userQuery.isError || isError) return "error"
    if (data !== undefined) return "success"
    return "idle"
  })()

  const logs = data?.logs ?? []
  const branchOptions = data?.branchOptions ?? []
  const staffOptions = data?.staffOptions ?? []

  const filteredLogs = user
    ? filterLogs(
        logs,
        searchQuery,
        actionFilter,
        branchFilter,
        staffFilter,
        scopedBranchIds,
        isSubBranch,
        userBranchId
      )
    : []

  async function reload(): Promise<void> {
    await Promise.all([userQuery.refetch(), refetch()])
  }

  function setBranchFilter(value: ActivityBranchFilter): void {
    if (isSubBranch) return
    if (branchScope && !isBranchSelectionValid(value, branchScope, userBranchId)) return
    setBranchFilterState(value)
  }

  const state: ActivityLogsViewModelState = {
    logs,
    status,
    error:
      (userQuery.isError && userQuery.error instanceof Error
        ? userQuery.error.message
        : null) ??
      (isError && error instanceof Error ? error.message : null),
    searchQuery,
    actionFilter,
    branchFilter,
    staffFilter,
    branchOptions,
    branchFilterOptions,
    showBranchFilter,
    staffOptions,
    filteredLogs,
    isLoading: userQuery.isPending || isPending || isFetching,
    isReady: status === "success",
  }

  return {
    state,
    setSearchQuery,
    setActionFilter,
    setBranchFilter,
    setStaffFilter,
    reload,
  }
}

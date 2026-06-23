"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { LowStockAlert } from "@/domain/entities/alert/LowStockAlert"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { LowStockAlertUseCase } from "@/domain/usecases/alerts/LowStockAlertUseCase"
import { fakeBranches } from "@/data/fake/fakeBranches"
import {
  getDashboardBranchScope,
  isBranchScopedDashboardUser,
} from "@/lib/dashboardBranchScope"
import type {
  LowStockAlertBranchFilter,
  LowStockAlertStatusFilter,
} from "@/presentation/components/alerts/LowStockAlertsFilters"

type AsyncStatus = "idle" | "loading" | "success" | "error"

type LowStockAlertsViewModelState = {
  alertsStatus: AsyncStatus
  alertsError: string | null
  summary:
    | import("@/domain/entities/alert/LowStockAlert").LowStockAlertSummary
    | null
  summaryStatus: AsyncStatus
  searchQuery: string
  branchFilter: LowStockAlertBranchFilter
  statusFilter: LowStockAlertStatusFilter
  filteredAlerts: LowStockAlert[]
  branchOptions: Array<{ id: string; name: string }>
  showBranchFilter: boolean
  isLoading: boolean
  isReady: boolean
  isSyncing: boolean
}

type LowStockAlertsViewModel = {
  state: LowStockAlertsViewModelState
  setSearchQuery: (value: string) => void
  setBranchFilter: (value: LowStockAlertBranchFilter) => void
  setStatusFilter: (value: LowStockAlertStatusFilter) => void
  markResolved: (alertId: string) => Promise<boolean>
  restock: (alertId: string, quantity: number) => Promise<boolean>
  syncFromInventory: () => Promise<boolean>
  reload: () => Promise<void>
}

function filterAlerts(
  alerts: LowStockAlert[],
  searchQuery: string,
  branchFilter: LowStockAlertBranchFilter,
  statusFilter: LowStockAlertStatusFilter,
  branchIds: string[],
  isBranchScopedUser: boolean,
  userBranchId: string | null
): LowStockAlert[] {
  return alerts.filter((alert) => {
    if (isBranchScopedUser && userBranchId && alert.branchId !== userBranchId) {
      return false
    }
    if (
      !isBranchScopedUser &&
      branchIds.length > 0 &&
      !branchIds.includes(alert.branchId)
    ) {
      return false
    }
    if (branchFilter !== "all" && alert.branchId !== branchFilter) return false
    if (statusFilter !== "all" && alert.status !== statusFilter) return false

    const query = searchQuery.trim().toLowerCase()
    if (!query) return true

    return (
      alert.bookTitle.toLowerCase().includes(query) ||
      alert.isbn.toLowerCase().includes(query) ||
      alert.branchName.toLowerCase().includes(query)
    )
  })
}

export function useLowStockAlertsViewModel(
  authUseCase: AuthUseCase,
  lowStockAlertUseCase: LowStockAlertUseCase
): LowStockAlertsViewModel {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] =
    useState<LowStockAlertBranchFilter>("all")
  const [statusFilter, setStatusFilter] =
    useState<LowStockAlertStatusFilter>("active")

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const alertsQuery = useQuery({
    queryKey: ["lowStockAlerts"],
    queryFn: async () => {
      await lowStockAlertUseCase.syncFromInventory()
      const result = await lowStockAlertUseCase.getAlerts()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const summaryQuery = useQuery({
    queryKey: ["lowStockAlertSummary"],
    queryFn: async () => {
      const result = await lowStockAlertUseCase.getSummary()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const resolveMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const result = await lowStockAlertUseCase.markResolved(alertId)
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lowStockAlerts"] })
      void queryClient.invalidateQueries({ queryKey: ["lowStockAlertSummary"] })
    },
  })

  const restockMutation = useMutation({
    mutationFn: async ({
      alertId,
      quantity,
    }: {
      alertId: string
      quantity: number
    }) => {
      const result = await lowStockAlertUseCase.restock(alertId, quantity)
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lowStockAlerts"] })
      void queryClient.invalidateQueries({ queryKey: ["lowStockAlertSummary"] })
    },
  })

  const syncMutation = useMutation({
    mutationFn: async () => {
      const result = await lowStockAlertUseCase.syncFromInventory()
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lowStockAlerts"] })
      void queryClient.invalidateQueries({ queryKey: ["lowStockAlertSummary"] })
    },
  })

  const user = userQuery.data ?? null
  const branchScope = user
    ? getDashboardBranchScope(
        user,
        fakeBranches.map((branch) => ({
          id: branch.id,
          name: branch.branchName,
        }))
      )
    : null
  const allAlerts = alertsQuery.data ?? []

  const filteredAlerts = user
    ? filterAlerts(
        allAlerts,
        searchQuery,
        branchFilter,
        statusFilter,
        branchScope?.branchIds ?? [],
        isBranchScopedDashboardUser(user),
        user.branchId ?? null
      )
    : []

  const alertsStatus: AsyncStatus =
    userQuery.isPending || alertsQuery.isPending
      ? "loading"
      : alertsQuery.isSuccess
        ? "success"
        : alertsQuery.isError
          ? "error"
          : "loading"

  return {
    state: {
      alertsStatus,
      alertsError:
        alertsQuery.error?.message ?? userQuery.error?.message ?? null,
      summary: summaryQuery.data ?? null,
      summaryStatus: summaryQuery.isSuccess ? "success" : "loading",
      searchQuery,
      branchFilter,
      statusFilter,
      filteredAlerts,
      branchOptions: branchScope?.branches ?? [],
      showBranchFilter: user ? !isBranchScopedDashboardUser(user) : false,
      isLoading: alertsStatus === "loading",
      isReady: alertsStatus === "success",
      isSyncing: syncMutation.isPending,
    },
    setSearchQuery,
    setBranchFilter,
    setStatusFilter,
    markResolved: async (alertId): Promise<boolean> => {
      try {
        await resolveMutation.mutateAsync(alertId)
        return true
      } catch {
        return false
      }
    },
    restock: async (alertId, quantity): Promise<boolean> => {
      try {
        await restockMutation.mutateAsync({ alertId, quantity })
        return true
      } catch {
        return false
      }
    },
    syncFromInventory: async (): Promise<boolean> => {
      try {
        await syncMutation.mutateAsync()
        return true
      } catch {
        return false
      }
    },
    reload: async () => {
      await Promise.all([alertsQuery.refetch(), summaryQuery.refetch()])
    },
  }
}

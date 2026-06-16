"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { NeedListItem } from "@/domain/entities/need/Need"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { NeedManagementUseCase } from "@/domain/usecases/needs/NeedManagementUseCase"
import { isBranchScopedDashboardUser } from "@/lib/dashboardBranchScope"
import {
  buildScopedNeedSummary,
  filterNeedsByBranchScope,
  getNeedBranchFormOptions,
} from "@/lib/needBranchScope"
import type {
  NeedBranchFilter,
  NeedCategoryFilter,
  NeedPriorityFilter,
  NeedStatusFilter,
} from "@/presentation/components/needs/NeedsFilters"
import type { AsyncStatus, NeedsViewModelState } from "./NeedsViewModelState"

type NeedsViewModel = {
  state: NeedsViewModelState
  setSearchQuery: (value: string) => void
  setCategoryFilter: (value: NeedCategoryFilter) => void
  setBranchFilter: (value: NeedBranchFilter) => void
  setPriorityFilter: (value: NeedPriorityFilter) => void
  setStatusFilter: (value: NeedStatusFilter) => void
  setDateFrom: (value: string | null) => void
  setDateTo: (value: string | null) => void
  openDeleteNeedDialog: (needId: string, needName: string) => void
  closeDeleteNeedDialog: () => void
  openRejectNeedDialog: (needId: string, needName: string) => void
  closeRejectNeedDialog: () => void
  setRejectReason: (value: string) => void
  confirmDeleteNeed: () => Promise<boolean>
  confirmRejectNeed: () => Promise<boolean>
  approveNeed: (needId: string) => Promise<boolean>
  reload: () => Promise<void>
  clearFilters: () => void
}

function matchesSearch(need: NeedListItem, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return (
    need.name.toLowerCase().includes(normalized) ||
    need.requestedBy.toLowerCase().includes(normalized) ||
    need.branchName.toLowerCase().includes(normalized) ||
    need.id.toLowerCase().includes(normalized)
  )
}

function filterNeeds(
  needs: NeedListItem[],
  searchQuery: string,
  categoryFilter: NeedCategoryFilter,
  branchFilter: NeedBranchFilter,
  priorityFilter: NeedPriorityFilter,
  statusFilter: NeedStatusFilter,
  dateFrom: string | null,
  dateTo: string | null
): NeedListItem[] {
  return needs.filter((need) => {
    if (categoryFilter !== "all" && need.category !== categoryFilter) return false
    if (branchFilter !== "all" && need.branchId !== branchFilter) return false
    if (priorityFilter !== "all" && need.priority !== priorityFilter) return false
    if (statusFilter !== "all" && need.status !== statusFilter) return false

    const requestDate = need.requestDate.slice(0, 10)
    if (dateFrom && requestDate < dateFrom) return false
    if (dateTo && requestDate > dateTo) return false

    return matchesSearch(need, searchQuery)
  })
}

export function useNeedsViewModel(
  authUseCase: AuthUseCase,
  needManagementUseCase: NeedManagementUseCase
): NeedsViewModel {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<NeedCategoryFilter>("all")
  const [branchFilter, setBranchFilter] = useState<NeedBranchFilter>("all")
  const [priorityFilter, setPriorityFilter] = useState<NeedPriorityFilter>("all")
  const [statusFilter, setStatusFilter] = useState<NeedStatusFilter>("all")
  const [dateFrom, setDateFrom] = useState<string | null>(null)
  const [dateTo, setDateTo] = useState<string | null>(null)
  const [deleteNeedDialog, setDeleteNeedDialog] = useState<{
    needId: string
    needName: string
  } | null>(null)
  const [rejectNeedDialog, setRejectNeedDialog] = useState<{
    needId: string
    needName: string
  } | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [deleteNeedError, setDeleteNeedError] = useState<string | null>(null)
  const [rejectNeedError, setRejectNeedError] = useState<string | null>(null)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const needsQuery = useQuery({
    queryKey: ["needs"],
    queryFn: async () => {
      const result = await needManagementUseCase.getNeeds()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const deleteMutation = useMutation({
    mutationFn: async (needId: string) => {
      const result = await needManagementUseCase.deleteNeed(needId)
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["needs"] })
      setDeleteNeedDialog(null)
      setDeleteNeedError(null)
    },
    onError: (err: Error) => setDeleteNeedError(err.message),
  })

  const rejectMutation = useMutation({
    mutationFn: async ({
      needId,
      reason,
    }: {
      needId: string
      reason: string
    }) => {
      const user = userQuery.data
      const result = await needManagementUseCase.rejectNeed(
        needId,
        user?.fullName ?? "Staff",
        reason || undefined
      )
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["needs"] })
      setRejectNeedDialog(null)
      setRejectReason("")
      setRejectNeedError(null)
    },
    onError: (err: Error) => setRejectNeedError(err.message),
  })

  const approveMutation = useMutation({
    mutationFn: async (needId: string) => {
      const user = userQuery.data
      const result = await needManagementUseCase.approveNeed(
        needId,
        user?.fullName ?? "Staff"
      )
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["needs"] })
    },
  })

  const user = userQuery.data ?? null
  const allNeeds = needsQuery.data ?? []
  const scopedNeeds =
    user !== null ? filterNeedsByBranchScope(allNeeds, user) : []
  const summary =
    user !== null ? buildScopedNeedSummary(scopedNeeds) : null

  const isBranchScopedUser = user !== null && isBranchScopedDashboardUser(user)

  const needsStatus: AsyncStatus =
    userQuery.isPending || needsQuery.isPending
      ? "loading"
      : needsQuery.isSuccess
        ? "success"
        : needsQuery.isError
          ? "error"
          : "loading"

  const summaryStatus: AsyncStatus =
    userQuery.isSuccess && needsQuery.isSuccess
      ? "success"
      : userQuery.isPending || needsQuery.isPending
        ? "loading"
        : "idle"

  const filteredNeeds = filterNeeds(
    scopedNeeds,
    searchQuery,
    categoryFilter,
    branchFilter,
    priorityFilter,
    statusFilter,
    dateFrom,
    dateTo
  )

  return {
    state: {
      needsStatus,
      needsError:
        needsQuery.error?.message ?? userQuery.error?.message ?? null,
      summary,
      summaryStatus,
      searchQuery,
      categoryFilter,
      branchFilter,
      priorityFilter,
      statusFilter,
      dateFrom,
      dateTo,
      filteredNeeds,
      branchOptions: user ? getNeedBranchFormOptions(user) : [],
      showBranchFilter: !isBranchScopedUser,
      deleteNeedDialog,
      rejectNeedDialog,
      rejectReason,
      deleteNeedError,
      rejectNeedError,
      isDeletingNeed: deleteMutation.isPending,
      isRejectingNeed: rejectMutation.isPending,
      isApprovingNeed: approveMutation.isPending,
      isLoading: needsStatus === "loading",
      isReady: needsStatus === "success",
    },
    setSearchQuery,
    setCategoryFilter,
    setBranchFilter,
    setPriorityFilter,
    setStatusFilter,
    setDateFrom,
    setDateTo,
    openDeleteNeedDialog: (needId, needName) => {
      setDeleteNeedError(null)
      setDeleteNeedDialog({ needId, needName })
    },
    closeDeleteNeedDialog: () => {
      if (deleteMutation.isPending) return
      setDeleteNeedDialog(null)
      setDeleteNeedError(null)
    },
    openRejectNeedDialog: (needId, needName) => {
      setRejectNeedError(null)
      setRejectReason("")
      setRejectNeedDialog({ needId, needName })
    },
    closeRejectNeedDialog: () => {
      if (rejectMutation.isPending) return
      setRejectNeedDialog(null)
      setRejectReason("")
      setRejectNeedError(null)
    },
    setRejectReason,
    confirmDeleteNeed: async (): Promise<boolean> => {
      if (!deleteNeedDialog) return false
      try {
        await deleteMutation.mutateAsync(deleteNeedDialog.needId)
        return true
      } catch {
        return false
      }
    },
    confirmRejectNeed: async (): Promise<boolean> => {
      if (!rejectNeedDialog) return false
      try {
        await rejectMutation.mutateAsync({
          needId: rejectNeedDialog.needId,
          reason: rejectReason,
        })
        return true
      } catch {
        return false
      }
    },
    approveNeed: async (needId): Promise<boolean> => {
      try {
        await approveMutation.mutateAsync(needId)
        return true
      } catch {
        return false
      }
    },
    reload: async () => {
      await Promise.all([userQuery.refetch(), needsQuery.refetch()])
    },
    clearFilters: () => {
      setSearchQuery("")
      setCategoryFilter("all")
      setBranchFilter("all")
      setPriorityFilter("all")
      setStatusFilter("all")
      setDateFrom(null)
      setDateTo(null)
    },
  }
}

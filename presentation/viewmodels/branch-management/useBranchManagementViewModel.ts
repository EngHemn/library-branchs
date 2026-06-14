"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  Branch,
  BranchStats,
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"

import { useLocale } from "@/presentation/i18n/useLocale"
import { translate } from "@/presentation/i18n/messages"
import { useBranchRequestActionsHook } from "./useBranchRequestActionsHook"
import type { ActiveBranchFilter, ActiveBranchFilterId, BranchFilterState, BranchManagementDialog, BranchManagementStatus, BranchManagementViewModelState, BranchStatusFilter, BranchTypeFilter } from "./BranchManagementViewModelState"

type BranchManagementViewModel = {
  state: BranchManagementViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  setSearchQuery: (searchQuery: string) => void
  setTypeFilter: (typeFilter: BranchTypeFilter) => void
  setStatusFilter: (statusFilter: BranchStatusFilter) => void
  resetFilters: () => void
  clearFilter: (filterId: ActiveBranchFilterId) => void
  openBranchView: (branch: Branch) => void
  openBranchEdit: (branch: Branch) => void
  closeDialog: () => void
  deleteBranch: (branchId: string) => Promise<void>
  toggleBranchStatus: (branchId: string) => Promise<void>
  approveMainBranchRequest: (requestId: string, password: string) => Promise<void>
  rejectMainBranchRequest: (requestId: string, message?: string) => Promise<void>
  approveSubBranchRequest: (requestId: string, password: string) => Promise<void>
  rejectSubBranchRequest: (requestId: string, message?: string) => Promise<void>
  replyToMainBranchRequest: (requestId: string, message: string) => Promise<void>
  replyToSubBranchRequest: (requestId: string, message: string) => Promise<void>
  toggleMainRequestNote: (requestId: string) => void
  toggleSubRequestNote: (requestId: string) => void
}

const defaultFilters: BranchFilterState = {
  searchQuery: "",
  typeFilter: "all",
  statusFilter: "all",
}

const emptyStats: BranchStats = {
  totalBranches: 0,
  mainBranches: 0,
  subBranches: 0,
  activeBranches: 0,
  inactiveBranches: 0,
}

function calculateBranchStats(branches: Branch[]): BranchStats {
  return branches.reduce<BranchStats>(
    (stats, branch) => ({
      totalBranches: stats.totalBranches + 1,
      mainBranches: stats.mainBranches + (branch.type === "main" ? 1 : 0),
      subBranches: stats.subBranches + (branch.type === "sub" ? 1 : 0),
      activeBranches: stats.activeBranches + (branch.status === "active" ? 1 : 0),
      inactiveBranches: stats.inactiveBranches + (branch.status === "inactive" ? 1 : 0),
    }),
    emptyStats
  )
}

function matchesBranchSearch(branch: Branch, searchQuery: string): boolean {
  const normalized = searchQuery.trim().toLowerCase()
  if (!normalized) return true
  return [branch.branchName, branch.phone, branch.address, branch.email, branch.adminName].some(
    (v) => v.toLowerCase().includes(normalized)
  )
}

function toggleRequestId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
}

export function useBranchManagementViewModel(
  authUseCase: AuthUseCase,
  branchManagementUseCase: BranchManagementUseCase
): BranchManagementViewModel {
  const queryClient = useQueryClient()
  const { locale } = useLocale()
  const [filters, setFilters] = useState<BranchFilterState>(defaultFilters)
  const [expandedMainRequestIds, setExpandedMainRequestIds] = useState<string[]>([])
  const [expandedSubRequestIds, setExpandedSubRequestIds] = useState<string[]>([])
  const [dialog, setDialog] = useState<BranchManagementDialog>(null)

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userQueryError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const {
    data: branchData,
    isLoading: isBranchLoading,
    isError: isBranchError,
    error: branchQueryError,
    refetch: refetchBranches,
  } = useQuery({
    queryKey: ["branchManagement"],
    queryFn: async () => {
      const [branchesResult, mainRequestsResult, subRequestsResult] = await Promise.all([
        branchManagementUseCase.getBranches(),
        branchManagementUseCase.getMainBranchRequests(),
        branchManagementUseCase.getSubBranchRequests(),
      ])
      if (!branchesResult.success) throw new Error(branchesResult.error)
      if (!mainRequestsResult.success) throw new Error(mainRequestsResult.error)
      if (!subRequestsResult.success) throw new Error(subRequestsResult.error)
      return {
        branches: branchesResult.data,
        mainBranchRequests: mainRequestsResult.data,
        subBranchRequests: subRequestsResult.data,
      }
    },
    enabled: user !== undefined && user !== null,
  })

  const deleteBranchMutation = useMutation({
    mutationFn: async (branchId: string) => {
      const result = await branchManagementUseCase.deleteBranch(branchId)
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["branchManagement"] }),
    onError: (err: Error) =>
      setDialog({
        title: translate(locale, "branches.actionUnavailable"),
        description: err.message,
      }),
  })

  const toggleBranchStatusMutation = useMutation({
    mutationFn: async (branchId: string) => {
      const result = await branchManagementUseCase.toggleBranchStatus(branchId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["branchManagement"] }),
    onError: (err: Error) =>
      setDialog({
        title: translate(locale, "branches.actionUnavailable"),
        description: err.message,
      }),
  })

  const requestActions = useBranchRequestActionsHook({
    branchManagementUseCase,
    userFullName: user?.fullName ?? translate(locale, "branches.actions.workspaceAdmin"),
    setDialog,
    setExpandedMainRequestIds,
    setExpandedSubRequestIds,
  })

  async function reload(): Promise<void> {
    await Promise.all([refetchUser(), refetchBranches()])
  }

  async function logout(): Promise<void> {
    const result = await authUseCase.logout()
    if (!result.success) return
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    queryClient.removeQueries({ queryKey: ["branchManagement"] })
  }

  function setSearchQuery(searchQuery: string): void {
    setFilters((f) => ({ ...f, searchQuery }))
  }

  function setTypeFilter(typeFilter: BranchTypeFilter): void {
    setFilters((f) => ({ ...f, typeFilter }))
  }

  function setStatusFilter(statusFilter: BranchStatusFilter): void {
    setFilters((f) => ({ ...f, statusFilter }))
  }

  function resetFilters(): void {
    setFilters(defaultFilters)
  }

  function clearFilter(filterId: ActiveBranchFilterId): void {
    setFilters((f) => {
      if (filterId === "search") return { ...f, searchQuery: "" }
      if (filterId === "type") return { ...f, typeFilter: "all" }
      return { ...f, statusFilter: "all" }
    })
  }

  function openBranchView(branch: Branch): void {
    setDialog({
      title: branch.branchName,
      description: `${branch.adminName} manages ${branch.staffCount} staff and ${branch.bookCount.toLocaleString()} books at ${branch.address}.`,
    })
  }

  function openBranchEdit(branch: Branch): void {
    setDialog({
      title: `Edit ${branch.branchName}`,
      description:
        "Editing is ready for a future form. This placeholder keeps the current mock-only flow intact.",
    })
  }

  function closeDialog(): void {
    setDialog(null)
  }

  async function deleteBranch(branchId: string): Promise<void> {
    deleteBranchMutation.mutate(branchId)
  }

  async function toggleBranchStatus(branchId: string): Promise<void> {
    toggleBranchStatusMutation.mutate(branchId)
  }

  function toggleMainRequestNote(requestId: string): void {
    setExpandedMainRequestIds((ids) => toggleRequestId(ids, requestId))
  }

  function toggleSubRequestNote(requestId: string): void {
    setExpandedSubRequestIds((ids) => toggleRequestId(ids, requestId))
  }

  const branches = branchData?.branches ?? []
  const mainBranchRequests = branchData?.mainBranchRequests ?? []
  const subBranchRequests = branchData?.subBranchRequests ?? []

  const filteredBranches = branches.filter(
    (branch) =>
      matchesBranchSearch(branch, filters.searchQuery) &&
      (filters.typeFilter === "all" || branch.type === filters.typeFilter) &&
      (filters.statusFilter === "all" || branch.status === filters.statusFilter)
  )

  const stats = calculateBranchStats(branches)

  const activeFilters: ActiveBranchFilter[] = []
  if (filters.searchQuery.trim()) {
    activeFilters.push({ id: "search", label: "search", value: filters.searchQuery.trim() })
  }
  if (filters.typeFilter !== "all") {
    activeFilters.push({ id: "type", label: "type", value: filters.typeFilter })
  }
  if (filters.statusFilter !== "all") {
    activeFilters.push({ id: "status", label: "status", value: filters.statusFilter })
  }

  const isUnauthenticated = !isUserLoading && !isUserError && user === null
  const hasError = isUserError || isBranchError
  const isLoadingState = isUserLoading || (!isUnauthenticated && !isUserError && isBranchLoading)

  const errorMessage: string | null = isUserError
    ? (userQueryError instanceof Error ? userQueryError.message : "Unknown error")
    : isBranchError
    ? (branchQueryError instanceof Error ? branchQueryError.message : "Unknown error")
    : null

  const status: BranchManagementStatus = isLoadingState
    ? "loading"
    : hasError
    ? "error"
    : isUnauthenticated
    ? "unauthenticated"
    : branchData
    ? "success"
    : "idle"

  const state: BranchManagementViewModelState = {
    status,
    user: user ?? null,
    branches,
    filteredBranches,
    mainBranchRequests,
    subBranchRequests,
    filters,
    activeFilters,
    stats,
    expandedMainRequestIds,
    expandedSubRequestIds,
    dialog,
    error: hasError ? errorMessage : null,
    canResetFilters: activeFilters.length > 0,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "success",
    isUnauthenticated,
  }

  return {
    state,
    reload,
    logout,
    setSearchQuery,
    setTypeFilter,
    setStatusFilter,
    resetFilters,
    clearFilter,
    openBranchView,
    openBranchEdit,
    closeDialog,
    deleteBranch,
    toggleBranchStatus,
    ...requestActions,
    toggleMainRequestNote,
    toggleSubRequestNote,
  }
}

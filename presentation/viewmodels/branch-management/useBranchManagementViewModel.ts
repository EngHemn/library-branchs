"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type {
  Branch,
  BranchStats,
  BranchStatus,
  BranchType,
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"

type BranchTypeFilter = "all" | BranchType
type BranchStatusFilter = "all" | BranchStatus
type ActiveBranchFilterId = "search" | "type" | "status"

type BranchFilterState = {
  searchQuery: string
  typeFilter: BranchTypeFilter
  statusFilter: BranchStatusFilter
}

type ActiveBranchFilter = {
  id: ActiveBranchFilterId
  label: string
  value: string
}

type BranchManagementDialog = {
  title: string
  description: string
} | null

type BranchManagementStatus =
  | "idle"
  | "loading"
  | "success"
  | "unauthenticated"
  | "error"

type BranchManagementViewModelState = {
  status: BranchManagementStatus
  user: User | null
  branches: Branch[]
  filteredBranches: Branch[]
  mainBranchRequests: MainBranchRequest[]
  subBranchRequests: SubBranchRequest[]
  filters: BranchFilterState
  activeFilters: ActiveBranchFilter[]
  stats: BranchStats
  expandedMainRequestIds: string[]
  expandedSubRequestIds: string[]
  dialog: BranchManagementDialog
  error: string | null
  canResetFilters: boolean
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
}

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
  approveMainBranchRequest: (requestId: string) => Promise<void>
  rejectMainBranchRequest: (requestId: string) => Promise<void>
  approveSubBranchRequest: (requestId: string) => Promise<void>
  rejectSubBranchRequest: (requestId: string) => Promise<void>
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

const branchTypeLabels: Record<BranchType, string> = {
  main: "Main Branch",
  sub: "Sub Branch",
}

const branchStatusLabels: Record<BranchStatus, string> = {
  active: "Active",
  inactive: "Inactive",
}

function calculateBranchStats(branches: Branch[]): BranchStats {
  return branches.reduce<BranchStats>(
    (stats, branch) => ({
      totalBranches: stats.totalBranches + 1,
      mainBranches: stats.mainBranches + (branch.type === "main" ? 1 : 0),
      subBranches: stats.subBranches + (branch.type === "sub" ? 1 : 0),
      activeBranches:
        stats.activeBranches + (branch.status === "active" ? 1 : 0),
      inactiveBranches:
        stats.inactiveBranches + (branch.status === "inactive" ? 1 : 0),
    }),
    emptyStats
  )
}

function matchesBranchSearch(branch: Branch, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return [
    branch.branchName,
    branch.phone,
    branch.address,
    branch.email,
    branch.adminName,
  ].some((value) => value.toLowerCase().includes(normalizedQuery))
}

function toggleRequestId(requestIds: string[], requestId: string): string[] {
  if (requestIds.includes(requestId)) {
    return requestIds.filter((item) => item !== requestId)
  }

  return [...requestIds, requestId]
}

export function useBranchManagementViewModel(
  authUseCase: AuthUseCase,
  branchManagementUseCase: BranchManagementUseCase
): BranchManagementViewModel {
  const [status, setStatus] = useState<BranchManagementStatus>("idle")
  const [user, setUser] = useState<User | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [mainBranchRequests, setMainBranchRequests] = useState<
    MainBranchRequest[]
  >([])
  const [subBranchRequests, setSubBranchRequests] = useState<
    SubBranchRequest[]
  >([])
  const [filters, setFilters] = useState<BranchFilterState>(defaultFilters)
  const [expandedMainRequestIds, setExpandedMainRequestIds] = useState<
    string[]
  >([])
  const [expandedSubRequestIds, setExpandedSubRequestIds] = useState<string[]>(
    []
  )
  const [dialog, setDialog] = useState<BranchManagementDialog>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async (): Promise<void> => {
    setStatus("loading")
    setError(null)

    const currentUserResult = await authUseCase.getCurrentUser()

    if (!currentUserResult.success) {
      setStatus("error")
      setUser(null)
      setError(currentUserResult.error)
      return
    }

    if (!currentUserResult.data) {
      setStatus("unauthenticated")
      setUser(null)
      return
    }

    const [branchesResult, mainRequestsResult, subRequestsResult] =
      await Promise.all([
        branchManagementUseCase.getBranches(),
        branchManagementUseCase.getMainBranchRequests(),
        branchManagementUseCase.getSubBranchRequests(),
      ])

    if (!branchesResult.success) {
      setStatus("error")
      setError(branchesResult.error)
      return
    }

    if (!mainRequestsResult.success) {
      setStatus("error")
      setError(mainRequestsResult.error)
      return
    }

    if (!subRequestsResult.success) {
      setStatus("error")
      setError(subRequestsResult.error)
      return
    }

    setUser(currentUserResult.data)
    setBranches(branchesResult.data)
    setMainBranchRequests(mainRequestsResult.data)
    setSubBranchRequests(subRequestsResult.data)
    setStatus("success")
  }, [authUseCase, branchManagementUseCase])

  const logout = useCallback(async (): Promise<void> => {
    setStatus("loading")

    const result = await authUseCase.logout()

    if (!result.success) {
      setStatus("error")
      setError(result.error)
      return
    }

    setUser(null)
    setStatus("unauthenticated")
  }, [authUseCase])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reload()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [reload])

  const setSearchQuery = useCallback((searchQuery: string): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      searchQuery,
    }))
  }, [])

  const setTypeFilter = useCallback((typeFilter: BranchTypeFilter): void => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      typeFilter,
    }))
  }, [])

  const setStatusFilter = useCallback(
    (statusFilter: BranchStatusFilter): void => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        statusFilter,
      }))
    },
    []
  )

  const resetFilters = useCallback((): void => {
    setFilters(defaultFilters)
  }, [])

  const clearFilter = useCallback((filterId: ActiveBranchFilterId): void => {
    setFilters((currentFilters) => {
      if (filterId === "search") {
        return {
          ...currentFilters,
          searchQuery: "",
        }
      }

      if (filterId === "type") {
        return {
          ...currentFilters,
          typeFilter: "all",
        }
      }

      return {
        ...currentFilters,
        statusFilter: "all",
      }
    })
  }, [])

  const openBranchView = useCallback((branch: Branch): void => {
    setDialog({
      title: branch.branchName,
      description: `${branch.adminName} manages ${branch.staffCount} staff and ${branch.bookCount.toLocaleString()} books at ${branch.address}.`,
    })
  }, [])

  const openBranchEdit = useCallback((branch: Branch): void => {
    setDialog({
      title: `Edit ${branch.branchName}`,
      description:
        "Editing is ready for a future form. This placeholder keeps the current mock-only flow intact.",
    })
  }, [])

  const closeDialog = useCallback((): void => {
    setDialog(null)
  }, [])

  const deleteBranch = useCallback(
    async (branchId: string): Promise<void> => {
      const result = await branchManagementUseCase.deleteBranch(branchId)

      if (!result.success) {
        setDialog({
          title: "Branch action unavailable",
          description: result.error,
        })
        return
      }

      setBranches((currentBranches) =>
        currentBranches.filter((branch) => branch.id !== branchId)
      )
    },
    [branchManagementUseCase]
  )

  const toggleBranchStatus = useCallback(
    async (branchId: string): Promise<void> => {
      const result = await branchManagementUseCase.toggleBranchStatus(branchId)

      if (!result.success) {
        setDialog({
          title: "Branch action unavailable",
          description: result.error,
        })
        return
      }

      setBranches((currentBranches) =>
        currentBranches.map((branch) =>
          branch.id === result.data.id ? result.data : branch
        )
      )
    },
    [branchManagementUseCase]
  )

  const approveMainBranchRequest = useCallback(
    async (requestId: string): Promise<void> => {
      const result =
        await branchManagementUseCase.approveMainBranchRequest(requestId)

      if (!result.success) {
        setDialog({
          title: "Request action unavailable",
          description: result.error,
        })
        return
      }

      setMainBranchRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== requestId)
      )
      setExpandedMainRequestIds((currentIds) =>
        currentIds.filter((id) => id !== requestId)
      )
      setDialog({
        title: "Main branch request approved",
        description: "The request was approved in the mock workspace state.",
      })
    },
    [branchManagementUseCase]
  )

  const rejectMainBranchRequest = useCallback(
    async (requestId: string): Promise<void> => {
      const result =
        await branchManagementUseCase.rejectMainBranchRequest(requestId)

      if (!result.success) {
        setDialog({
          title: "Request action unavailable",
          description: result.error,
        })
        return
      }

      setMainBranchRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== requestId)
      )
      setExpandedMainRequestIds((currentIds) =>
        currentIds.filter((id) => id !== requestId)
      )
      setDialog({
        title: "Main branch request rejected",
        description: "The request was removed from the mock request queue.",
      })
    },
    [branchManagementUseCase]
  )

  const approveSubBranchRequest = useCallback(
    async (requestId: string): Promise<void> => {
      const result =
        await branchManagementUseCase.approveSubBranchRequest(requestId)

      if (!result.success) {
        setDialog({
          title: "Request action unavailable",
          description: result.error,
        })
        return
      }

      setSubBranchRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== requestId)
      )
      setExpandedSubRequestIds((currentIds) =>
        currentIds.filter((id) => id !== requestId)
      )
      setDialog({
        title: "Sub branch request approved",
        description: "The request was approved in the mock workspace state.",
      })
    },
    [branchManagementUseCase]
  )

  const rejectSubBranchRequest = useCallback(
    async (requestId: string): Promise<void> => {
      const result =
        await branchManagementUseCase.rejectSubBranchRequest(requestId)

      if (!result.success) {
        setDialog({
          title: "Request action unavailable",
          description: result.error,
        })
        return
      }

      setSubBranchRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== requestId)
      )
      setExpandedSubRequestIds((currentIds) =>
        currentIds.filter((id) => id !== requestId)
      )
      setDialog({
        title: "Sub branch request rejected",
        description: "The request was removed from the mock request queue.",
      })
    },
    [branchManagementUseCase]
  )

  const toggleMainRequestNote = useCallback((requestId: string): void => {
    setExpandedMainRequestIds((currentIds) =>
      toggleRequestId(currentIds, requestId)
    )
  }, [])

  const toggleSubRequestNote = useCallback((requestId: string): void => {
    setExpandedSubRequestIds((currentIds) =>
      toggleRequestId(currentIds, requestId)
    )
  }, [])

  const filteredBranches = useMemo(
    () =>
      branches.filter(
        (branch) =>
          matchesBranchSearch(branch, filters.searchQuery) &&
          (filters.typeFilter === "all" ||
            branch.type === filters.typeFilter) &&
          (filters.statusFilter === "all" ||
            branch.status === filters.statusFilter)
      ),
    [branches, filters.searchQuery, filters.statusFilter, filters.typeFilter]
  )

  const stats = useMemo(() => calculateBranchStats(branches), [branches])

  const activeFilters = useMemo<ActiveBranchFilter[]>(() => {
    const activeItems: ActiveBranchFilter[] = []

    if (filters.searchQuery.trim()) {
      activeItems.push({
        id: "search",
        label: "Search",
        value: filters.searchQuery.trim(),
      })
    }

    if (filters.typeFilter !== "all") {
      activeItems.push({
        id: "type",
        label: "Type",
        value: branchTypeLabels[filters.typeFilter],
      })
    }

    if (filters.statusFilter !== "all") {
      activeItems.push({
        id: "status",
        label: "Status",
        value: branchStatusLabels[filters.statusFilter],
      })
    }

    return activeItems
  }, [filters.searchQuery, filters.statusFilter, filters.typeFilter])

  const state = useMemo<BranchManagementViewModelState>(
    () => ({
      status,
      user,
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
      error: status === "error" ? error : null,
      canResetFilters: activeFilters.length > 0,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "success",
      isUnauthenticated: status === "unauthenticated",
    }),
    [
      activeFilters,
      branches,
      dialog,
      error,
      expandedMainRequestIds,
      expandedSubRequestIds,
      filteredBranches,
      filters,
      mainBranchRequests,
      stats,
      status,
      subBranchRequests,
      user,
    ]
  )

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
    approveMainBranchRequest,
    rejectMainBranchRequest,
    approveSubBranchRequest,
    rejectSubBranchRequest,
    toggleMainRequestNote,
    toggleSubRequestNote,
  }
}

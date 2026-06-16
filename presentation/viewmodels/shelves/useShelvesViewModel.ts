"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Shelf } from "@/domain/entities/shelf/Shelf"
import type { ShelfType } from "@/domain/entities/shelf/ShelfType"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import {
  buildScopedShelfSummary,
  filterShelvesByBranchScope,
  getDefaultShelfBranchId,
  getShelfBranchFormOptions,
  getShelfDashboardBranchScope,
} from "@/lib/shelfBranchScope"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"
import type { ShelfBranchFilter } from "@/presentation/components/shelves/ShelvesFilters"
import type { AsyncStatus, ShelvesViewModelState } from "./ShelvesViewModelState"

type ShelvesViewModel = {
  state: ShelvesViewModelState
  setSearchQuery: (value: string) => void
  setBranchFilter: (value: ShelfBranchFilter) => void
  setShelfTypeFilter: (value: "all" | ShelfType) => void
  setStatusFilter: (value: "all" | "active" | "inactive") => void
  openDeleteShelfDialog: (shelfId: string, shelfName: string) => void
  closeDeleteShelfDialog: () => void
  confirmDeleteShelf: () => Promise<void>
  reload: () => Promise<void>
}

function matchesSearch(shelf: Shelf, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return (
    shelf.name.toLowerCase().includes(normalized) ||
    shelf.branchName.toLowerCase().includes(normalized) ||
    formatShelfLocationParts(shelf.locationParts)
      .toLowerCase()
      .includes(normalized) ||
    shelf.id.toLowerCase().includes(normalized)
  )
}

function filterShelves(
  shelves: Shelf[],
  searchQuery: string,
  branchFilter: ShelfBranchFilter,
  shelfTypeFilter: "all" | ShelfType,
  statusFilter: "all" | "active" | "inactive"
): Shelf[] {
  return shelves.filter((shelf) => {
    if (branchFilter !== "all" && shelf.branchId !== branchFilter) return false
    if (shelfTypeFilter !== "all" && shelf.shelfType !== shelfTypeFilter) {
      return false
    }
    if (statusFilter !== "all" && shelf.status !== statusFilter) return false
    return matchesSearch(shelf, searchQuery)
  })
}

export function useShelvesViewModel(
  authUseCase: AuthUseCase,
  shelfManagementUseCase: ShelfManagementUseCase
): ShelvesViewModel {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState<ShelfBranchFilter>("all")
  const [shelfTypeFilter, setShelfTypeFilter] = useState<"all" | ShelfType>(
    "all"
  )
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all")
  const [deleteShelfDialog, setDeleteShelfDialog] = useState<{
    shelfId: string
    shelfName: string
  } | null>(null)
  const [deleteShelfError, setDeleteShelfError] = useState<string | null>(null)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const shelvesQuery = useQuery({
    queryKey: ["shelves"],
    queryFn: async () => {
      const result = await shelfManagementUseCase.getShelves()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const deleteMutation = useMutation({
    mutationFn: async (shelfId: string) => {
      const result = await shelfManagementUseCase.deleteShelf(shelfId)
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["shelves"] })
      setDeleteShelfDialog(null)
      setDeleteShelfError(null)
    },
    onError: (err: Error) => setDeleteShelfError(err.message),
  })

  const user = userQuery.data
  const [hasInitializedBranch, setHasInitializedBranch] = useState(false)

  useEffect(() => {
    if (user && !hasInitializedBranch) {
      setBranchFilter(getDefaultShelfBranchId(user))
      setHasInitializedBranch(true)
    }
  }, [user, hasInitializedBranch])

  const allShelves = shelvesQuery.data ?? []
  const scopedShelves = user
    ? filterShelvesByBranchScope(allShelves, user)
    : []
  const filteredShelves = filterShelves(
    scopedShelves,
    searchQuery,
    branchFilter,
    shelfTypeFilter,
    statusFilter
  )
  const summary = buildScopedShelfSummary(scopedShelves)

  const branchScope = user ? getShelfDashboardBranchScope(user) : null
  const branchOptions = user ? getShelfBranchFormOptions(user) : []
  const showBranchFilter = branchScope?.showBranchFilter ?? false
  const showBranchColumn = showBranchFilter && branchFilter === "all"

  const shelvesStatus: AsyncStatus = shelvesQuery.isSuccess
    ? "success"
    : shelvesQuery.isError
      ? "error"
      : userQuery.isLoading || shelvesQuery.isLoading
        ? "loading"
        : "idle"

  function openDeleteShelfDialog(shelfId: string, shelfName: string): void {
    setDeleteShelfError(null)
    setDeleteShelfDialog({ shelfId, shelfName })
  }

  function closeDeleteShelfDialog(): void {
    setDeleteShelfDialog(null)
    setDeleteShelfError(null)
  }

  async function confirmDeleteShelf(): Promise<void> {
    if (!deleteShelfDialog) return
    setDeleteShelfError(null)
    try {
      await deleteMutation.mutateAsync(deleteShelfDialog.shelfId)
    } catch {
      // handled in onError
    }
  }

  async function reload(): Promise<void> {
    await Promise.all([userQuery.refetch(), shelvesQuery.refetch()])
  }

  const state: ShelvesViewModelState = {
    isLoading: userQuery.isLoading || shelvesQuery.isLoading,
    shelvesStatus,
    summaryStatus: shelvesStatus,
    shelvesError: shelvesQuery.error?.message ?? null,
    summary,
    shelves: scopedShelves,
    filteredShelves,
    searchQuery,
    branchFilter,
    shelfTypeFilter,
    statusFilter,
    branchOptions,
    showBranchFilter,
    showBranchColumn,
    isDeleting: deleteMutation.isPending,
    deleteShelfDialog,
    deleteShelfError,
  }

  return {
    state,
    setSearchQuery,
    setBranchFilter,
    setShelfTypeFilter,
    setStatusFilter,
    openDeleteShelfDialog,
    closeDeleteShelfDialog,
    confirmDeleteShelf,
    reload,
  }
}

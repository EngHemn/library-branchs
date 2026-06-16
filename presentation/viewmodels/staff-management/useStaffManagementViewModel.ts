"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fakeBranches } from "@/data/fake/fakeBranches"
import type {
  StaffMember,
  StaffRole,
  StaffStats,
  StaffStatus,
} from "@/domain/entities/staff/StaffMember"
import type { User } from "@/domain/entities/User"
import { isBranchScopedStaffPermissionsUser } from "@/domain/services/staffPermissionsScope"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { resolveUserBranchId, getDashboardBranchScope } from "@/lib/dashboardBranchScope"
import type { StaffBranchFilter, StaffBranchFilterOption, StaffFilterState, StaffManagementDialog, StaffManagementPageStatus, StaffManagementViewModelState, StaffRoleFilter, StaffStatusFilter } from "./StaffManagementViewModelState"
import { useStaffDeleteDialog } from "./useStaffDeleteDialog"

type StaffManagementViewModel = {
  state: StaffManagementViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  setSearchQuery: (searchQuery: string) => void
  setRoleFilter: (roleFilter: StaffRoleFilter) => void
  setBranchFilter: (branchFilter: StaffBranchFilter) => void
  setStatusFilter: (statusFilter: StaffStatusFilter) => void
  closeDialog: () => void
  openDeleteStaffDialog: (staffId: string, staffName: string) => void
  closeDeleteStaffDialog: () => void
  confirmDeleteStaff: () => Promise<void>
  toggleStaffStatus: (staffId: string) => Promise<void>
}

const defaultFilters: StaffFilterState = {
  searchQuery: "",
  roleFilter: "all",
  branchFilter: "current",
  statusFilter: "all",
}

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

const emptyStats: StaffStats = {
  totalStaff: 0,
  activeStaff: 0,
  inactiveStaff: 0,
  branchAdmins: 0,
  subBranchAdmins: 0,
  staffMembers: 0,
}

function calculateStaffStats(staff: StaffMember[]): StaffStats {
  return staff.reduce<StaffStats>(
    (stats, member) => ({
      totalStaff: stats.totalStaff + 1,
      activeStaff: stats.activeStaff + (member.status === "active" ? 1 : 0),
      inactiveStaff:
        stats.inactiveStaff + (member.status === "inactive" ? 1 : 0),
      branchAdmins:
        stats.branchAdmins + (member.role === "branch_admin" ? 1 : 0),
      subBranchAdmins:
        stats.subBranchAdmins + (member.role === "sub_branch_admin" ? 1 : 0),
      staffMembers: stats.staffMembers + (member.role === "staff" ? 1 : 0),
    }),
    emptyStats
  )
}

function matchesStaffSearch(member: StaffMember, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  if (!normalizedQuery) return true
  return [member.staffName, member.email].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  )
}

function resolveStaffBranchFilterId(
  branchFilter: StaffBranchFilter,
  userBranchId: string
): string | null {
  if (branchFilter === "all") return null
  if (branchFilter === "current") return userBranchId
  return branchFilter
}

function matchesStaffBranchFilter(
  member: StaffMember,
  branchFilter: StaffBranchFilter,
  userBranchId: string
): boolean {
  const effectiveBranchId = resolveStaffBranchFilterId(
    branchFilter,
    userBranchId
  )
  if (effectiveBranchId === null) return true
  return member.branchId === effectiveBranchId
}

function getStaffBranchFilterOptions(user: User): StaffBranchFilterOption[] {
  const userBranchId = resolveUserBranchId(user)
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)
  const currentBranch = branchScope.branches.find(
    (branch) => branch.id === userBranchId
  )

  const otherBranches = branchScope.branches
    .filter((branch) => branch.id !== userBranchId)
    .map((branch) => ({ value: branch.id, label: branch.name }))
    .sort((left, right) => left.label.localeCompare(right.label))

  return [
    { value: "all", label: "all" },
    {
      value: "current",
      label: currentBranch?.name ?? "Current branch",
    },
    ...otherBranches,
  ]
}

export function useStaffManagementViewModel(
  authUseCase: AuthUseCase,
  staffManagementUseCase: StaffManagementUseCase
): StaffManagementViewModel {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<StaffFilterState>(defaultFilters)
  const [dialog, setDialog] = useState<StaffManagementDialog>(null)
  const [error, setError] = useState<string | null>(null)
  const deleteDialog = useStaffDeleteDialog({ staffManagementUseCase })

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const staffQuery = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const result = await staffManagementUseCase.getStaff()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: !!userQuery.data,
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const result = await authUseCase.logout()
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      void queryClient.invalidateQueries({ queryKey: ["staff"] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const toggleStatusMutation = useMutation({
    mutationFn: async (staffId: string) => {
      const result = await staffManagementUseCase.toggleStaffStatus(staffId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
    onError: (err: Error) =>
      setDialog({ title: "Staff action unavailable", description: err.message }),
  })

  async function reload(): Promise<void> {
    await Promise.all([userQuery.refetch(), staffQuery.refetch()])
  }

  async function logout(): Promise<void> {
    await logoutMutation.mutateAsync().catch(() => undefined)
  }

  function setSearchQuery(searchQuery: string): void {
    setFilters((f) => ({ ...f, searchQuery }))
  }

  function setRoleFilter(roleFilter: StaffRoleFilter): void {
    setFilters((f) => ({ ...f, roleFilter }))
  }

  function setBranchFilter(branchFilter: StaffBranchFilter): void {
    setFilters((f) => ({ ...f, branchFilter }))
  }

  function setStatusFilter(statusFilter: StaffStatusFilter): void {
    setFilters((f) => ({ ...f, statusFilter }))
  }

  function closeDialog(): void {
    setDialog(null)
  }

  async function toggleStaffStatus(staffId: string): Promise<void> {
    await toggleStatusMutation.mutateAsync(staffId).catch(() => undefined)
  }

  const staff = staffQuery.data ?? []
  const user = userQuery.data ?? null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const isUnauthenticated = userQuery.isSuccess && userQuery.data === null
  const isLoading =
    userQuery.isPending || (!!userQuery.data && staffQuery.isPending)
  const isReady =
    userQuery.isSuccess &&
    !!user &&
    staffQuery.isSuccess

  let status: StaffManagementPageStatus
  if (isLoading) {
    status = "loading"
  } else if (userQuery.isError || staffQuery.isError) {
    status = "error"
  } else if (isUnauthenticated) {
    status = "unauthenticated"
  } else if (isReady) {
    status = "success"
  } else {
    status = "idle"
  }

  const scopedStaff =
    user && isBranchScopedStaffPermissionsUser(user)
      ? staff.filter((member) => member.branchId === resolveUserBranchId(user))
      : staff

  const showBranchFilter = user ? !isBranchScopedStaffPermissionsUser(user) : true
  const showBranchColumn =
    showBranchFilter && filters.branchFilter === "all"
  const showBranchAdminRole = user ? !isBranchScopedStaffPermissionsUser(user) : true
  const branchFilterOptions = user ? getStaffBranchFilterOptions(user) : []

  const filteredStaff = scopedStaff.filter(
    (member) =>
      matchesStaffSearch(member, filters.searchQuery) &&
      (filters.roleFilter === "all" || member.role === filters.roleFilter) &&
      (showBranchFilter
        ? matchesStaffBranchFilter(member, filters.branchFilter, userBranchId)
        : true) &&
      (filters.statusFilter === "all" || member.status === filters.statusFilter)
  )

  const queryError =
    userQuery.error?.message ?? staffQuery.error?.message ?? null

  const state: StaffManagementViewModelState = {
    status,
    user,
    staff,
    filteredStaff,
    branchFilterOptions,
    filters,
    stats: calculateStaffStats(scopedStaff),
    dialog,
    deleteStaffDialog: deleteDialog.deleteStaffDialog,
    deleteStaffError: deleteDialog.deleteStaffError,
    isDeletingStaff: deleteDialog.isDeletingStaff,
    showBranchFilter,
    showBranchColumn,
    showBranchAdminRole,
    error: status === "error" ? (queryError ?? error) : null,
    isLoading,
    isReady,
    isUnauthenticated,
  }

  return {
    state,
    reload,
    logout,
    setSearchQuery,
    setRoleFilter,
    setBranchFilter,
    setStatusFilter,
    closeDialog,
    openDeleteStaffDialog: deleteDialog.openDeleteStaffDialog,
    closeDeleteStaffDialog: deleteDialog.closeDeleteStaffDialog,
    confirmDeleteStaff: deleteDialog.confirmDeleteStaff,
    toggleStaffStatus,
  }
}

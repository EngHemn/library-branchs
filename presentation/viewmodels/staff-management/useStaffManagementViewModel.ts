"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type {
  StaffMember,
  StaffRole,
  StaffStats,
  StaffStatus,
} from "@/domain/entities/staff/StaffMember"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"

type StaffRoleFilter = "all" | StaffRole
type StaffStatusFilter = "all" | StaffStatus
type StaffBranchFilter = "all" | string

type StaffFilterState = {
  searchQuery: string
  roleFilter: StaffRoleFilter
  branchFilter: StaffBranchFilter
  statusFilter: StaffStatusFilter
}

type StaffManagementDialog = {
  title: string
  description: string
} | null

type StaffManagementPageStatus =
  | "idle"
  | "loading"
  | "success"
  | "unauthenticated"
  | "error"

type StaffManagementViewModelState = {
  status: StaffManagementPageStatus
  user: User | null
  staff: StaffMember[]
  filteredStaff: StaffMember[]
  branches: string[]
  filters: StaffFilterState
  stats: StaffStats
  dialog: StaffManagementDialog
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
}

type StaffManagementViewModel = {
  state: StaffManagementViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  setSearchQuery: (searchQuery: string) => void
  setRoleFilter: (roleFilter: StaffRoleFilter) => void
  setBranchFilter: (branchFilter: StaffBranchFilter) => void
  setStatusFilter: (statusFilter: StaffStatusFilter) => void
  closeDialog: () => void
  deleteStaff: (staffId: string) => Promise<void>
  toggleStaffStatus: (staffId: string) => Promise<void>
}

const defaultFilters: StaffFilterState = {
  searchQuery: "",
  roleFilter: "all",
  branchFilter: "all",
  statusFilter: "all",
}

const emptyStats: StaffStats = {
  totalStaff: 0,
  activeStaff: 0,
  inactiveStaff: 0,
  managers: 0,
  librarians: 0,
}

function calculateStaffStats(staff: StaffMember[]): StaffStats {
  return staff.reduce<StaffStats>(
    (stats, member) => ({
      totalStaff: stats.totalStaff + 1,
      activeStaff: stats.activeStaff + (member.status === "active" ? 1 : 0),
      inactiveStaff:
        stats.inactiveStaff + (member.status === "inactive" ? 1 : 0),
      managers: stats.managers + (member.role === "manager" ? 1 : 0),
      librarians: stats.librarians + (member.role === "librarian" ? 1 : 0),
    }),
    emptyStats
  )
}

function matchesStaffSearch(member: StaffMember, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return [member.staffName, member.email].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  )
}

function getUniqueBranches(staff: StaffMember[]): string[] {
  const branchSet = new Set(staff.map((member) => member.branch))
  return Array.from(branchSet).sort()
}

export function useStaffManagementViewModel(
  authUseCase: AuthUseCase,
  staffManagementUseCase: StaffManagementUseCase
): StaffManagementViewModel {
  const [status, setStatus] = useState<StaffManagementPageStatus>("idle")
  const [user, setUser] = useState<User | null>(null)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [filters, setFilters] = useState<StaffFilterState>(defaultFilters)
  const [dialog, setDialog] = useState<StaffManagementDialog>(null)
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

    const staffResult = await staffManagementUseCase.getStaff()

    if (!staffResult.success) {
      setStatus("error")
      setError(staffResult.error)
      return
    }

    setUser(currentUserResult.data)
    setStaff(staffResult.data)
    setStatus("success")
  }, [authUseCase, staffManagementUseCase])

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
    setFilters((current) => ({ ...current, searchQuery }))
  }, [])

  const setRoleFilter = useCallback((roleFilter: StaffRoleFilter): void => {
    setFilters((current) => ({ ...current, roleFilter }))
  }, [])

  const setBranchFilter = useCallback(
    (branchFilter: StaffBranchFilter): void => {
      setFilters((current) => ({ ...current, branchFilter }))
    },
    []
  )

  const setStatusFilter = useCallback(
    (statusFilter: StaffStatusFilter): void => {
      setFilters((current) => ({ ...current, statusFilter }))
    },
    []
  )

  const closeDialog = useCallback((): void => {
    setDialog(null)
  }, [])

  const deleteStaff = useCallback(
    async (staffId: string): Promise<void> => {
      const result = await staffManagementUseCase.deleteStaff(staffId)

      if (!result.success) {
        setDialog({
          title: "Staff action unavailable",
          description: result.error,
        })
        return
      }

      setStaff((current) =>
        current.filter((member) => member.id !== staffId)
      )
    },
    [staffManagementUseCase]
  )

  const toggleStaffStatus = useCallback(
    async (staffId: string): Promise<void> => {
      const result = await staffManagementUseCase.toggleStaffStatus(staffId)

      if (!result.success) {
        setDialog({
          title: "Staff action unavailable",
          description: result.error,
        })
        return
      }

      setStaff((current) =>
        current.map((member) =>
          member.id === result.data.id ? result.data : member
        )
      )
    },
    [staffManagementUseCase]
  )

  const branches = useMemo(() => getUniqueBranches(staff), [staff])

  const filteredStaff = useMemo(
    () =>
      staff.filter(
        (member) =>
          matchesStaffSearch(member, filters.searchQuery) &&
          (filters.roleFilter === "all" ||
            member.role === filters.roleFilter) &&
          (filters.branchFilter === "all" ||
            member.branch === filters.branchFilter) &&
          (filters.statusFilter === "all" ||
            member.status === filters.statusFilter)
      ),
    [staff, filters]
  )

  const stats = useMemo(() => calculateStaffStats(staff), [staff])

  const state = useMemo<StaffManagementViewModelState>(
    () => ({
      status,
      user,
      staff,
      filteredStaff,
      branches,
      filters,
      stats,
      dialog,
      error: status === "error" ? error : null,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "success",
      isUnauthenticated: status === "unauthenticated",
    }),
    [branches, dialog, error, filteredStaff, filters, staff, stats, status, user]
  )

  return {
    state,
    reload,
    logout,
    setSearchQuery,
    setRoleFilter,
    setBranchFilter,
    setStatusFilter,
    closeDialog,
    deleteStaff,
    toggleStaffStatus,
  }
}

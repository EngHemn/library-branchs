"use client"

import { useEffect, useMemo, useState } from "react"

import type { Member, MemberStatus } from "@/domain/entities/member/Member"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"

export type MemberStatusFilter = "all" | MemberStatus
export type MemberBranchFilter = "all" | string

export type MemberFilterState = {
  searchQuery: string
  statusFilter: MemberStatusFilter
  branchRegisteredFilter: MemberBranchFilter
  branchUsedFilter: MemberBranchFilter
  startDate: string
  endDate: string
}

export type MemberActiveFilterId =
  | "search"
  | "status"
  | "branchRegistered"
  | "branchUsed"
  | "registrationDate"

export type MemberActiveFilter = {
  id: MemberActiveFilterId
  label: string
  value: string
}

type MembersPageStatus = "idle" | "loading" | "ready" | "error"

type MembersViewModelState = {
  status: MembersPageStatus
  members: Member[]
  filteredMembers: Member[]
  registeredBranches: string[]
  usedBranches: string[]
  appliedFilters: MemberFilterState
  activeFilters: MemberActiveFilter[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isDeleting: boolean
}

type MembersViewModel = {
  state: MembersViewModelState
  setSearchQuery: (searchQuery: string) => void
  applyFilters: (filters: MemberFilterState) => void
  clearFilter: (filterId: MemberActiveFilterId) => void
  resetFilters: () => void
  deleteMember: (memberId: string) => Promise<void>
  reload: () => Promise<void>
}

const defaultFilters: MemberFilterState = {
  searchQuery: "",
  statusFilter: "all",
  branchRegisteredFilter: "all",
  branchUsedFilter: "all",
  startDate: "",
  endDate: "",
}

const memberStatusLabels: Record<MemberStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
}

function matchesMemberSearch(member: Member, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return [member.memberName, member.email, member.phone].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  )
}

function matchesRegistrationDateRange(
  registrationDate: string,
  startDate: string,
  endDate: string
): boolean {
  if (startDate && registrationDate < startDate) {
    return false
  }

  if (endDate && registrationDate > endDate) {
    return false
  }

  return true
}

function getUniqueRegisteredBranches(members: Member[]): string[] {
  const branchSet = new Set(members.map((member) => member.registerBranch))
  return Array.from(branchSet).sort()
}

function getUniqueUsedBranches(members: Member[]): string[] {
  const branchSet = new Set<string>()

  for (const member of members) {
    for (const branch of member.allBranchesUsed) {
      branchSet.add(branch)
    }
  }

  return Array.from(branchSet).sort()
}

function buildActiveFilters(filters: MemberFilterState): MemberActiveFilter[] {
  const activeItems: MemberActiveFilter[] = []

  if (filters.searchQuery.trim()) {
    activeItems.push({
      id: "search",
      label: "Search",
      value: filters.searchQuery.trim(),
    })
  }

  if (filters.statusFilter !== "all") {
    activeItems.push({
      id: "status",
      label: "Status",
      value: memberStatusLabels[filters.statusFilter],
    })
  }

  if (filters.branchRegisteredFilter !== "all") {
    activeItems.push({
      id: "branchRegistered",
      label: "Registered Branch",
      value: filters.branchRegisteredFilter,
    })
  }

  if (filters.branchUsedFilter !== "all") {
    activeItems.push({
      id: "branchUsed",
      label: "Branch Used",
      value: filters.branchUsedFilter,
    })
  }

  if (filters.startDate || filters.endDate) {
    const dateValue =
      filters.startDate && filters.endDate
        ? `${filters.startDate} – ${filters.endDate}`
        : filters.startDate
          ? `From ${filters.startDate}`
          : `Until ${filters.endDate}`

    activeItems.push({
      id: "registrationDate",
      label: "Registration",
      value: dateValue,
    })
  }

  return activeItems
}

function filterMembers(members: Member[], filters: MemberFilterState): Member[] {
  return members.filter(
    (member) =>
      matchesMemberSearch(member, filters.searchQuery) &&
      (filters.statusFilter === "all" ||
        member.status === filters.statusFilter) &&
      (filters.branchRegisteredFilter === "all" ||
        member.registerBranch === filters.branchRegisteredFilter) &&
      (filters.branchUsedFilter === "all" ||
        member.allBranchesUsed.includes(filters.branchUsedFilter)) &&
      matchesRegistrationDateRange(
        member.registrationDate,
        filters.startDate,
        filters.endDate
      )
  )
}

export function useMembersViewModel(
  memberManagementUseCase: MemberManagementUseCase
): MembersViewModel {
  const [status, setStatus] = useState<MembersPageStatus>("idle")
  const [members, setMembers] = useState<Member[]>([])
  const [appliedFilters, setAppliedFilters] =
    useState<MemberFilterState>(defaultFilters)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function loadMembers(): Promise<void> {
    setStatus("loading")
    setError(null)

    const result = await memberManagementUseCase.getMembers()

    if (!result.success) {
      setMembers([])
      setStatus("error")
      setError(result.error)
      return
    }

    setMembers(result.data)
    setStatus("ready")
  }

  useEffect(() => {
    void loadMembers()
  }, [memberManagementUseCase])

  async function deleteMember(memberId: string): Promise<void> {
    setIsDeleting(true)
    setError(null)

    const result = await memberManagementUseCase.deleteMember(memberId)

    if (!result.success) {
      setIsDeleting(false)
      setError(result.error)
      setStatus("error")
      return
    }

    setMembers((current) =>
      current.filter((member) => member.id !== memberId)
    )
    setIsDeleting(false)
  }

  const setSearchQuery = (searchQuery: string): void => {
    setAppliedFilters((current) => ({ ...current, searchQuery }))
  }

  const applyFilters = (filters: MemberFilterState): void => {
    setAppliedFilters(filters)
  }

  const clearFilter = (filterId: MemberActiveFilterId): void => {
    setAppliedFilters((current) => {
      switch (filterId) {
        case "search":
          return { ...current, searchQuery: "" }
        case "status":
          return { ...current, statusFilter: "all" }
        case "branchRegistered":
          return { ...current, branchRegisteredFilter: "all" }
        case "branchUsed":
          return { ...current, branchUsedFilter: "all" }
        case "registrationDate":
          return { ...current, startDate: "", endDate: "" }
        default:
          return current
      }
    })
  }

  const resetFilters = (): void => {
    setAppliedFilters(defaultFilters)
  }

  const registeredBranches = useMemo(
    () => getUniqueRegisteredBranches(members),
    [members]
  )

  const usedBranches = useMemo(() => getUniqueUsedBranches(members), [members])

  const activeFilters = useMemo(
    () => buildActiveFilters(appliedFilters),
    [appliedFilters]
  )

  const filteredMembers = useMemo(
    () => filterMembers(members, appliedFilters),
    [members, appliedFilters]
  )

  const state = useMemo<MembersViewModelState>(
    () => ({
      status,
      members,
      filteredMembers,
      registeredBranches,
      usedBranches,
      appliedFilters,
      activeFilters,
      error: status === "error" ? error : null,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "ready",
      isDeleting,
    }),
    [
      activeFilters,
      appliedFilters,
      error,
      filteredMembers,
      isDeleting,
      members,
      registeredBranches,
      status,
      usedBranches,
    ]
  )

  return {
    state,
    setSearchQuery,
    applyFilters,
    clearFilter,
    resetFilters,
    deleteMember,
    reload: loadMembers,
  }
}

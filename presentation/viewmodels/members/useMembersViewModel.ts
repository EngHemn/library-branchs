"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Member, MemberStatus } from "@/domain/entities/member/Member"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import type { MemberActiveFilter, MemberActiveFilterId, MemberBranchFilter, MemberFilterState, MemberStatusFilter, MembersPageStatus, MembersViewModelState } from "./MembersViewModelState"
export type { MemberStatusFilter } from "./MembersViewModelState"
export type { MemberBranchFilter } from "./MembersViewModelState"
export type { MemberFilterState } from "./MembersViewModelState"
export type { MemberActiveFilterId } from "./MembersViewModelState"
export type { MemberActiveFilter } from "./MembersViewModelState"

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
  const queryClient = useQueryClient()
  const [appliedFilters, setAppliedFilters] =
    useState<MemberFilterState>(defaultFilters)

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const result = await memberManagementUseCase.getMembers()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const { mutateAsync: deleteMemberAsync, isPending: isDeleting } = useMutation({
    mutationFn: async (memberId: string) => {
      const result = await memberManagementUseCase.deleteMember(memberId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  })

  const members = membersQuery.data ?? []
  const filteredMembers = filterMembers(members, appliedFilters)
  const registeredBranches = getUniqueRegisteredBranches(members)
  const usedBranches = getUniqueUsedBranches(members)
  const activeFilters = buildActiveFilters(appliedFilters)

  const status: MembersPageStatus = membersQuery.isPending
    ? "loading"
    : membersQuery.isError
      ? "error"
      : membersQuery.isSuccess
        ? "ready"
        : "idle"

  const queryError = membersQuery.isError
    ? membersQuery.error instanceof Error
      ? membersQuery.error.message
      : String(membersQuery.error)
    : null

  function setSearchQuery(searchQuery: string): void {
    setAppliedFilters((current) => ({ ...current, searchQuery }))
  }

  function applyFilters(filters: MemberFilterState): void {
    setAppliedFilters(filters)
  }

  function clearFilter(filterId: MemberActiveFilterId): void {
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

  function resetFilters(): void {
    setAppliedFilters(defaultFilters)
  }

  async function deleteMember(memberId: string): Promise<void> {
    await deleteMemberAsync(memberId)
  }

  async function reload(): Promise<void> {
    await membersQuery.refetch()
  }

  const state: MembersViewModelState = {
    status,
    members,
    filteredMembers,
    registeredBranches,
    usedBranches,
    appliedFilters,
    activeFilters,
    error: status === "error" ? queryError : null,
    isLoading: membersQuery.isPending,
    isReady: membersQuery.isSuccess,
    isDeleting,
  }

  return {
    state,
    setSearchQuery,
    applyFilters,
    clearFilter,
    resetFilters,
    deleteMember,
    reload,
  }
}

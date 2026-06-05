"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Member } from "@/domain/entities/member/Member"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import type {
  MemberBranchFilter,
  MemberFilterState,
  MemberStatusFilter,
  MembersPageStatus,
  MembersViewModelState,
} from "./MembersViewModelState"

export type { MemberStatusFilter } from "./MembersViewModelState"
export type { MemberBranchFilter } from "./MembersViewModelState"
export type { MemberFilterState } from "./MembersViewModelState"

type MembersViewModel = {
  state: MembersViewModelState
  setSearchQuery: (searchQuery: string) => void
  setStatusFilter: (statusFilter: MemberStatusFilter) => void
  setBranchRegisteredFilter: (branchRegisteredFilter: MemberBranchFilter) => void
  setBranchUsedFilter: (branchUsedFilter: MemberBranchFilter) => void
  deleteMember: (memberId: string) => Promise<void>
  reload: () => Promise<void>
}

const defaultFilters: MemberFilterState = {
  searchQuery: "",
  statusFilter: "all",
  branchRegisteredFilter: "all",
  branchUsedFilter: "all",
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

function filterMembers(
  members: Member[],
  filters: MemberFilterState,
  showRegisterBranchFilter: boolean,
  showBranchUsedFilter: boolean
): Member[] {
  return members.filter(
    (member) =>
      matchesMemberSearch(member, filters.searchQuery) &&
      (filters.statusFilter === "all" ||
        member.status === filters.statusFilter) &&
      (!showRegisterBranchFilter ||
        filters.branchRegisteredFilter === "all" ||
        member.registerBranch === filters.branchRegisteredFilter) &&
      (!showBranchUsedFilter ||
        filters.branchUsedFilter === "all" ||
        member.allBranchesUsed.includes(filters.branchUsedFilter))
  )
}

export function useMembersViewModel(
  authUseCase: AuthUseCase,
  memberManagementUseCase: MemberManagementUseCase
): MembersViewModel {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<MemberFilterState>(defaultFilters)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const result = await memberManagementUseCase.getMembers()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const { mutateAsync: deleteMemberAsync, isPending: isDeleting } = useMutation({
    mutationFn: async (memberId: string) => {
      const result = await memberManagementUseCase.deleteMember(memberId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  })

  const user = userQuery.data ?? null
  const members = membersQuery.data ?? []
  const isSubBranch = user?.branchType === "sub"
  const showRegisterBranchColumn = !isSubBranch
  const showRegisterBranchFilter = !isSubBranch
  const showBranchUsedColumn = !isSubBranch
  const showBranchUsedFilter = !isSubBranch
  const filteredMembers = filterMembers(
    members,
    filters,
    showRegisterBranchFilter,
    showBranchUsedFilter
  )
  const registeredBranches = getUniqueRegisteredBranches(members)
  const usedBranches = getUniqueUsedBranches(members)

  const status: MembersPageStatus =
    userQuery.isPending || membersQuery.isPending
      ? "loading"
      : userQuery.isError || membersQuery.isError
        ? "error"
        : userQuery.isSuccess && membersQuery.isSuccess
          ? "ready"
          : "idle"

  const queryError =
    userQuery.error instanceof Error
      ? userQuery.error.message
      : membersQuery.error instanceof Error
        ? membersQuery.error.message
        : null

  function setSearchQuery(searchQuery: string): void {
    setFilters((current) => ({ ...current, searchQuery }))
  }

  function setStatusFilter(statusFilter: MemberStatusFilter): void {
    setFilters((current) => ({ ...current, statusFilter }))
  }

  function setBranchRegisteredFilter(
    branchRegisteredFilter: MemberBranchFilter
  ): void {
    setFilters((current) => ({ ...current, branchRegisteredFilter }))
  }

  function setBranchUsedFilter(branchUsedFilter: MemberBranchFilter): void {
    setFilters((current) => ({ ...current, branchUsedFilter }))
  }

  async function deleteMember(memberId: string): Promise<void> {
    await deleteMemberAsync(memberId)
  }

  async function reload(): Promise<void> {
    await Promise.all([userQuery.refetch(), membersQuery.refetch()])
  }

  const state: MembersViewModelState = {
    status,
    members,
    filteredMembers,
    registeredBranches,
    usedBranches,
    filters,
    showRegisterBranchColumn,
    showRegisterBranchFilter,
    showBranchUsedColumn,
    showBranchUsedFilter,
    error: status === "error" ? queryError : null,
    isLoading: status === "loading",
    isReady: status === "ready",
    isDeleting,
  }

  return {
    state,
    setSearchQuery,
    setStatusFilter,
    setBranchRegisteredFilter,
    setBranchUsedFilter,
    deleteMember,
    reload,
  }
}

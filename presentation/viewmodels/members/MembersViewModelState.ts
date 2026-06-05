"use client"

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

export type MembersPageStatus = "idle" | "loading" | "ready" | "error"

export type MembersViewModelState = {
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
<<<<<<< HEAD
  showBranchesUsedColumn: boolean
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
}

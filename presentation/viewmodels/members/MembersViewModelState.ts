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
}

export type MembersPageStatus = "idle" | "loading" | "ready" | "error"

export type MembersViewModelState = {
  status: MembersPageStatus
  members: Member[]
  filteredMembers: Member[]
  registeredBranches: string[]
  usedBranches: string[]
  filters: MemberFilterState
  showRegisterBranchColumn: boolean
  showRegisterBranchFilter: boolean
  showBranchUsedColumn: boolean
  showBranchUsedFilter: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isDeleting: boolean
}

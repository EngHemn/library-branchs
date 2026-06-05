"use client"

import type { MemberDetail } from "@/domain/entities/member/MemberDetail"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"

export type ViewMemberStatus = "idle" | "loading" | "loaded" | "not-found" | "error"

export type ViewMemberTabKey =
  | "details"
  | "active-bookings"
  | "late-returns"
  | "borrowing-history"

export type ViewMemberViewModelState = {
  status: ViewMemberStatus
  member: MemberDetail | null
  activeTab: ViewMemberTabKey
  showBranchesUsedSection: boolean
  showBranchColumn: boolean
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

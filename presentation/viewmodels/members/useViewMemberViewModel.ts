"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import type { ViewMemberStatus, ViewMemberTabKey, ViewMemberViewModelState } from "./ViewMemberViewModelState"

type ViewMemberViewModel = {
  state: ViewMemberViewModelState
  setActiveTab: (tab: ViewMemberTabKey) => void
}

export function useViewMemberViewModel(
  memberId: string,
  memberManagementUseCase: MemberManagementUseCase,
  authUseCase: AuthUseCase
): ViewMemberViewModel {
  const [activeTab, setActiveTab] = useState<ViewMemberTabKey>("details")

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const memberQuery = useQuery({
    queryKey: ["member", memberId],
    queryFn: async () => {
      const result = await memberManagementUseCase.getMemberById(memberId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const user = userQuery.data ?? null
  const isSubBranch = user?.branchType === "sub"
  const showBranchColumn = !isSubBranch
  const showBranchesUsed = !isSubBranch

  const isLoading = memberQuery.isPending || userQuery.isPending
  const isError = memberQuery.isError || userQuery.isError

  const status: ViewMemberStatus = isLoading
    ? "loading"
    : isError
      ? "error"
      : memberQuery.isSuccess && !memberQuery.data
        ? "not-found"
        : memberQuery.isSuccess && !!memberQuery.data
          ? "loaded"
          : "idle"

  const error = isError
    ? memberQuery.error instanceof Error
      ? memberQuery.error.message
      : userQuery.error instanceof Error
        ? userQuery.error.message
        : String(memberQuery.error ?? userQuery.error)
    : null

  const state: ViewMemberViewModelState = {
    status,
    member: memberQuery.data ?? null,
    activeTab,
    error,
    isLoading,
    isLoaded: memberQuery.isSuccess && !!memberQuery.data,
    isNotFound: memberQuery.isSuccess && !memberQuery.data,
    isError,
    showBranchColumn,
    showBranchesUsed,
  }

  function handleSetActiveTab(tab: ViewMemberTabKey): void {
    setActiveTab(tab)
  }

  return {
    state,
    setActiveTab: handleSetActiveTab,
  }
}

"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import type {
  ViewMemberStatus,
  ViewMemberTabKey,
  ViewMemberViewModelState,
} from "./ViewMemberViewModelState"

type ViewMemberViewModel = {
  state: ViewMemberViewModelState
  setActiveTab: (tab: ViewMemberTabKey) => void
}

export function useViewMemberViewModel(
  memberId: string,
  authUseCase: AuthUseCase,
  memberManagementUseCase: MemberManagementUseCase
): ViewMemberViewModel {
  const [activeTab, setActiveTab] = useState<ViewMemberTabKey>("details")

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const memberQuery = useQuery({
    queryKey: ["member", memberId],
    queryFn: async () => {
      const result = await memberManagementUseCase.getMemberById(memberId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
    enabled: userQuery.isSuccess,
  })

  const user = userQuery.data ?? null
  const isSubBranch = user?.branchType === "sub"
  const showBranchesUsedSection = !isSubBranch
  const showBranchColumn = !isSubBranch

  const status: ViewMemberStatus =
    userQuery.isPending || memberQuery.isPending
      ? "loading"
      : userQuery.isError || memberQuery.isError
        ? "error"
        : memberQuery.isSuccess && !memberQuery.data
          ? "not-found"
          : memberQuery.isSuccess && !!memberQuery.data
            ? "loaded"
            : "idle"

  const error =
    userQuery.error instanceof Error
      ? userQuery.error.message
      : memberQuery.error instanceof Error
        ? memberQuery.error.message
        : null

  const state: ViewMemberViewModelState = {
    status,
    member: memberQuery.data ?? null,
    activeTab,
    showBranchesUsedSection,
    showBranchColumn,
    error,
    isLoading: status === "loading",
    isLoaded: status === "loaded",
    isNotFound: status === "not-found",
    isError: status === "error",
  }

  function handleSetActiveTab(tab: ViewMemberTabKey): void {
    setActiveTab(tab)
  }

  return {
    state,
    setActiveTab: handleSetActiveTab,
  }
}

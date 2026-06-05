"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

<<<<<<< HEAD
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
=======
import type { MemberDetail } from "@/domain/entities/member/MemberDetail"
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import type { ViewMemberStatus, ViewMemberTabKey, ViewMemberViewModelState } from "./ViewMemberViewModelState"

type ViewMemberViewModel = {
  state: ViewMemberViewModelState
  setActiveTab: (tab: ViewMemberTabKey) => void
}

export function useViewMemberViewModel(
  memberId: string,
<<<<<<< HEAD
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

=======
  memberManagementUseCase: MemberManagementUseCase
): ViewMemberViewModel {
  const [activeTab, setActiveTab] = useState<ViewMemberTabKey>("details")

>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
  const memberQuery = useQuery({
    queryKey: ["member", memberId],
    queryFn: async () => {
      const result = await memberManagementUseCase.getMemberById(memberId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

<<<<<<< HEAD
  const user = userQuery.data ?? null
  const isSubBranch = user?.branchType === "sub"
  const showBranchColumn = !isSubBranch
  const showBranchesUsed = !isSubBranch

  const isLoading = memberQuery.isPending || userQuery.isPending
  const isError = memberQuery.isError || userQuery.isError

  const status: ViewMemberStatus = isLoading
    ? "loading"
    : isError
=======
  const status: ViewMemberStatus = memberQuery.isPending
    ? "loading"
    : memberQuery.isError
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
      ? "error"
      : memberQuery.isSuccess && !memberQuery.data
        ? "not-found"
        : memberQuery.isSuccess && !!memberQuery.data
          ? "loaded"
          : "idle"

<<<<<<< HEAD
  const error = isError
    ? memberQuery.error instanceof Error
      ? memberQuery.error.message
      : userQuery.error instanceof Error
        ? userQuery.error.message
        : String(memberQuery.error ?? userQuery.error)
=======
  const error = memberQuery.isError
    ? memberQuery.error instanceof Error
      ? memberQuery.error.message
      : String(memberQuery.error)
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
    : null

  const state: ViewMemberViewModelState = {
    status,
    member: memberQuery.data ?? null,
    activeTab,
    error,
<<<<<<< HEAD
    isLoading,
    isLoaded: memberQuery.isSuccess && !!memberQuery.data,
    isNotFound: memberQuery.isSuccess && !memberQuery.data,
    isError,
    showBranchColumn,
    showBranchesUsed,
=======
    isLoading: memberQuery.isPending,
    isLoaded: memberQuery.isSuccess && !!memberQuery.data,
    isNotFound: memberQuery.isSuccess && !memberQuery.data,
    isError: memberQuery.isError,
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
  }

  function handleSetActiveTab(tab: ViewMemberTabKey): void {
    setActiveTab(tab)
  }

  return {
    state,
    setActiveTab: handleSetActiveTab,
  }
}

"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { MemberDetail } from "@/domain/entities/member/MemberDetail"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import type { ViewMemberStatus, ViewMemberTabKey, ViewMemberViewModelState } from "./ViewMemberViewModelState"

type ViewMemberViewModel = {
  state: ViewMemberViewModelState
  setActiveTab: (tab: ViewMemberTabKey) => void
}

export function useViewMemberViewModel(
  memberId: string,
  memberManagementUseCase: MemberManagementUseCase
): ViewMemberViewModel {
  const [activeTab, setActiveTab] = useState<ViewMemberTabKey>("details")

  const memberQuery = useQuery({
    queryKey: ["member", memberId],
    queryFn: async () => {
      const result = await memberManagementUseCase.getMemberById(memberId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const status: ViewMemberStatus = memberQuery.isPending
    ? "loading"
    : memberQuery.isError
      ? "error"
      : memberQuery.isSuccess && !memberQuery.data
        ? "not-found"
        : memberQuery.isSuccess && !!memberQuery.data
          ? "loaded"
          : "idle"

  const error = memberQuery.isError
    ? memberQuery.error instanceof Error
      ? memberQuery.error.message
      : String(memberQuery.error)
    : null

  const state: ViewMemberViewModelState = {
    status,
    member: memberQuery.data ?? null,
    activeTab,
    error,
    isLoading: memberQuery.isPending,
    isLoaded: memberQuery.isSuccess && !!memberQuery.data,
    isNotFound: memberQuery.isSuccess && !memberQuery.data,
    isError: memberQuery.isError,
  }

  function handleSetActiveTab(tab: ViewMemberTabKey): void {
    setActiveTab(tab)
  }

  return {
    state,
    setActiveTab: handleSetActiveTab,
  }
}

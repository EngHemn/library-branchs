"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { MemberDetail } from "@/domain/entities/member/MemberDetail"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"

type ViewMemberStatus = "idle" | "loading" | "loaded" | "not-found" | "error"

type ViewMemberTabKey =
  | "details"
  | "active-bookings"
  | "late-returns"
  | "borrowing-history"

type ViewMemberViewModelState = {
  status: ViewMemberStatus
  member: MemberDetail | null
  activeTab: ViewMemberTabKey
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

type ViewMemberViewModel = {
  state: ViewMemberViewModelState
  setActiveTab: (tab: ViewMemberTabKey) => void
}

export function useViewMemberViewModel(
  memberId: string,
  memberManagementUseCase: MemberManagementUseCase
): ViewMemberViewModel {
  const [status, setStatus] = useState<ViewMemberStatus>("idle")
  const [member, setMember] = useState<MemberDetail | null>(null)
  const [activeTab, setActiveTab] = useState<ViewMemberTabKey>("details")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadMemberDetail(): Promise<void> {
      setStatus("loading")
      setError(null)

      const result = await memberManagementUseCase.getMemberById(memberId)

      if (cancelled) return

      if (!result.success) {
        setStatus("error")
        setError(result.error)
        return
      }

      if (!result.data) {
        setStatus("not-found")
        return
      }

      setMember(result.data)
      setStatus("loaded")
    }

    void loadMemberDetail()

    return () => {
      cancelled = true
    }
  }, [memberId, memberManagementUseCase])

  const handleSetActiveTab = useCallback((tab: ViewMemberTabKey): void => {
    setActiveTab(tab)
  }, [])

  const state = useMemo<ViewMemberViewModelState>(
    () => ({
      status,
      member,
      activeTab,
      error,
      isLoading: status === "idle" || status === "loading",
      isLoaded: status === "loaded",
      isNotFound: status === "not-found",
      isError: status === "error",
    }),
    [activeTab, error, member, status]
  )

  return {
    state,
    setActiveTab: handleSetActiveTab,
  }
}

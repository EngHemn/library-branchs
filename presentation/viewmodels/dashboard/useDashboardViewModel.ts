"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { DashboardSummary } from "@/domain/entities/dashboard/DashboardSummary"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetDashboardSummaryUseCase } from "@/domain/usecases/dashboard/GetDashboardSummaryUseCase"

type DashboardAsyncState =
  | {
      status: "idle" | "loading"
      user: null
      summary: null
      error: null
    }
  | {
      status: "success"
      user: User
      summary: DashboardSummary
      error: null
    }
  | {
      status: "unauthenticated"
      user: null
      summary: null
      error: null
    }
  | {
      status: "error"
      user: null
      summary: null
      error: string
    }

type DashboardViewModelState = {
  status: DashboardAsyncState["status"]
  user: User | null
  summary: DashboardSummary | null
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
}

type DashboardViewModel = {
  state: DashboardViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
}

const idleState: DashboardAsyncState = {
  status: "idle",
  user: null,
  summary: null,
  error: null,
}

export function useDashboardViewModel(
  authUseCase: AuthUseCase,
  getDashboardSummaryUseCase: GetDashboardSummaryUseCase
): DashboardViewModel {
  const [asyncState, setAsyncState] = useState<DashboardAsyncState>(idleState)

  const reload = useCallback(async (): Promise<void> => {
    setAsyncState({
      status: "loading",
      user: null,
      summary: null,
      error: null,
    })

    const currentUserResult = await authUseCase.getCurrentUser()

    if (!currentUserResult.success) {
      setAsyncState({
        status: "error",
        user: null,
        summary: null,
        error: currentUserResult.error,
      })
      return
    }

    if (!currentUserResult.data) {
      setAsyncState({
        status: "unauthenticated",
        user: null,
        summary: null,
        error: null,
      })
      return
    }

    const summaryResult = await getDashboardSummaryUseCase.getSummary()

    if (!summaryResult.success) {
      setAsyncState({
        status: "error",
        user: null,
        summary: null,
        error: summaryResult.error,
      })
      return
    }

    setAsyncState({
      status: "success",
      user: currentUserResult.data,
      summary: summaryResult.data,
      error: null,
    })
  }, [authUseCase, getDashboardSummaryUseCase])

  const logout = useCallback(async (): Promise<void> => {
    setAsyncState({
      status: "loading",
      user: null,
      summary: null,
      error: null,
    })

    const result = await authUseCase.logout()

    if (!result.success) {
      setAsyncState({
        status: "error",
        user: null,
        summary: null,
        error: result.error,
      })
      return
    }

    setAsyncState({
      status: "unauthenticated",
      user: null,
      summary: null,
      error: null,
    })
  }, [authUseCase])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reload()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [reload])

  const state = useMemo<DashboardViewModelState>(
    () => ({
      status: asyncState.status,
      user: asyncState.status === "success" ? asyncState.user : null,
      summary: asyncState.status === "success" ? asyncState.summary : null,
      error: asyncState.status === "error" ? asyncState.error : null,
      isLoading:
        asyncState.status === "idle" || asyncState.status === "loading",
      isReady: asyncState.status === "success",
      isUnauthenticated: asyncState.status === "unauthenticated",
    }),
    [asyncState]
  )

  return {
    state,
    reload,
    logout,
  }
}

"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { NeedManagementUseCase } from "@/domain/usecases/needs/NeedManagementUseCase"
import type {
  NeedDetailStatus,
  NeedDetailViewModelState,
} from "./NeedDetailViewModelState"

type NeedDetailViewModel = {
  state: NeedDetailViewModelState
  openRejectDialog: () => void
  closeRejectDialog: () => void
  setRejectReason: (value: string) => void
  approveNeed: () => Promise<boolean>
  confirmRejectNeed: () => Promise<boolean>
  reload: () => Promise<void>
}

export function useNeedDetailViewModel(
  needId: string,
  authUseCase: AuthUseCase,
  needManagementUseCase: NeedManagementUseCase
): NeedDetailViewModel {
  const queryClient = useQueryClient()
  const [rejectNeedDialog, setRejectNeedDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectError, setRejectError] = useState<string | null>(null)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const needQuery = useQuery({
    queryKey: ["need", needId],
    queryFn: async () => {
      const result = await needManagementUseCase.getNeedById(needId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const approveMutation = useMutation({
    mutationFn: async () => {
      const user = userQuery.data
      const result = await needManagementUseCase.approveNeed(
        needId,
        user?.fullName ?? "Staff"
      )
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["need", needId] })
      void queryClient.invalidateQueries({ queryKey: ["needs"] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async (reason: string) => {
      const user = userQuery.data
      const result = await needManagementUseCase.rejectNeed(
        needId,
        user?.fullName ?? "Staff",
        reason || undefined
      )
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["need", needId] })
      void queryClient.invalidateQueries({ queryKey: ["needs"] })
      setRejectNeedDialog(false)
      setRejectReason("")
      setRejectError(null)
    },
    onError: (err: Error) => setRejectError(err.message),
  })

  const status: NeedDetailStatus = needQuery.isPending
    ? "loading"
    : needQuery.isError
      ? "error"
      : needQuery.data === null
        ? "not_found"
        : needQuery.isSuccess
          ? "success"
          : "idle"

  return {
    state: {
      status,
      error: needQuery.error?.message ?? userQuery.error?.message ?? null,
      need: needQuery.data ?? null,
      isLoading: status === "loading",
      isReady: status === "success",
      isApproving: approveMutation.isPending,
      isRejecting: rejectMutation.isPending,
      rejectNeedDialog,
      rejectReason,
      rejectError,
    },
    openRejectDialog: () => {
      setRejectError(null)
      setRejectNeedDialog(true)
    },
    closeRejectDialog: () => {
      if (rejectMutation.isPending) return
      setRejectNeedDialog(false)
      setRejectReason("")
      setRejectError(null)
    },
    setRejectReason,
    approveNeed: async (): Promise<boolean> => {
      try {
        await approveMutation.mutateAsync()
        return true
      } catch {
        return false
      }
    },
    confirmRejectNeed: async (): Promise<boolean> => {
      try {
        await rejectMutation.mutateAsync(rejectReason)
        return true
      } catch {
        return false
      }
    },
    reload: async () => {
      await needQuery.refetch()
    },
  }
}

"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"

type BranchManagementDialog = { title: string; description: string } | null

type BranchRequestActionsParams = {
  branchManagementUseCase: BranchManagementUseCase
  userFullName: string
  setDialog: (dialog: BranchManagementDialog) => void
  setExpandedMainRequestIds: (updater: (prev: string[]) => string[]) => void
  setExpandedSubRequestIds: (updater: (prev: string[]) => string[]) => void
}

type BranchRequestActions = {
  approveMainBranchRequest: (requestId: string, password: string) => Promise<void>
  rejectMainBranchRequest: (requestId: string, message?: string) => Promise<void>
  approveSubBranchRequest: (requestId: string, password: string) => Promise<void>
  rejectSubBranchRequest: (requestId: string, message?: string) => Promise<void>
  replyToMainBranchRequest: (requestId: string, message: string) => Promise<void>
  replyToSubBranchRequest: (requestId: string, message: string) => Promise<void>
}

export function useBranchRequestActionsHook({
  branchManagementUseCase,
  userFullName,
  setDialog,
  setExpandedMainRequestIds,
  setExpandedSubRequestIds,
}: BranchRequestActionsParams): BranchRequestActions {
  const queryClient = useQueryClient()

  const approveMainMutation = useMutation({
    mutationFn: async (vars: { requestId: string; password: string }) => {
      const result = await branchManagementUseCase.approveMainBranchRequest(
        vars.requestId,
        { password: vars.password }
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (branch) => {
      void queryClient.invalidateQueries({ queryKey: ["branchManagement"] })
      setDialog({
        title: "Main branch request approved",
        description: `${branch.branchName} was created and removed from the pending queue.`,
      })
    },
    onError: (err: Error) =>
      setDialog({ title: "Request action unavailable", description: err.message }),
  })

  const rejectMainMutation = useMutation({
    mutationFn: async (vars: { requestId: string; message?: string }) => {
      const result = await branchManagementUseCase.rejectMainBranchRequest(
        vars.requestId,
        vars.message?.trim()
          ? { message: vars.message.trim(), sentBy: userFullName }
          : undefined
      )
      if (!result.success) throw new Error(result.error)
      return vars.message
    },
    onSuccess: (message) => {
      void queryClient.invalidateQueries({ queryKey: ["branchManagement"] })
      setDialog({
        title: "Main branch request rejected",
        description: message?.trim()
          ? "The request was rejected and your message was sent to the requester."
          : "The request was removed from the mock request queue.",
      })
    },
    onError: (err: Error) =>
      setDialog({ title: "Request action unavailable", description: err.message }),
  })

  const approveSubMutation = useMutation({
    mutationFn: async (vars: { requestId: string; password: string }) => {
      const result = await branchManagementUseCase.approveSubBranchRequest(
        vars.requestId,
        { password: vars.password }
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (branch) => {
      void queryClient.invalidateQueries({ queryKey: ["branchManagement"] })
      setDialog({
        title: "Sub branch request approved",
        description: `${branch.branchName} was created and removed from the pending queue.`,
      })
    },
    onError: (err: Error) =>
      setDialog({ title: "Request action unavailable", description: err.message }),
  })

  const rejectSubMutation = useMutation({
    mutationFn: async (vars: { requestId: string; message?: string }) => {
      const result = await branchManagementUseCase.rejectSubBranchRequest(
        vars.requestId,
        vars.message?.trim()
          ? { message: vars.message.trim(), sentBy: userFullName }
          : undefined
      )
      if (!result.success) throw new Error(result.error)
      return vars.message
    },
    onSuccess: (message) => {
      void queryClient.invalidateQueries({ queryKey: ["branchManagement"] })
      setDialog({
        title: "Sub branch request rejected",
        description: message?.trim()
          ? "The request was rejected and your message was sent to the requester."
          : "The request was removed from the mock request queue.",
      })
    },
    onError: (err: Error) =>
      setDialog({ title: "Request action unavailable", description: err.message }),
  })

  const replyToMainMutation = useMutation({
    mutationFn: async (vars: { requestId: string; message: string }) => {
      const result = await branchManagementUseCase.replyToMainBranchRequest(
        vars.requestId,
        { message: vars.message, sentBy: userFullName }
      )
      if (!result.success) throw new Error(result.error)
      return vars.requestId
    },
    onSuccess: (requestId) => {
      void queryClient.invalidateQueries({ queryKey: ["branchManagement"] })
      setExpandedMainRequestIds((prev) =>
        prev.includes(requestId) ? prev : [...prev, requestId]
      )
      setDialog({
        title: "Reply sent",
        description: "Your message was added to the request thread.",
      })
    },
    onError: (err: Error) =>
      setDialog({ title: "Reply could not be sent", description: err.message }),
  })

  const replyToSubMutation = useMutation({
    mutationFn: async (vars: { requestId: string; message: string }) => {
      const result = await branchManagementUseCase.replyToSubBranchRequest(
        vars.requestId,
        { message: vars.message, sentBy: userFullName }
      )
      if (!result.success) throw new Error(result.error)
      return vars.requestId
    },
    onSuccess: (requestId) => {
      void queryClient.invalidateQueries({ queryKey: ["branchManagement"] })
      setExpandedSubRequestIds((prev) =>
        prev.includes(requestId) ? prev : [...prev, requestId]
      )
      setDialog({
        title: "Reply sent",
        description: "Your message was added to the request thread.",
      })
    },
    onError: (err: Error) =>
      setDialog({ title: "Reply could not be sent", description: err.message }),
  })

  async function approveMainBranchRequest(requestId: string, password: string): Promise<void> {
    approveMainMutation.mutate({ requestId, password })
  }

  async function rejectMainBranchRequest(requestId: string, message?: string): Promise<void> {
    rejectMainMutation.mutate({ requestId, message })
  }

  async function approveSubBranchRequest(requestId: string, password: string): Promise<void> {
    approveSubMutation.mutate({ requestId, password })
  }

  async function rejectSubBranchRequest(requestId: string, message?: string): Promise<void> {
    rejectSubMutation.mutate({ requestId, message })
  }

  async function replyToMainBranchRequest(requestId: string, message: string): Promise<void> {
    replyToMainMutation.mutate({ requestId, message })
  }

  async function replyToSubBranchRequest(requestId: string, message: string): Promise<void> {
    replyToSubMutation.mutate({ requestId, message })
  }

  return {
    approveMainBranchRequest,
    rejectMainBranchRequest,
    approveSubBranchRequest,
    rejectSubBranchRequest,
    replyToMainBranchRequest,
    replyToSubBranchRequest,
  }
}

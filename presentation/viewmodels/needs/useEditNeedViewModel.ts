"use client"

import { useEffect, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  needFormSchema,
  type NeedFormValues,
} from "@/domain/schemas/needFormSchema"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { NeedManagementUseCase } from "@/domain/usecases/needs/NeedManagementUseCase"
import { isBranchScopedDashboardUser } from "@/lib/dashboardBranchScope"
import { getNeedBranchFormOptions } from "@/lib/needBranchScope"
import type {
  EditNeedStatus,
  EditNeedViewModelState,
} from "./EditNeedViewModelState"

type EditNeedViewModel = {
  state: EditNeedViewModelState
  form: ReturnType<typeof useForm<NeedFormValues>>
  save: (values: NeedFormValues) => Promise<void>
}

export function useEditNeedViewModel(
  needId: string,
  authUseCase: AuthUseCase,
  needManagementUseCase: NeedManagementUseCase
): EditNeedViewModel {
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<NeedFormValues>({
    resolver: zodResolver(needFormSchema) as Resolver<NeedFormValues>,
    defaultValues: {
      name: "",
      category: "laptop",
      description: "",
      quantity: 1,
      priority: "medium",
      branchId: "",
      requestedBy: "",
      notes: "",
      attachmentUrl: null,
    },
  })

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

  const optionsQuery = useQuery({
    queryKey: ["needFormOptions"],
    queryFn: async () => {
      const [branchResult, requesterResult] = await Promise.all([
        needManagementUseCase.getBranchOptions(),
        needManagementUseCase.getRequestedByOptions(),
      ])
      if (!branchResult.success) throw new Error(branchResult.error)
      if (!requesterResult.success) throw new Error(requesterResult.error)
      return {
        branches: branchResult.data,
        requesters: requesterResult.data,
      }
    },
    enabled: userQuery.isSuccess,
  })

  useEffect(() => {
    const need = needQuery.data
    if (!need) return

    form.reset({
      name: need.name,
      category: need.category,
      description: need.description,
      quantity: need.quantity,
      priority: need.priority,
      branchId: need.branchId,
      requestedBy: need.requestedBy,
      notes: need.notes,
      attachmentUrl: need.attachments[0]?.url ?? null,
    })
  }, [needQuery.data, form])

  const user = userQuery.data ?? null
  const branchOptions = user ? getNeedBranchFormOptions(user) : []
  const requestedByOptions = optionsQuery.data?.requesters ?? []

  const updateMutation = useMutation({
    mutationFn: async (values: NeedFormValues) => {
      const need = needQuery.data
      if (!need) throw new Error("Need not found")
      const requester = requestedByOptions.find(
        (option) => option.name === values.requestedBy
      )
      const result = await needManagementUseCase.updateNeed({
        ...values,
        id: needId,
        requestedById: requester?.id ?? need.requestedById,
        submitAs: need.status === "draft" ? "draft" : "pending",
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["needs"] })
      void queryClient.invalidateQueries({ queryKey: ["need", needId] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const isLoading =
    userQuery.isPending || needQuery.isPending || optionsQuery.isPending
  const isReady =
    userQuery.isSuccess && needQuery.isSuccess && optionsQuery.isSuccess

  const status: EditNeedStatus = updateMutation.isSuccess
    ? "saved"
    : updateMutation.isPending
      ? "saving"
      : isLoading
        ? "loading"
        : isReady
          ? "ready"
          : error
            ? "error"
            : "idle"

  return {
    state: {
      status,
      error:
        error ??
        needQuery.error?.message ??
        userQuery.error?.message ??
        null,
      isLoading,
      isReady,
      isSaving: updateMutation.isPending,
      isSaved: updateMutation.isSuccess,
      branchOptions,
      requestedByOptions,
      showBranchField: user ? !isBranchScopedDashboardUser(user) : true,
    },
    form,
    save: async (values) => {
      setError(null)
      await updateMutation.mutateAsync(values)
    },
  }
}

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
import {
  getDefaultNeedBranchId,
  getNeedBranchFormOptions,
} from "@/lib/needBranchScope"
import type {
  CreateNeedStatus,
  CreateNeedViewModelState,
} from "./CreateNeedViewModelState"

type CreateNeedViewModel = {
  state: CreateNeedViewModelState
  form: ReturnType<typeof useForm<NeedFormValues>>
  saveDraft: (values: NeedFormValues) => Promise<void>
  submitRequest: (values: NeedFormValues) => Promise<void>
}

export function useCreateNeedViewModel(
  authUseCase: AuthUseCase,
  needManagementUseCase: NeedManagementUseCase
): CreateNeedViewModel {
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

  const user = userQuery.data ?? null
  const branchOptions = user ? getNeedBranchFormOptions(user) : []
  const requestedByOptions = optionsQuery.data?.requesters ?? []

  useEffect(() => {
    if (!user) return
    const defaultBranch = getDefaultNeedBranchId(user)
    if (!form.getValues("branchId")) {
      form.setValue("branchId", defaultBranch)
    }
    if (!form.getValues("requestedBy")) {
      form.setValue("requestedBy", user.fullName)
    }
  }, [user, form])

  const createMutation = useMutation({
    mutationFn: async ({
      values,
      submitAs,
    }: {
      values: NeedFormValues
      submitAs: "draft" | "pending"
    }) => {
      const requester = requestedByOptions.find(
        (option) => option.name === values.requestedBy
      )
      const result = await needManagementUseCase.createNeed({
        ...values,
        requestedById: requester?.id ?? user?.id ?? "STF-001",
        submitAs,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["needs"] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const isLoading = userQuery.isPending || optionsQuery.isPending
  const isReady = userQuery.isSuccess && optionsQuery.isSuccess

  const status: CreateNeedStatus = createMutation.isSuccess
    ? "saved"
    : createMutation.isPending
      ? "saving"
      : isLoading
        ? "loading"
        : isReady
          ? "ready"
          : error
            ? "error"
            : "idle"

  async function persist(
    values: NeedFormValues,
    submitAs: "draft" | "pending"
  ) {
    setError(null)
    await createMutation.mutateAsync({ values, submitAs })
  }

  return {
    state: {
      status,
      error:
        error ??
        userQuery.error?.message ??
        optionsQuery.error?.message ??
        null,
      isLoading,
      isReady,
      isSaving: createMutation.isPending,
      isSaved: createMutation.isSuccess,
      branchOptions,
      requestedByOptions,
      showBranchField: user ? !isBranchScopedDashboardUser(user) : true,
    },
    form,
    saveDraft: (values) => persist(values, "draft"),
    submitRequest: (values) => persist(values, "pending"),
  }
}

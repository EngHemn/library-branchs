"use client"

import { useEffect, useState } from "react"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  groupFormSchema,
  type GroupFormValues,
} from "@/domain/schemas/groupFormSchema"

import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"

import type { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"

import {
  getDefaultGroupBranchId,
  getGroupBranchFormOptions,
} from "@/lib/groupBranchScope"

import { isBranchScopedDashboardUser } from "@/lib/dashboardBranchScope"

import type {
  CreateGroupStatus,
  CreateGroupViewModelState,
} from "./CreateGroupViewModelState"

type CreateGroupViewModel = {
  state: CreateGroupViewModelState

  form: ReturnType<typeof useForm<GroupFormValues>>

  save: (values: GroupFormValues) => Promise<void>
}

export function useCreateGroupViewModel(
  authUseCase: AuthUseCase,

  groupManagementUseCase: GroupManagementUseCase
): CreateGroupViewModel {
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),

    defaultValues: {
      name: "",

      description: "",

      status: "active",

      imageUrl: null,

      branchId: "",

      bookIds: [],

      staffIds: [],
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

  const bookOptionsQuery = useQuery({
    queryKey: ["group-book-options"],

    queryFn: async () => {
      const result = await groupManagementUseCase.getBookOptions()

      if (!result.success) throw new Error(result.error)

      return result.data
    },

    enabled: userQuery.isSuccess,
  })

  const staffOptionsQuery = useQuery({
    queryKey: ["group-staff-options"],

    queryFn: async () => {
      const result = await groupManagementUseCase.getStaffOptions()

      if (!result.success) throw new Error(result.error)

      return result.data
    },

    enabled: userQuery.isSuccess,
  })

  const createMutation = useMutation({
    mutationFn: async (values: GroupFormValues) => {
      const result = await groupManagementUseCase.createGroup(values)

      if (!result.success) throw new Error(result.error)

      return result.data
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["groups"] })
    },

    onError: (err: Error) => setError(err.message),
  })

  const user = userQuery.data ?? null

  const showBranchField = user ? !isBranchScopedDashboardUser(user) : true

  const defaultBranchId = user ? getDefaultGroupBranchId(user) : ""

  const branchOptions = user ? getGroupBranchFormOptions(user) : []

  useEffect(() => {
    if (!user || form.getValues("branchId")) return

    form.setValue("branchId", defaultBranchId)
  }, [user, defaultBranchId, form])

  const isOptionsLoading =
    userQuery.isPending ||
    bookOptionsQuery.isPending ||
    staffOptionsQuery.isPending

  const status: CreateGroupStatus = createMutation.isSuccess
    ? "saved"
    : createMutation.isPending
      ? "saving"
      : isOptionsLoading
        ? "loading"
        : "ready"

  async function save(values: GroupFormValues): Promise<void> {
    setError(null)

    await createMutation.mutateAsync(values).catch(() => undefined)
  }

  const state: CreateGroupViewModelState = {
    status,

    bookOptions: bookOptionsQuery.data ?? [],

    staffOptions: staffOptionsQuery.data ?? [],

    branchOptions,

    showBranchField,

    error:
      error ??
      userQuery.error?.message ??
      bookOptionsQuery.error?.message ??
      staffOptionsQuery.error?.message ??
      null,

    isLoading: status === "loading",

    isReady: status === "ready",

    isSaving: status === "saving",

    isSaved: status === "saved",
  }

  return { state, form, save }
}

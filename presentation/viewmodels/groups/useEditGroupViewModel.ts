"use client"



import { useEffect, useState } from "react"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"



import type { GroupDetail } from "@/domain/entities/group/Group"

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

import type { EditGroupStatus, EditGroupViewModelState } from "./EditGroupViewModelState"



type EditGroupViewModel = {

  state: EditGroupViewModelState

  form: ReturnType<typeof useForm<GroupFormValues>>

  save: (values: GroupFormValues) => Promise<void>

}



function groupToFormValues(group: GroupDetail): GroupFormValues {

  return {

    name: group.name,

    description: group.description,

    status: group.status,

    imageUrl: group.imageUrl,

    branchId: group.branchId,

    bookIds: group.books.map((book) => book.id),

    staffIds: group.staff.map((member) => member.id),

  }

}



export function useEditGroupViewModel(

  groupId: string,

  authUseCase: AuthUseCase,

  groupManagementUseCase: GroupManagementUseCase

): EditGroupViewModel {

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



  const groupQuery = useQuery({

    queryKey: ["groups", groupId],

    queryFn: async () => {

      const result = await groupManagementUseCase.getGroupById(groupId)

      if (!result.success) throw new Error(result.error)

      return result.data

    },

    enabled: userQuery.isSuccess,

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



  useEffect(() => {

    if (groupQuery.data) {

      form.reset(groupToFormValues(groupQuery.data))

    }

  }, [groupQuery.data, form])



  const user = userQuery.data ?? null

  const showBranchField = user?.branchType !== "sub"

  const defaultBranchId = user ? getDefaultGroupBranchId(user) : ""

  const branchOptions = user ? getGroupBranchFormOptions(user) : []



  useEffect(() => {

    if (!user || user.branchType !== "sub" || form.getValues("branchId")) return

    form.setValue("branchId", defaultBranchId)

  }, [user, defaultBranchId, form])



  const updateMutation = useMutation({

    mutationFn: async (values: GroupFormValues) => {

      const result = await groupManagementUseCase.updateGroup({

        id: groupId,

        ...values,

      })

      if (!result.success) throw new Error(result.error)

      return result.data

    },

    onSuccess: () => {

      void queryClient.invalidateQueries({ queryKey: ["groups"] })

      void queryClient.invalidateQueries({ queryKey: ["groups", groupId] })

    },

    onError: (err: Error) => setError(err.message),

  })



  const isOptionsLoading =

    userQuery.isPending ||

    bookOptionsQuery.isPending ||

    staffOptionsQuery.isPending



  let status: EditGroupStatus

  if (updateMutation.isSuccess) {

    status = "saved"

  } else if (updateMutation.isPending) {

    status = "saving"

  } else if (

    userQuery.isError ||

    groupQuery.isError ||

    bookOptionsQuery.isError ||

    staffOptionsQuery.isError

  ) {

    status = "error"

  } else if (groupQuery.isSuccess && groupQuery.data === null) {

    status = "not_found"

  } else if (groupQuery.isPending || isOptionsLoading) {

    status = "loading"

  } else {

    status = "ready"

  }



  async function save(values: GroupFormValues): Promise<void> {

    setError(null)

    await updateMutation.mutateAsync(values).catch(() => undefined)

  }



  const queryError =

    userQuery.error?.message ??

    groupQuery.error?.message ??

    bookOptionsQuery.error?.message ??

    staffOptionsQuery.error?.message ??

    null



  const state: EditGroupViewModelState = {

    status,

    group: groupQuery.data ?? null,

    bookOptions: bookOptionsQuery.data ?? [],

    staffOptions: staffOptionsQuery.data ?? [],

    branchOptions,

    showBranchField,

    error: error ?? queryError,

    isLoading: status === "loading",

    isReady: status === "ready",

    isSaving: status === "saving",

    isSaved: status === "saved",

    isNotFound: status === "not_found",

    isError: status === "error",

  }



  return { state, form, save }

}


"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { User } from "@/domain/entities/User"
import type { CreateMemberInput } from "@/domain/repositories/MemberManagementRepository"
import {
  memberFormSchema,
  type MemberFormInput,
  type MemberFormValues,
} from "@/domain/schemas/memberFormSchema"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { resolveUserBranchId } from "@/lib/dashboardBranchScope"
import type { CreateMemberStatus, CreateMemberViewModelState } from "./CreateMemberViewModelState"

type CreateMemberViewModel = {
  state: CreateMemberViewModelState
  form: ReturnType<typeof useForm<MemberFormInput, unknown, MemberFormValues>>
  save: (values: MemberFormValues) => Promise<void>
}

function formToCreateInput(
  values: MemberFormValues,
  user: User,
  branches: Branch[]
): CreateMemberInput {
  const branchId = resolveUserBranchId(user)
  const branch = branches.find((item) => item.id === branchId)

  return {
    memberName: values.memberName,
    email: values.email,
    phone: values.phone,
    branchId,
    registerBranch: branch?.branchName ?? "",
    address: values.address,
    status: values.status,
  }
}

export function useCreateMemberViewModel(
  authUseCase: AuthUseCase,
  memberManagementUseCase: MemberManagementUseCase,
  branchManagementUseCase: BranchManagementUseCase
): CreateMemberViewModel {
  const form = useForm<MemberFormInput, unknown, MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      memberName: "",
      email: "",
      phone: "",
      address: "",
      status: "active",
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

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const result = await branchManagementUseCase.getBranches()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const branches = branchesQuery.data ?? []
  const user = userQuery.data ?? null

  const createMutation = useMutation({
    mutationFn: async (values: MemberFormValues) => {
      if (!user) throw new Error("You must be signed in to create a member.")

      const result = await memberManagementUseCase.createMember(
        formToCreateInput(values, user, branches)
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const status: CreateMemberStatus =
    userQuery.isPending || branchesQuery.isPending
      ? "loading"
      : userQuery.isError || branchesQuery.isError
        ? "error"
        : createMutation.isPending
          ? "saving"
          : createMutation.isSuccess
            ? "saved"
            : userQuery.isSuccess && !user
              ? "error"
              : "ready"

  const error =
    userQuery.isError
      ? userQuery.error instanceof Error
        ? userQuery.error.message
        : String(userQuery.error)
      : branchesQuery.isError
        ? branchesQuery.error instanceof Error
          ? branchesQuery.error.message
          : String(branchesQuery.error)
        : userQuery.isSuccess && !user
          ? "You must be signed in to create a member."
          : createMutation.isError
            ? createMutation.error instanceof Error
              ? createMutation.error.message
              : String(createMutation.error)
            : null

  async function save(values: MemberFormValues): Promise<void> {
    await createMutation.mutateAsync(values)
  }

  const state: CreateMemberViewModelState = {
    status,
    error,
    isLoading: status === "loading",
    isReady: status === "ready",
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save }
}

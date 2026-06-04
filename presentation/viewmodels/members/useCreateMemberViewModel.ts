"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { CreateMemberInput } from "@/domain/repositories/MemberManagementRepository"
import {
  memberFormSchema,
  type MemberFormInput,
  type MemberFormValues,
} from "@/domain/schemas/memberFormSchema"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import type { CreateMemberStatus, CreateMemberViewModelState } from "./CreateMemberViewModelState"

type CreateMemberViewModel = {
  state: CreateMemberViewModelState
  form: ReturnType<typeof useForm<MemberFormInput, unknown, MemberFormValues>>
  save: (values: MemberFormValues) => Promise<void>
}

function formToCreateInput(
  values: MemberFormValues,
  branches: Branch[]
): CreateMemberInput {
  const branch = branches.find((item) => item.id === values.branchId)

  return {
    memberName: values.memberName,
    email: values.email,
    phone: values.phone,
    branchId: values.branchId,
    registerBranch: branch?.branchName ?? "",
    address: values.address,
    status: values.status,
  }
}

export function useCreateMemberViewModel(
  memberManagementUseCase: MemberManagementUseCase,
  branchManagementUseCase: BranchManagementUseCase
): CreateMemberViewModel {
  const form = useForm<MemberFormInput, unknown, MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      memberName: "",
      email: "",
      phone: "",
      branchId: "",
      address: "",
      status: "active",
    },
  })

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const result = await branchManagementUseCase.getBranches()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const branches = branchesQuery.data ?? []

  const createMutation = useMutation({
    mutationFn: async (values: MemberFormValues) => {
      const result = await memberManagementUseCase.createMember(
        formToCreateInput(values, branches)
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const status: CreateMemberStatus = branchesQuery.isPending
    ? "loading"
    : branchesQuery.isError
      ? "error"
      : createMutation.isPending
        ? "saving"
        : createMutation.isSuccess
          ? "saved"
          : createMutation.isError
            ? "error"
            : "ready"

  const error = branchesQuery.isError
    ? branchesQuery.error instanceof Error
      ? branchesQuery.error.message
      : String(branchesQuery.error)
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
    branches,
    error,
    isLoading: status === "loading",
    isReady: status === "ready",
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save }
}

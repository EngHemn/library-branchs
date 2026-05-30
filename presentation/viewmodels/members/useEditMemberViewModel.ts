"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { UpdateMemberInput } from "@/domain/repositories/MemberManagementRepository"
import {
  memberFormSchema,
  type MemberFormInput,
  type MemberFormValues,
} from "@/domain/schemas/memberFormSchema"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"

type EditMemberStatus =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

type EditMemberViewModelState = {
  status: EditMemberStatus
  branches: Branch[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

type EditMemberViewModel = {
  state: EditMemberViewModelState
  form: ReturnType<typeof useForm<MemberFormInput, unknown, MemberFormValues>>
  save: (values: MemberFormValues) => Promise<void>
}

function formToUpdateInput(
  memberId: string,
  values: MemberFormValues,
  branches: Branch[]
): UpdateMemberInput {
  const branch = branches.find((item) => item.id === values.branchId)

  return {
    id: memberId,
    memberName: values.memberName,
    email: values.email,
    phone: values.phone,
    branchId: values.branchId,
    registerBranch: branch?.branchName ?? "",
    address: values.address,
    status: values.status,
  }
}

export function useEditMemberViewModel(
  memberId: string,
  memberManagementUseCase: MemberManagementUseCase,
  branchManagementUseCase: BranchManagementUseCase
): EditMemberViewModel {
  const queryClient = useQueryClient()

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

  const memberQuery = useQuery({
    queryKey: ["member", memberId],
    queryFn: async () => {
      const result = await memberManagementUseCase.getMemberById(memberId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  useEffect(() => {
    if (memberQuery.data) {
      const member = memberQuery.data
      form.reset({
        memberName: member.memberName,
        email: member.email,
        phone: member.phone,
        branchId: member.branchId,
        address: member.address,
        status: member.status,
      })
    }
  }, [memberQuery.data, form])

  const branches = branchesQuery.data ?? []

  const updateMutation = useMutation({
    mutationFn: async (values: MemberFormValues) => {
      const result = await memberManagementUseCase.updateMember(
        formToUpdateInput(memberId, values, branches)
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] })
      queryClient.invalidateQueries({ queryKey: ["member", memberId] })
    },
  })

  const isDataLoading = branchesQuery.isPending || memberQuery.isPending
  const isDataError = branchesQuery.isError || memberQuery.isError

  const status: EditMemberStatus = isDataLoading
    ? "loading"
    : isDataError
      ? "error"
      : memberQuery.isSuccess && !memberQuery.data
        ? "not-found"
        : updateMutation.isPending
          ? "saving"
          : updateMutation.isSuccess
            ? "saved"
            : "ready"

  const error = branchesQuery.isError
    ? branchesQuery.error instanceof Error
      ? branchesQuery.error.message
      : String(branchesQuery.error)
    : memberQuery.isError
      ? memberQuery.error instanceof Error
        ? memberQuery.error.message
        : String(memberQuery.error)
      : updateMutation.isError
        ? updateMutation.error instanceof Error
          ? updateMutation.error.message
          : String(updateMutation.error)
        : null

  async function save(values: MemberFormValues): Promise<void> {
    await updateMutation.mutateAsync(values)
  }

  const state: EditMemberViewModelState = {
    status,
    branches,
    error,
    isLoading: status === "loading",
    isReady: status === "ready",
    isNotFound: status === "not-found",
    isError: status === "error",
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save }
}

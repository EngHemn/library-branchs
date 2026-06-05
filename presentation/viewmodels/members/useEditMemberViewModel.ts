"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { MemberDetail } from "@/domain/entities/member/MemberDetail"
import type { UpdateMemberInput } from "@/domain/repositories/MemberManagementRepository"
import {
  memberFormSchema,
  type MemberFormInput,
  type MemberFormValues,
} from "@/domain/schemas/memberFormSchema"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import type { EditMemberStatus, EditMemberViewModelState } from "./EditMemberViewModelState"

type EditMemberViewModel = {
  state: EditMemberViewModelState
  form: ReturnType<typeof useForm<MemberFormInput, unknown, MemberFormValues>>
  save: (values: MemberFormValues) => Promise<void>
}

function formToUpdateInput(
  memberId: string,
  values: MemberFormValues,
  member: MemberDetail
): UpdateMemberInput {
  return {
    id: memberId,
    memberName: values.memberName,
    email: values.email,
    phone: values.phone,
    branchId: member.branchId,
    registerBranch: member.registerBranch,
    address: values.address,
    status: values.status,
  }
}

export function useEditMemberViewModel(
  memberId: string,
  memberManagementUseCase: MemberManagementUseCase
): EditMemberViewModel {
  const queryClient = useQueryClient()

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
        address: member.address,
        status: member.status,
      })
    }
  }, [memberQuery.data, form])

  const updateMutation = useMutation({
    mutationFn: async (values: MemberFormValues) => {
      const member = memberQuery.data
      if (!member) throw new Error("Member not found.")

      const result = await memberManagementUseCase.updateMember(
        formToUpdateInput(memberId, values, member)
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] })
      queryClient.invalidateQueries({ queryKey: ["member", memberId] })
    },
  })

  const status: EditMemberStatus = memberQuery.isPending
    ? "loading"
    : memberQuery.isError
      ? "error"
      : memberQuery.isSuccess && !memberQuery.data
        ? "not-found"
        : updateMutation.isPending
          ? "saving"
          : updateMutation.isSuccess
            ? "saved"
            : "ready"

  const error = memberQuery.isError
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

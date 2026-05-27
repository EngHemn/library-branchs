"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
  const [status, setStatus] = useState<EditMemberStatus>("idle")
  const [branches, setBranches] = useState<Branch[]>([])
  const [error, setError] = useState<string | null>(null)

  const form = useForm<MemberFormInput, unknown, MemberFormValues>({
    resolver: zodResolver(memberFormSchema as never),
    defaultValues: {
      memberName: "",
      email: "",
      phone: "",
      branchId: "",
      address: "",
      status: "active",
    },
  })

  useEffect(() => {
    let cancelled = false

    async function loadData(): Promise<void> {
      setStatus("loading")
      setError(null)

      const [memberResult, branchesResult] = await Promise.all([
        memberManagementUseCase.getMemberById(memberId),
        branchManagementUseCase.getBranches(),
      ])

      if (cancelled) return

      if (!branchesResult.success) {
        setStatus("error")
        setError(branchesResult.error)
        return
      }

      setBranches(branchesResult.data)

      if (!memberResult.success) {
        setStatus("error")
        setError(memberResult.error)
        return
      }

      if (!memberResult.data) {
        setStatus("not-found")
        return
      }

      const member = memberResult.data

      form.reset({
        memberName: member.memberName,
        email: member.email,
        phone: member.phone,
        branchId: member.branchId,
        address: member.address,
        status: member.status,
      })
      setStatus("ready")
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [memberId, memberManagementUseCase, branchManagementUseCase, form])

  async function save(values: MemberFormValues): Promise<void> {
    setStatus("saving")
    setError(null)

    const result = await memberManagementUseCase.updateMember(
      formToUpdateInput(memberId, values, branches)
    )

    if (!result.success) {
      setStatus("ready")
      setError(result.error)
      return
    }

    setStatus("saved")
  }

  const state: EditMemberViewModelState = {
    status,
    branches,
    error,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "ready",
    isNotFound: status === "not-found",
    isError: status === "error",
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save }
}

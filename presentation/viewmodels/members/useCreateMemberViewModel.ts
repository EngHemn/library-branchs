"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { CreateMemberInput } from "@/domain/repositories/MemberManagementRepository"
import {
  memberFormSchema,
  type MemberFormInput,
  type MemberFormValues,
} from "@/domain/schemas/memberFormSchema"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"

type CreateMemberStatus =
  | "idle"
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error"

type CreateMemberViewModelState = {
  status: CreateMemberStatus
  branches: Branch[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

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
  const [status, setStatus] = useState<CreateMemberStatus>("idle")
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

    async function loadBranches(): Promise<void> {
      setStatus("loading")
      setError(null)

      const result = await branchManagementUseCase.getBranches()

      if (cancelled) return

      if (!result.success) {
        setStatus("error")
        setError(result.error)
        return
      }

      setBranches(result.data)
      setStatus("ready")
    }

    void loadBranches()

    return () => {
      cancelled = true
    }
  }, [branchManagementUseCase])

  async function save(values: MemberFormValues): Promise<void> {
    setStatus("saving")
    setError(null)

    const result = await memberManagementUseCase.createMember(
      formToCreateInput(values, branches)
    )

    if (!result.success) {
      setStatus("ready")
      setError(result.error)
      return
    }

    setStatus("saved")
  }

  const state: CreateMemberViewModelState = {
    status,
    branches,
    error,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "ready",
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save }
}

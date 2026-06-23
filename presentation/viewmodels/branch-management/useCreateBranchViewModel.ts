"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import type { CreateBranchInput } from "@/domain/repositories/BranchManagementRepository"
import { buildSubBranchCreateInput } from "@/domain/services/buildSubBranchCreateInput"
import { resolveCreateBranchParentBranchName } from "@/domain/services/resolveCreateBranchParent"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import {
  type CreateBranchFormErrors,
  getCreateBranchFieldErrors,
  validateCreateBranchForm,
} from "@/domain/validators/branch/validateCreateBranchForm"
import { readStoredSessionUser } from "@/lib/authSession"
import { generatePassword } from "@/lib/generatePassword"
import type {
  CreateBranchFormState,
  CreateBranchStatus,
  CreateBranchViewModelState,
} from "./CreateBranchViewModelState"

type CreateBranchViewModel = {
  state: CreateBranchViewModelState
  setField: (field: keyof CreateBranchFormState, value: string | null) => void
  setLocation: (latitude: number | null, longitude: number | null) => void
  autoGeneratePassword: () => void
  save: () => Promise<void>
}

const emptyForm: CreateBranchFormState = {
  branchName: "",
  email: "",
  adminName: "",
  address: "",
  phone: "",
  latitude: null,
  longitude: null,
  password: "",
  imageUrl: null,
}

const emptyFieldErrors: CreateBranchFormErrors = {
  branchName: null,
  email: null,
  adminName: null,
  address: null,
  phone: null,
  parentBranch: null,
  location: null,
  password: null,
}

function formToCreateInput(
  form: CreateBranchFormState,
  parentBranchName: string
): CreateBranchInput {
  return buildSubBranchCreateInput(
    {
      branchName: form.branchName,
      email: form.email,
      adminName: form.adminName,
      address: form.address,
      phone: form.phone,
      latitude: form.latitude,
      longitude: form.longitude,
      password: form.password,
      imageUrl: form.imageUrl,
    },
    parentBranchName
  )
}

export function useCreateBranchViewModel(
  branchManagementUseCase: BranchManagementUseCase
): CreateBranchViewModel {
  const [form, setForm] = useState<CreateBranchFormState>(emptyForm)
  const [savedBranchId, setSavedBranchId] = useState<string | null>(null)
  const [showFieldErrors, setShowFieldErrors] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    data: prereqs,
    isPending: isLoadingPrereqs,
    isError: isPrereqsError,
    error: prereqsError,
  } = useQuery({
    queryKey: ["createBranchPrerequisites"],
    enabled: mounted,
    queryFn: async () => {
      const user = readStoredSessionUser()
      const branchesResult = await branchManagementUseCase.getBranches()

      if (!branchesResult.success) throw new Error(branchesResult.error)

      const parentBranchName = resolveCreateBranchParentBranchName(
        user,
        branchesResult.data
      )

      return { parentBranchName }
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (input: CreateBranchInput) => {
      const result = await branchManagementUseCase.createBranch(input)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (branch) => {
      setSavedBranchId(branch.id)
    },
  })

  function setField(
    field: keyof CreateBranchFormState,
    value: string | null
  ): void {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function setLocation(
    latitude: number | null,
    longitude: number | null
  ): void {
    setForm((currentForm) => ({ ...currentForm, latitude, longitude }))
  }

  function autoGeneratePassword(): void {
    setForm((currentForm) => ({ ...currentForm, password: generatePassword() }))
  }

  async function save(): Promise<void> {
    if (!prereqs?.parentBranchName) return

    setShowFieldErrors(true)

    const input = formToCreateInput(form, prereqs.parentBranchName)
    const validationResult = validateCreateBranchForm(input)
    if (!validationResult.success) return

    saveMutation.mutate(validationResult.data)
  }

  const fieldErrors: CreateBranchFormErrors = prereqs?.parentBranchName
    ? getCreateBranchFieldErrors(
        formToCreateInput(form, prereqs.parentBranchName)
      )
    : emptyFieldErrors

  const status: CreateBranchStatus =
    !mounted || isLoadingPrereqs
      ? "loading"
      : isPrereqsError
        ? "error"
        : saveMutation.isPending
          ? "saving"
          : savedBranchId !== null
            ? "saved"
            : "ready"

  const state: CreateBranchViewModelState = {
    status,
    form,
    fieldErrors: showFieldErrors ? fieldErrors : emptyFieldErrors,
    savedBranchId,
    error: isPrereqsError
      ? prereqsError instanceof Error
        ? prereqsError.message
        : "Unknown error"
      : saveMutation.isError
        ? saveMutation.error instanceof Error
          ? saveMutation.error.message
          : null
        : null,
    isLoading: status === "loading",
    isReady: status === "ready",
    isSaving: status === "saving",
    isSaved: status === "saved",
    isError: status === "error",
  }

  return {
    state,
    setField,
    setLocation,
    autoGeneratePassword,
    save,
  }
}

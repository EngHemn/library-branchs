"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { UpdateBranchInput } from "@/domain/repositories/BranchManagementRepository"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import {
  type BranchFormErrors,
  getFieldErrors,
  validateBranchForm,
} from "@/domain/validators/branch/validateBranchForm"
import { generatePassword } from "@/lib/generatePassword"

type EditBranchStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "not-found"
  | "saving"
  | "saved"
  | "error"

type EditBranchFormState = {
  branchName: string
  email: string
  adminName: string
  parentBranch: string | null
  address: string
  phone: string
  latitude: number | null
  longitude: number | null
  password: string
  imageUrl: string | null
}

type EditBranchViewModelState = {
  status: EditBranchStatus
  branch: Branch | null
  form: EditBranchFormState
  fieldErrors: BranchFormErrors
  mainBranches: Branch[]
  error: string | null
  showFieldErrors: boolean
  isLoading: boolean
  isLoaded: boolean
  isSaving: boolean
  isSaved: boolean
  isNotFound: boolean
  isError: boolean
}

type EditBranchViewModel = {
  state: EditBranchViewModelState
  setField: (field: keyof EditBranchFormState, value: string | number | null) => void
  setLocation: (latitude: number | null, longitude: number | null) => void
  autoGeneratePassword: () => void
  save: () => Promise<void>
}

const emptyForm: EditBranchFormState = {
  branchName: "",
  email: "",
  adminName: "",
  parentBranch: null,
  address: "",
  phone: "",
  latitude: null,
  longitude: null,
  password: "",
  imageUrl: null,
}

const emptyFieldErrors: BranchFormErrors = {
  branchName: null,
  email: null,
  adminName: null,
  address: null,
  phone: null,
  parentBranch: null,
  password: null,
}

function branchToFormState(branch: Branch): EditBranchFormState {
  return {
    branchName: branch.branchName,
    email: branch.email,
    adminName: branch.adminName,
    parentBranch: branch.parentBranch,
    address: branch.address,
    phone: branch.phone,
    latitude: branch.latitude,
    longitude: branch.longitude,
    password: "",
    imageUrl: branch.imageUrl ?? null,
  }
}

function formToUpdateInput(form: EditBranchFormState): UpdateBranchInput {
  return {
    branchName: form.branchName,
    email: form.email,
    adminName: form.adminName,
    parentBranch: form.parentBranch,
    address: form.address,
    phone: form.phone,
    latitude: form.latitude,
    longitude: form.longitude,
    password: form.password || undefined,
    imageUrl: form.imageUrl,
  }
}

export function useEditBranchViewModel(
  branchId: string,
  branchManagementUseCase: BranchManagementUseCase
): EditBranchViewModel {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<EditBranchFormState>(emptyForm)
  const [showFieldErrors, setShowFieldErrors] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["editBranchData", branchId],
    queryFn: async () => {
      const [branchResult, branchesResult] = await Promise.all([
        branchManagementUseCase.getBranchById(branchId),
        branchManagementUseCase.getBranches(),
      ])

      if (!branchResult.success) throw new Error(branchResult.error)
      if (!branchResult.data) return null

      const branch = branchResult.data
      const mainBranches = branchesResult.success
        ? branchesResult.data.filter((b) => b.type === "main" && b.id !== branchId)
        : []

      return { branch, mainBranches }
    },
  })

  useEffect(() => {
    if (data?.branch) {
      setForm(branchToFormState(data.branch))
    }
  }, [data?.branch])

  const saveMutation = useMutation({
    mutationFn: async (vars: { branchId: string; input: UpdateBranchInput }) => {
      const result = await branchManagementUseCase.updateBranch(vars.branchId, vars.input)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["editBranchData", branchId] })
      setIsSaved(true)
    },
  })

  function setField(field: keyof EditBranchFormState, value: string | number | null): void {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function setLocation(latitude: number | null, longitude: number | null): void {
    setForm((currentForm) => ({ ...currentForm, latitude, longitude }))
  }

  function autoGeneratePassword(): void {
    setForm((currentForm) => ({ ...currentForm, password: generatePassword() }))
  }

  async function save(): Promise<void> {
    if (!data?.branch) return

    setShowFieldErrors(true)

    const input = formToUpdateInput(form)
    const validationResult = validateBranchForm(input, data.branch.type)
    if (!validationResult.success) return

    saveMutation.mutate({ branchId: data.branch.id, input: validationResult.data })
  }

  const fieldErrors: BranchFormErrors = data?.branch
    ? getFieldErrors(formToUpdateInput(form), data.branch.type)
    : emptyFieldErrors

  const status: EditBranchStatus = isPending
    ? "loading"
    : isError
    ? "error"
    : data === null
    ? "not-found"
    : isSaved
    ? "saved"
    : saveMutation.isPending
    ? "saving"
    : "loaded"

  const state: EditBranchViewModelState = {
    status,
    branch: data?.branch ?? null,
    form,
    fieldErrors: showFieldErrors ? fieldErrors : emptyFieldErrors,
    mainBranches: data?.mainBranches ?? [],
    error: isError
      ? (error instanceof Error ? error.message : "Unknown error")
      : saveMutation.isError
      ? (saveMutation.error instanceof Error ? saveMutation.error.message : "Unknown error")
      : null,
    showFieldErrors,
    isLoading: status === "loading",
    isLoaded: status === "loaded",
    isSaving: status === "saving",
    isSaved: status === "saved",
    isNotFound: status === "not-found",
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

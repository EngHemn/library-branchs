"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { StaffRole } from "@/domain/entities/staff/StaffMember"
import type { CreateStaffInput } from "@/domain/repositories/StaffManagementRepository"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import {
  type CreateStaffFormErrors,
  getCreateStaffFieldErrors,
  validateCreateStaffForm,
} from "@/domain/validators/staff/validateCreateStaffForm"
import { generatePassword } from "@/lib/generatePassword"

type CreateStaffStatus =
  | "idle"
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error"

type CreateStaffFormState = {
  staffName: string
  role: StaffRole | ""
  branchId: string
  email: string
  phone: string
  password: string
}

type CreateStaffViewModelState = {
  status: CreateStaffStatus
  form: CreateStaffFormState
  fieldErrors: CreateStaffFormErrors
  branches: Branch[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

type CreateStaffViewModel = {
  state: CreateStaffViewModelState
  setField: (field: keyof CreateStaffFormState, value: string) => void
  autoGeneratePassword: () => void
  save: () => Promise<void>
}

const emptyForm: CreateStaffFormState = {
  staffName: "",
  role: "",
  branchId: "",
  email: "",
  phone: "",
  password: "",
}

const emptyFieldErrors: CreateStaffFormErrors = {
  staffName: null,
  role: null,
  branch: null,
  email: null,
  phone: null,
  password: null,
}

function toStaffRole(role: StaffRole | ""): StaffRole {
  return role !== "" ? role : "staff"
}

function formToCreateInput(
  form: CreateStaffFormState,
  branches: Branch[]
): CreateStaffInput {
  const branch = branches.find((b) => b.id === form.branchId)
  return {
    staffName: form.staffName,
    role: toStaffRole(form.role),
    branchId: form.branchId,
    branch: branch?.branchName ?? "",
    email: form.email,
    phone: form.phone,
    password: form.password,
  }
}

export function useCreateStaffViewModel(
  staffManagementUseCase: StaffManagementUseCase,
  branchManagementUseCase: BranchManagementUseCase
): CreateStaffViewModel {
  const [form, setForm] = useState<CreateStaffFormState>(emptyForm)
  const [showFieldErrors, setShowFieldErrors] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const result = await branchManagementUseCase.getBranches()
      if (!result.success) throw new Error(result.error)
      return result.data.filter((b) => b.status === "active")
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (input: CreateStaffInput) => {
      const result = await staffManagementUseCase.createStaff(input)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => setIsSaved(true),
    onError: (err: Error) => setError(err.message),
  })

  function setField(field: keyof CreateStaffFormState, value: string): void {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function autoGeneratePassword(): void {
    setForm((current) => ({ ...current, password: generatePassword() }))
  }

  async function save(): Promise<void> {
    setShowFieldErrors(true)

    if (!form.role) return

    const branches = branchesQuery.data ?? []
    const input = formToCreateInput(form, branches)
    const validationResult = validateCreateStaffForm(input)

    if (!validationResult.success) return

    setError(null)
    await saveMutation.mutateAsync(validationResult.data).catch(() => undefined)
  }

  const branches = branchesQuery.data ?? []

  const fieldErrors: CreateStaffFormErrors = !form.role
    ? {
        ...emptyFieldErrors,
        role: showFieldErrors ? "Role is required" : null,
      }
    : getCreateStaffFieldErrors(formToCreateInput(form, branches))

  const isLoading = branchesQuery.isPending
  const isSaving = saveMutation.isPending

  const status: CreateStaffStatus = isSaved
    ? "saved"
    : isSaving
      ? "saving"
      : isLoading
        ? "loading"
        : "ready"

  const state: CreateStaffViewModelState = {
    status,
    form,
    fieldErrors: showFieldErrors ? fieldErrors : emptyFieldErrors,
    branches,
    error,
    isLoading,
    isReady: status === "ready",
    isSaving,
    isSaved,
  }

  return { state, setField, autoGeneratePassword, save }
}

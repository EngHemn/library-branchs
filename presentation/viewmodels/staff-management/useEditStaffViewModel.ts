"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { StaffMember, StaffRole } from "@/domain/entities/staff/StaffMember"
import type { UpdateStaffInput } from "@/domain/repositories/StaffManagementRepository"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import {
  type EditStaffFormErrors,
  getEditStaffFieldErrors,
  validateEditStaffForm,
} from "@/domain/validators/staff/validateEditStaffForm"
import { generatePassword } from "@/lib/generatePassword"

type EditStaffStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "not-found"
  | "saving"
  | "saved"
  | "error"

type EditStaffFormState = {
  staffName: string
  role: StaffRole | ""
  branchId: string
  email: string
  phone: string
  password: string
}

type EditStaffViewModelState = {
  status: EditStaffStatus
  staffMember: StaffMember | null
  form: EditStaffFormState
  fieldErrors: EditStaffFormErrors
  branches: Branch[]
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isSaving: boolean
  isSaved: boolean
  isNotFound: boolean
  isError: boolean
}

type EditStaffViewModel = {
  state: EditStaffViewModelState
  setField: (field: keyof EditStaffFormState, value: string) => void
  autoGeneratePassword: () => void
  save: () => Promise<void>
}

const emptyForm: EditStaffFormState = {
  staffName: "",
  role: "",
  branchId: "",
  email: "",
  phone: "",
  password: "",
}

const emptyFieldErrors: EditStaffFormErrors = {
  staffName: null,
  role: null,
  branch: null,
  email: null,
  phone: null,
  password: null,
}

function staffToFormState(member: StaffMember): EditStaffFormState {
  return {
    staffName: member.staffName,
    role: member.role,
    branchId: member.branchId,
    email: member.email,
    phone: member.phone,
    password: "",
  }
}

function toStaffRole(role: StaffRole | ""): StaffRole {
  return role !== "" ? role : "staff"
}

function formToUpdateInput(
  form: EditStaffFormState,
  branches: Branch[]
): UpdateStaffInput {
  const branch = branches.find((b) => b.id === form.branchId)
  return {
    staffName: form.staffName,
    role: toStaffRole(form.role),
    branchId: form.branchId,
    branch: branch?.branchName ?? "",
    email: form.email,
    phone: form.phone,
    password: form.password || undefined,
  }
}

export function useEditStaffViewModel(
  staffId: string,
  staffManagementUseCase: StaffManagementUseCase,
  branchManagementUseCase: BranchManagementUseCase
): EditStaffViewModel {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<EditStaffFormState>(emptyForm)
  const [showFieldErrors, setShowFieldErrors] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const staffQuery = useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      const result = await staffManagementUseCase.getStaffById(staffId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const result = await branchManagementUseCase.getBranches()
      if (!result.success) throw new Error(result.error)
      return result.data.filter((b) => b.status === "active")
    },
  })

  useEffect(() => {
    if (staffQuery.data) {
      setForm(staffToFormState(staffQuery.data))
    }
  }, [staffQuery.data])

  const saveMutation = useMutation({
    mutationFn: async (input: { id: string; data: UpdateStaffInput }) => {
      const result = await staffManagementUseCase.updateStaff(
        input.id,
        input.data
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      setIsSaved(true)
      void queryClient.invalidateQueries({ queryKey: ["staff", staffId] })
    },
    onError: (err: Error) => setError(err.message),
  })

  function setField(field: keyof EditStaffFormState, value: string): void {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function autoGeneratePassword(): void {
    setForm((current) => ({ ...current, password: generatePassword() }))
  }

  async function save(): Promise<void> {
    if (!staffQuery.data) return

    setShowFieldErrors(true)

    if (!form.role) return

    const branches = branchesQuery.data ?? []
    const input = formToUpdateInput(form, branches)
    const validationResult = validateEditStaffForm(input)

    if (!validationResult.success) return

    setError(null)
    await saveMutation
      .mutateAsync({ id: staffQuery.data.id, data: validationResult.data })
      .catch(() => undefined)
  }

  const staffMember = staffQuery.data ?? null
  const branches = branchesQuery.data ?? []
  const isLoading =
    staffQuery.isPending || (staffQuery.isSuccess && branchesQuery.isPending)
  const isSaving = saveMutation.isPending
  const isNotFound = staffQuery.isSuccess && staffQuery.data === null
  const isError = staffQuery.isError

  const fieldErrors: EditStaffFormErrors = !staffMember
    ? emptyFieldErrors
    : !form.role
      ? {
          ...emptyFieldErrors,
          role: showFieldErrors ? "Role is required" : null,
        }
      : getEditStaffFieldErrors(formToUpdateInput(form, branches))

  let status: EditStaffStatus
  if (isSaved) {
    status = "saved"
  } else if (isSaving) {
    status = "saving"
  } else if (isError) {
    status = "error"
  } else if (isNotFound) {
    status = "not-found"
  } else if (isLoading) {
    status = "loading"
  } else if (staffMember !== null) {
    status = "loaded"
  } else {
    status = "idle"
  }

  const state: EditStaffViewModelState = {
    status,
    staffMember,
    form,
    fieldErrors: showFieldErrors ? fieldErrors : emptyFieldErrors,
    branches,
    error,
    isLoading,
    isLoaded: status === "loaded",
    isSaving,
    isSaved,
    isNotFound,
    isError,
  }

  return { state, setField, autoGeneratePassword, save }
}

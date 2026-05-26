"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

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
  save: () => Promise<void>
}

const emptyForm: CreateStaffFormState = {
  staffName: "",
  role: "",
  branchId: "",
  email: "",
  phone: "",
}

const emptyFieldErrors: CreateStaffFormErrors = {
  staffName: null,
  role: null,
  branch: null,
  email: null,
  phone: null,
}

function formToCreateInput(
  form: CreateStaffFormState,
  branches: Branch[]
): CreateStaffInput {
  const branch = branches.find((b) => b.id === form.branchId)

  return {
    staffName: form.staffName,
    role: (form.role || "assistant") as StaffRole,
    branchId: form.branchId,
    branch: branch?.branchName ?? "",
    email: form.email,
    phone: form.phone,
  }
}

export function useCreateStaffViewModel(
  staffManagementUseCase: StaffManagementUseCase,
  branchManagementUseCase: BranchManagementUseCase
): CreateStaffViewModel {
  const [status, setStatus] = useState<CreateStaffStatus>("idle")
  const [form, setForm] = useState<CreateStaffFormState>(emptyForm)
  const [branches, setBranches] = useState<Branch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showFieldErrors, setShowFieldErrors] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadBranches(): Promise<void> {
      setStatus("loading")

      const result = await branchManagementUseCase.getBranches()

      if (cancelled) {
        return
      }

      if (result.success) {
        setBranches(result.data.filter((branch) => branch.status === "active"))
      }

      setStatus("ready")
    }

    void loadBranches()

    return () => {
      cancelled = true
    }
  }, [branchManagementUseCase])

  const fieldErrors = useMemo<CreateStaffFormErrors>(() => {
    if (!form.role) {
      return {
        ...emptyFieldErrors,
        role: showFieldErrors ? "Role is required" : null,
      }
    }

    return getCreateStaffFieldErrors(formToCreateInput(form, branches))
  }, [form, showFieldErrors, branches])

  const setField = useCallback(
    (field: keyof CreateStaffFormState, value: string): void => {
      setForm((current) => ({ ...current, [field]: value }))
    },
    []
  )

  const save = useCallback(async (): Promise<void> => {
    setShowFieldErrors(true)

    if (!form.role) {
      return
    }

    const input = formToCreateInput(form, branches)
    const validationResult = validateCreateStaffForm(input)

    if (!validationResult.success) {
      return
    }

    setStatus("saving")
    setError(null)

    const result = await staffManagementUseCase.createStaff(
      validationResult.data
    )

    if (!result.success) {
      setStatus("ready")
      setError(result.error)
      return
    }

    setStatus("saved")
  }, [branches, form, staffManagementUseCase])

  const state = useMemo<CreateStaffViewModelState>(
    () => ({
      status,
      form,
      fieldErrors: showFieldErrors ? fieldErrors : emptyFieldErrors,
      branches,
      error,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "ready",
      isSaving: status === "saving",
      isSaved: status === "saved",
    }),
    [branches, error, fieldErrors, form, showFieldErrors, status]
  )

  return {
    state,
    setField,
    save,
  }
}

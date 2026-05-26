"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

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
  save: () => Promise<void>
}

const emptyForm: EditStaffFormState = {
  staffName: "",
  role: "",
  branchId: "",
  email: "",
  phone: "",
}

const emptyFieldErrors: EditStaffFormErrors = {
  staffName: null,
  role: null,
  branch: null,
  email: null,
  phone: null,
}

function staffToFormState(member: StaffMember): EditStaffFormState {
  return {
    staffName: member.staffName,
    role: member.role,
    branchId: member.branchId,
    email: member.email,
    phone: member.phone,
  }
}

function formToUpdateInput(
  form: EditStaffFormState,
  branches: Branch[]
): UpdateStaffInput {
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

export function useEditStaffViewModel(
  staffId: string,
  staffManagementUseCase: StaffManagementUseCase,
  branchManagementUseCase: BranchManagementUseCase
): EditStaffViewModel {
  const [status, setStatus] = useState<EditStaffStatus>("idle")
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null)
  const [form, setForm] = useState<EditStaffFormState>(emptyForm)
  const [branches, setBranches] = useState<Branch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showFieldErrors, setShowFieldErrors] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadStaff(): Promise<void> {
      setStatus("loading")
      setError(null)

      const [staffResult, branchesResult] = await Promise.all([
        staffManagementUseCase.getStaffById(staffId),
        branchManagementUseCase.getBranches(),
      ])

      if (cancelled) {
        return
      }

      if (!staffResult.success) {
        setStatus("error")
        setError(staffResult.error)
        return
      }

      if (!staffResult.data) {
        setStatus("not-found")
        return
      }

      if (branchesResult.success) {
        setBranches(
          branchesResult.data.filter((branch) => branch.status === "active")
        )
      }

      setStaffMember(staffResult.data)
      setForm(staffToFormState(staffResult.data))
      setStatus("loaded")
    }

    void loadStaff()

    return () => {
      cancelled = true
    }
  }, [staffId, staffManagementUseCase, branchManagementUseCase])

  const fieldErrors = useMemo<EditStaffFormErrors>(() => {
    if (!staffMember) {
      return emptyFieldErrors
    }

    if (!form.role) {
      return {
        ...emptyFieldErrors,
        role: showFieldErrors ? "Role is required" : null,
      }
    }

    return getEditStaffFieldErrors(formToUpdateInput(form, branches))
  }, [branches, form, showFieldErrors, staffMember])

  const setField = useCallback(
    (field: keyof EditStaffFormState, value: string): void => {
      setForm((current) => ({ ...current, [field]: value }))
    },
    []
  )

  const save = useCallback(async (): Promise<void> => {
    if (!staffMember) {
      return
    }

    setShowFieldErrors(true)

    if (!form.role) {
      return
    }

    const input = formToUpdateInput(form, branches)
    const validationResult = validateEditStaffForm(input)

    if (!validationResult.success) {
      return
    }

    setStatus("saving")
    setError(null)

    const result = await staffManagementUseCase.updateStaff(
      staffMember.id,
      validationResult.data
    )

    if (!result.success) {
      setStatus("loaded")
      setError(result.error)
      return
    }

    setStaffMember(result.data)
    setStatus("saved")
  }, [branches, form, staffManagementUseCase, staffMember])

  const state = useMemo<EditStaffViewModelState>(
    () => ({
      status,
      staffMember,
      form,
      fieldErrors: showFieldErrors ? fieldErrors : emptyFieldErrors,
      branches,
      error,
      isLoading: status === "idle" || status === "loading",
      isLoaded: status === "loaded",
      isSaving: status === "saving",
      isSaved: status === "saved",
      isNotFound: status === "not-found",
      isError: status === "error",
    }),
    [branches, error, fieldErrors, form, showFieldErrors, staffMember, status]
  )

  return {
    state,
    setField,
    save,
  }
}

"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { StaffMember, StaffRole } from "@/domain/entities/staff/StaffMember"
import type { UpdateStaffInput } from "@/domain/repositories/StaffManagementRepository"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { isBranchScopedStaffPermissionsUser } from "@/domain/services/staffPermissionsScope"
import {
  type EditStaffFormErrors,
  getEditStaffFieldErrors,
  validateEditStaffForm,
} from "@/domain/validators/staff/validateEditStaffForm"
import { generatePassword } from "@/lib/generatePassword"
import type { EditStaffFormState, EditStaffStatus, EditStaffViewModelState } from "./EditStaffViewModelState"

type EditStaffViewModel = {
  state: EditStaffViewModelState
  setField: <K extends keyof EditStaffFormState>(
    field: K,
    value: EditStaffFormState[K]
  ) => void
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
  imageUrl: null,
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
    imageUrl: member.imageUrl ?? null,
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
    imageUrl: form.imageUrl,
  }
}

export function useEditStaffViewModel(
  staffId: string,
  authUseCase: AuthUseCase,
  staffManagementUseCase: StaffManagementUseCase,
  branchManagementUseCase: BranchManagementUseCase
): EditStaffViewModel {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<EditStaffFormState>(emptyForm)
  const [showFieldErrors, setShowFieldErrors] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

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

  function setField<K extends keyof EditStaffFormState>(
    field: K,
    value: EditStaffFormState[K]
  ): void {
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

  const user = userQuery.data ?? null
  const staffMember = staffQuery.data ?? null
  const branches = branchesQuery.data ?? []
  const showBranchField = user ? !isBranchScopedStaffPermissionsUser(user) : true
  const showBranchAdminRole = user ? !isBranchScopedStaffPermissionsUser(user) : true
  const isLoading =
    userQuery.isPending ||
    staffQuery.isPending ||
    (staffQuery.isSuccess && branchesQuery.isPending)
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
    showBranchField,
    showBranchAdminRole,
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

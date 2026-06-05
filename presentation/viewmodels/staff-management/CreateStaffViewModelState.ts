"use client"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { StaffRole } from "@/domain/entities/staff/StaffMember"
import type { CreateStaffFormErrors } from "@/domain/validators/staff/validateCreateStaffForm"

export type CreateStaffStatus =
  | "idle"
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error"

export type CreateStaffFormState = {
  staffName: string
  role: StaffRole | ""
  branchId: string
  email: string
  phone: string
  password: string
  imageUrl: string | null
}

export type CreateStaffViewModelState = {
  status: CreateStaffStatus
  form: CreateStaffFormState
  fieldErrors: CreateStaffFormErrors
  branches: Branch[]
  showBranchField: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

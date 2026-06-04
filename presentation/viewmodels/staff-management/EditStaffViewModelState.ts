"use client"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { StaffMember, StaffRole } from "@/domain/entities/staff/StaffMember"
import type { EditStaffFormErrors } from "@/domain/validators/staff/validateEditStaffForm"

export type EditStaffStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "not-found"
  | "saving"
  | "saved"
  | "error"

export type EditStaffFormState = {
  staffName: string
  role: StaffRole | ""
  branchId: string
  email: string
  phone: string
  password: string
  imageUrl: string | null
}

export type EditStaffViewModelState = {
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

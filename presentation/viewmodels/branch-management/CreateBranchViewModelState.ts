"use client"

import type { CreateBranchFormErrors } from "@/domain/validators/branch/validateCreateBranchForm"

export type CreateBranchStatus =
  | "idle"
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error"

export type CreateBranchFormState = {
  branchName: string
  email: string
  adminName: string
  address: string
  phone: string
  latitude: number | null
  longitude: number | null
  password: string
  imageUrl: string | null
}

export type CreateBranchViewModelState = {
  status: CreateBranchStatus
  form: CreateBranchFormState
  fieldErrors: CreateBranchFormErrors
  savedBranchId: string | null
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
  isError: boolean
}

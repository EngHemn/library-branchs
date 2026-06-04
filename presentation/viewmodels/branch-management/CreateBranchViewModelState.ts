"use client"

import type { Branch, BranchType } from "@/domain/entities/branch/Branch"
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
  type: BranchType | ""
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

export type CreateBranchViewModelState = {
  status: CreateBranchStatus
  form: CreateBranchFormState
  fieldErrors: CreateBranchFormErrors
  mainBranches: Branch[]
  appliedRequestId: string | null
  savedBranchId: string | null
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
  isError: boolean
}

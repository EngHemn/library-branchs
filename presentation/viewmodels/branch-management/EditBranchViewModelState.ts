"use client"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchFormErrors } from "@/domain/validators/branch/validateBranchForm"

export type EditBranchStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "not-found"
  | "saving"
  | "saved"
  | "error"

export type EditBranchFormState = {
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

export type EditBranchViewModelState = {
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

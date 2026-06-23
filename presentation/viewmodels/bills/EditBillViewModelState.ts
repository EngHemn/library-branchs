"use client"

import type {
  BillBookOption,
  BillBranchOption,
} from "@/domain/repositories/BillManagementRepository"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"

export type EditBillStatus =
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

export type EditBillViewModelState = {
  status: EditBillStatus
  branchOptions: BillBranchOption[]
  bookOptions: BillBookOption[]
  showBranchField: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

"use client"

import type { BillBookOption, BillBranchOption } from "@/domain/repositories/BillManagementRepository"

export type CreateBillStatus = "loading" | "ready" | "saving" | "saved"

export type CreateBillViewModelState = {
  status: CreateBillStatus
  branchOptions: BillBranchOption[]
  bookOptions: BillBookOption[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

"use client"

import type { BillDetail } from "@/domain/entities/bill/BillDetail"
export type BillDetailStatus = "loading" | "loaded" | "not-found" | "error"

export type BillDetailViewModelState = {
  status: BillDetailStatus
  bill: BillDetail | null
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

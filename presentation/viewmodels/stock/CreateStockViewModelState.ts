"use client"

import type { StockBookOption } from "@/presentation/components/stock/StockBookSearchCombobox"

export type CreateStockStatus = "idle" | "loading" | "ready" | "saving" | "saved" | "error"

export type CreateStockViewModelState = {
  status: CreateStockStatus
  error: string | null
  books: StockBookOption[]
  subBranches: { id: string; name: string }[]
  showSubBranchField: boolean
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

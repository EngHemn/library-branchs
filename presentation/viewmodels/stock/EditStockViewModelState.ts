"use client"

import type { StockRow } from "@/domain/entities/stock/Stock"

export type EditStockStatus = "idle" | "loading" | "ready" | "saving" | "saved" | "error"

export type EditStockViewModelState = {
  status: EditStockStatus
  stockRow: StockRow | null
  error: string | null
  isNotFound: boolean
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

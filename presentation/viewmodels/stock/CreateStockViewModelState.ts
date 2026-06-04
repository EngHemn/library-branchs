"use client"

export type CreateStockStatus = "idle" | "loading" | "ready" | "saving" | "saved" | "error"

export type CreateStockViewModelState = {
  status: CreateStockStatus
  error: string | null
  books: { id: string; name: string }[]
  branches: { id: string; name: string }[]
  subBranches: { id: string; name: string }[]
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

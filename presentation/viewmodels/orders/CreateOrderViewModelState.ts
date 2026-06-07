"use client"

export type CreateOrderStatus = "loading" | "ready" | "saving" | "saved"

export type CreateOrderViewModelState = {
  status: CreateOrderStatus
  branchOptions: {
    id: string
    name: string
    address: string
    latitude: number | null
    longitude: number | null
  }[]
  bookOptions: {
    id: string
    title: string
    isbn: string
    author: string
    translator: string | null
    category: string
    price: number
  }[]
  showBranchField: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

"use client"

export type EditOrderStatus =
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

export type EditOrderViewModelState = {
  status: EditOrderStatus
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
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

"use client"

import type { Category } from "@/domain/entities/category/Category"
export type CategoriesStatus = "idle" | "loading" | "ready" | "error"
export type CategoryFormMode = "create" | "edit" | null

export type CategoriesViewModelState = {
  status: CategoriesStatus
  categories: Category[]
  filteredCategories: Category[]
  searchQuery: string
  statusFilter: "all" | "active" | "inactive"
  formMode: CategoryFormMode
  editingCategoryId: string | null
  error: string | null
  formError: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isDeleting: boolean
  isFormOpen: boolean
  isConcatOpen: boolean
  isConcating: boolean
  concatError: string | null
}

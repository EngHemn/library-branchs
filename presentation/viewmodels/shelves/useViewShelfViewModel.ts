"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import {
  filterShelfBooks,
  getShelfBookCategoryOptions,
  getShelfBookLanguageOptions,
  type ShelfBookCategoryFilter,
  type ShelfBookLanguageFilter,
} from "@/domain/services/shelves/filterShelfBooks"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"
import { getShelfDashboardBranchScope } from "@/lib/shelfBranchScope"
import type {
  ViewShelfStatus,
  ViewShelfViewModelState,
} from "./ViewShelfViewModelState"

type ViewShelfViewModel = {
  state: ViewShelfViewModelState
  setSearchQuery: (value: string) => void
  setCategoryFilter: (value: ShelfBookCategoryFilter) => void
  setLanguageFilter: (value: ShelfBookLanguageFilter) => void
  openDeleteShelfBookDialog: (shelfBookId: string, bookTitle: string) => void
  closeDeleteShelfBookDialog: () => void
  confirmDeleteShelfBook: () => Promise<void>
  reload: () => Promise<void>
}

export function useViewShelfViewModel(
  shelfId: string,
  authUseCase: AuthUseCase,
  shelfManagementUseCase: ShelfManagementUseCase
): ViewShelfViewModel {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] =
    useState<ShelfBookCategoryFilter>("all")
  const [languageFilter, setLanguageFilter] =
    useState<ShelfBookLanguageFilter>("all")
  const [deleteShelfBookDialog, setDeleteShelfBookDialog] = useState<{
    shelfBookId: string
    bookTitle: string
  } | null>(null)
  const [deleteShelfBookError, setDeleteShelfBookError] = useState<string | null>(
    null
  )

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const shelfQuery = useQuery({
    queryKey: ["shelf", shelfId],
    queryFn: async () => {
      const result = await shelfManagementUseCase.getShelfById(shelfId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const booksQuery = useQuery({
    queryKey: ["shelfBooks", shelfId],
    queryFn: async () => {
      const result = await shelfManagementUseCase.getShelfBooks(shelfId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: shelfQuery.isSuccess && shelfQuery.data !== null,
  })

  const deleteMutation = useMutation({
    mutationFn: async (shelfBookId: string) => {
      const result = await shelfManagementUseCase.deleteShelfBook(
        shelfId,
        shelfBookId
      )
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["shelfBooks", shelfId] })
      void queryClient.invalidateQueries({ queryKey: ["shelf", shelfId] })
      void queryClient.invalidateQueries({ queryKey: ["shelves"] })
      setDeleteShelfBookDialog(null)
      setDeleteShelfBookError(null)
    },
    onError: (err: Error) => setDeleteShelfBookError(err.message),
  })

  async function reload(): Promise<void> {
    await Promise.all([
      userQuery.refetch(),
      shelfQuery.refetch(),
      booksQuery.refetch(),
    ])
  }

  function openDeleteShelfBookDialog(
    shelfBookId: string,
    bookTitle: string
  ): void {
    setDeleteShelfBookError(null)
    setDeleteShelfBookDialog({ shelfBookId, bookTitle })
  }

  function closeDeleteShelfBookDialog(): void {
    setDeleteShelfBookDialog(null)
    setDeleteShelfBookError(null)
  }

  async function confirmDeleteShelfBook(): Promise<void> {
    if (!deleteShelfBookDialog) return
    await deleteMutation.mutateAsync(deleteShelfBookDialog.shelfBookId)
  }

  const user = userQuery.data
  const showBranchField = user
    ? (getShelfDashboardBranchScope(user).showBranchFilter ?? false)
    : false

  const books = booksQuery.data ?? []
  const filteredBooks = filterShelfBooks(
    books,
    { searchQuery, categoryFilter, languageFilter },
    (book) => formatShelfLocationParts(book.locationParts)
  )
  const categoryOptions = getShelfBookCategoryOptions(books)
  const languageOptions = getShelfBookLanguageOptions(books)

  const status: ViewShelfStatus =
    userQuery.isError || shelfQuery.isError
      ? "error"
      : userQuery.isLoading || shelfQuery.isLoading
        ? "loading"
        : shelfQuery.isSuccess && shelfQuery.data === null
          ? "not-found"
          : shelfQuery.isSuccess && shelfQuery.data
            ? "loaded"
            : "loading"

  const state: ViewShelfViewModelState = {
    status,
    shelf: shelfQuery.data ?? null,
    books,
    filteredBooks,
    searchQuery,
    categoryFilter,
    languageFilter,
    categoryOptions,
    languageOptions,
    error: shelfQuery.error?.message ?? userQuery.error?.message ?? null,
    booksError: booksQuery.error?.message ?? null,
    showBranchField,
    deleteShelfBookDialog,
    deleteShelfBookError,
    isDeletingShelfBook: deleteMutation.isPending,
    isLoading: status === "loading",
    isBooksLoading: booksQuery.isLoading,
    isLoaded: status === "loaded",
    isNotFound: status === "not-found",
    isError: status === "error",
  }

  return {
    state,
    setSearchQuery,
    setCategoryFilter,
    setLanguageFilter,
    openDeleteShelfBookDialog,
    closeDeleteShelfBookDialog,
    confirmDeleteShelfBook,
    reload,
  }
}

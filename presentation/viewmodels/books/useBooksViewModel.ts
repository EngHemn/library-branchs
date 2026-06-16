"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fakeBranches } from "@/data/fake/fakeBranches"
import type { Book } from "@/domain/entities/book/Book"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import {
  matchesBookShelfLocationFilter,
} from "@/lib/bookLocationForm"
import {
  getDashboardBranchScope,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"
import { isBranchScopedBooksUser } from "@/lib/bookBranchScope"
import { useShelfLocationOptionsMutations } from "@/presentation/viewmodels/shelves/useShelfLocationOptionsMutations"
import type {
  BookAuthorFilter,
  BookBranchFilter,
  BookBranchFilterOption,
  BookCategoryFilter,
  BookFilterState,
  BookTranslatorFilter,
  BooksManagementDialog,
  BooksPageStatus,
  BooksViewModelState,
} from "./BooksViewModelState"

type BooksViewModel = {
  state: BooksViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  setSearchQuery: (searchQuery: string) => void
  setCategoryFilter: (categoryFilter: BookCategoryFilter) => void
  setAuthorFilter: (authorFilter: BookAuthorFilter) => void
  setTranslatorFilter: (translatorFilter: BookTranslatorFilter) => void
  setBranchFilter: (branchFilter: BookBranchFilter) => void
  setLocationFilter: (locationValues: Record<string, string>) => void
  clearFilters: () => void
  addLocationValue: (stepId: string, value: string) => Promise<void>
  updateLocationValue: (
    stepId: string,
    currentValue: string,
    value: string
  ) => Promise<void>
  deleteLocationValue: (stepId: string, value: string) => Promise<void>
  addLocationStep: (label: string) => Promise<void>
  updateLocationStep: (stepId: string, label: string) => Promise<void>
  deleteLocationStep: (stepId: string) => Promise<void>
  closeDialog: () => void
  deleteBook: (bookId: string) => Promise<void>
}

const defaultFilters: BookFilterState = {
  searchQuery: "",
  categoryFilter: "all",
  authorFilter: "all",
  translatorFilter: "all",
  branchFilter: "all",
  locationValues: {},
}

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

function resolveBranchFilterId(
  branchFilter: BookBranchFilter,
  userBranchId: string
): string {
  return branchFilter === "current" ? userBranchId : branchFilter
}

function getBranchFilterOptions(user: User): BookBranchFilterOption[] {
  if (isBranchScopedBooksUser(user)) {
    return []
  }

  const userBranchId = resolveUserBranchId(user)
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)

  const otherBranches = branchScope.branches
    .filter((branch) => branch.id !== userBranchId)
    .map((branch) => ({ value: branch.id, label: branch.name }))
    .sort((left, right) => left.label.localeCompare(right.label))

  return [
    { value: "all", label: "All Branches" },
    { value: "current", label: "Current Branch" },
    ...otherBranches,
  ]
}

function matchesBookBranchFilter(
  book: Book,
  branchFilter: BookBranchFilter,
  user: User
): boolean {
  const userBranchId = resolveUserBranchId(user)

  if (isBranchScopedBooksUser(user)) {
    return book.branchId === userBranchId
  }

  if (branchFilter === "all") {
    return true
  }

  const effectiveBranchId = resolveBranchFilterId(branchFilter, userBranchId)
  return book.branchId === effectiveBranchId
}

function matchesBookSearch(book: Book, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  if (!normalizedQuery) return true
  return [book.title, book.isbn, book.author, book.category, book.shelfHint].some(
    (value) => value.toLowerCase().includes(normalizedQuery)
  )
}

function getUniqueValues(books: Book[], accessor: (book: Book) => string | null): string[] {
  const valueSet = new Set<string>()
  for (const book of books) {
    const value = accessor(book)
    if (value) valueSet.add(value)
  }
  return Array.from(valueSet).sort()
}

export function useBooksViewModel(
  authUseCase: AuthUseCase,
  getBooksUseCase: GetBooksUseCase,
  shelfManagementUseCase: ShelfManagementUseCase
): BooksViewModel {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<BookFilterState>(defaultFilters)
  const [dialog, setDialog] = useState<BooksManagementDialog>(null)
  const locationMutations = useShelfLocationOptionsMutations(
    shelfManagementUseCase
  )

  const locationOptionsQuery = useQuery({
    queryKey: ["shelfLocationOptions"],
    queryFn: async () => {
      const result = await shelfManagementUseCase.getLocationOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const result = await getBooksUseCase.getBooks()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const deleteBookMutation = useMutation({
    mutationFn: async (bookId: string) => {
      const result = await getBooksUseCase.deleteBook(bookId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
    onError: (err: Error) =>
      setDialog({ title: "Book action unavailable", description: err.message }),
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const result = await authUseCase.logout()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
    onError: (err: Error) =>
      setDialog({ title: "Logout failed", description: err.message }),
  })

  async function reload(): Promise<void> {
    await Promise.all([userQuery.refetch(), booksQuery.refetch()])
  }

  async function logout(): Promise<void> {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // error handled in onError callback
    }
  }

  async function deleteBook(bookId: string): Promise<void> {
    try {
      await deleteBookMutation.mutateAsync(bookId)
    } catch {
      // error handled in onError callback
    }
  }

  function setSearchQuery(searchQuery: string): void {
    setFilters((current) => ({ ...current, searchQuery }))
  }

  function setCategoryFilter(categoryFilter: BookCategoryFilter): void {
    setFilters((current) => ({ ...current, categoryFilter }))
  }

  function setAuthorFilter(authorFilter: BookAuthorFilter): void {
    setFilters((current) => ({ ...current, authorFilter }))
  }

  function setTranslatorFilter(translatorFilter: BookTranslatorFilter): void {
    setFilters((current) => ({ ...current, translatorFilter }))
  }

  function setBranchFilter(branchFilter: BookBranchFilter): void {
    setFilters((current) => ({ ...current, branchFilter }))
  }

  function setLocationFilter(locationValues: Record<string, string>): void {
    setFilters((current) => ({ ...current, locationValues }))
  }

  async function addLocationValue(stepId: string, value: string): Promise<void> {
    locationMutations.clearError()
    await locationMutations.addLocationValue(stepId, value)
  }

  async function updateLocationValue(
    stepId: string,
    currentValue: string,
    value: string
  ): Promise<void> {
    locationMutations.clearError()
    await locationMutations.updateLocationValue(stepId, currentValue, value)
  }

  async function deleteLocationValue(
    stepId: string,
    value: string
  ): Promise<void> {
    locationMutations.clearError()
    await locationMutations.deleteLocationValue(stepId, value)
  }

  async function addLocationStep(label: string): Promise<void> {
    locationMutations.clearError()
    await locationMutations.addLocationStep(label)
  }

  async function updateLocationStep(
    stepId: string,
    label: string
  ): Promise<void> {
    locationMutations.clearError()
    await locationMutations.updateLocationStep(stepId, label)
  }

  async function deleteLocationStep(stepId: string): Promise<void> {
    locationMutations.clearError()
    await locationMutations.deleteLocationStep(stepId)
  }

  function clearFilters(): void {
    setFilters(defaultFilters)
  }

  function closeDialog(): void {
    setDialog(null)
  }

  const isLoading =
    userQuery.isLoading || booksQuery.isLoading || logoutMutation.isPending
  const isError = userQuery.isError || booksQuery.isError
  const user = userQuery.data ?? null
  const books = booksQuery.data ?? []

  const status: BooksPageStatus = isLoading
    ? "loading"
    : isError
      ? "error"
      : user === null
        ? "unauthenticated"
        : "success"

  const categories = getUniqueValues(books, (book) => book.category)
  const authors = getUniqueValues(books, (book) => book.author)
  const translators = getUniqueValues(books, (book) => book.translator)
  const branchFilterOptions = user ? getBranchFilterOptions(user) : []
  const locationOptions = locationOptionsQuery.data ?? null

  const filteredBooks = books.filter(
    (book) =>
      matchesBookSearch(book, filters.searchQuery) &&
      (filters.categoryFilter === "all" ||
        book.category === filters.categoryFilter) &&
      (filters.authorFilter === "all" ||
        book.author === filters.authorFilter) &&
      (filters.translatorFilter === "all" ||
        book.translator === filters.translatorFilter) &&
      (user ? matchesBookBranchFilter(book, filters.branchFilter, user) : true) &&
      (locationOptions
        ? matchesBookShelfLocationFilter(
            book.shelfHint,
            locationOptions.steps,
            filters.locationValues
          )
        : true)
  )

  const showBranchFilter = user ? !isBranchScopedBooksUser(user) : false

  const state: BooksViewModelState = {
    status,
    user,
    books,
    filteredBooks,
    categories,
    authors,
    translators,
    branchFilterOptions,
    locationOptions,
    locationManageError: locationMutations.error,
    isManagingLocation: locationMutations.isPending,
    filters,
    showBranchFilter,
    dialog,
    error: isError
      ? (userQuery.error?.message ?? booksQuery.error?.message ?? null)
      : null,
    isLoading,
    isReady: status === "success",
    isUnauthenticated: status === "unauthenticated",
  }

  return {
    state,
    reload,
    logout,
    setSearchQuery,
    setCategoryFilter,
    setAuthorFilter,
    setTranslatorFilter,
    setBranchFilter,
    setLocationFilter,
    clearFilters,
    addLocationValue,
    updateLocationValue,
    deleteLocationValue,
    addLocationStep,
    updateLocationStep,
    deleteLocationStep,
    closeDialog,
    deleteBook,
  }
}

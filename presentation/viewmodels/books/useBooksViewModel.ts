"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Book } from "@/domain/entities/book/Book"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { BookAuthorFilter, BookBranchFilter, BookCategoryFilter, BookFilterState, BookTranslatorFilter, BooksManagementDialog, BooksPageStatus, BooksViewModelState } from "./BooksViewModelState"

type BooksViewModel = {
  state: BooksViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  setSearchQuery: (searchQuery: string) => void
  setCategoryFilter: (categoryFilter: BookCategoryFilter) => void
  setAuthorFilter: (authorFilter: BookAuthorFilter) => void
  setTranslatorFilter: (translatorFilter: BookTranslatorFilter) => void
  setBranchFilter: (branchFilter: BookBranchFilter) => void
  closeDialog: () => void
  deleteBook: (bookId: string) => Promise<void>
}

const defaultFilters: BookFilterState = {
  searchQuery: "",
  categoryFilter: "all",
  authorFilter: "all",
  translatorFilter: "all",
  branchFilter: "all",
}

function matchesBookSearch(book: Book, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  if (!normalizedQuery) return true
  return [book.title, book.isbn].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
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
  getBooksUseCase: GetBooksUseCase
): BooksViewModel {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<BookFilterState>(defaultFilters)
  const [dialog, setDialog] = useState<BooksManagementDialog>(null)

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
  const branches = getUniqueValues(books, (book) => book.firstAddedBranch)

  const filteredBooks = books.filter(
    (book) =>
      matchesBookSearch(book, filters.searchQuery) &&
      (filters.categoryFilter === "all" ||
        book.category === filters.categoryFilter) &&
      (filters.authorFilter === "all" ||
        book.author === filters.authorFilter) &&
      (filters.translatorFilter === "all" ||
        book.translator === filters.translatorFilter) &&
      (filters.branchFilter === "all" ||
        book.firstAddedBranch === filters.branchFilter)
  )

  const showBranchFilter = user?.branchType !== "sub"

  const state: BooksViewModelState = {
    status,
    user,
    books,
    filteredBooks,
    categories,
    authors,
    translators,
    branches,
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
    closeDialog,
    deleteBook,
  }
}

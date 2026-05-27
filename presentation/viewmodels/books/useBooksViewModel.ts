"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { Book } from "@/domain/entities/book/Book"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"

type BookCategoryFilter = "all" | string
type BookAuthorFilter = "all" | string
type BookTranslatorFilter = "all" | string
type BookBranchFilter = "all" | string

type BookFilterState = {
  searchQuery: string
  categoryFilter: BookCategoryFilter
  authorFilter: BookAuthorFilter
  translatorFilter: BookTranslatorFilter
  branchFilter: BookBranchFilter
}

type BooksManagementDialog = {
  title: string
  description: string
} | null

type BooksPageStatus =
  | "idle"
  | "loading"
  | "success"
  | "unauthenticated"
  | "error"

type BooksViewModelState = {
  status: BooksPageStatus
  user: User | null
  books: Book[]
  filteredBooks: Book[]
  categories: string[]
  authors: string[]
  translators: string[]
  branches: string[]
  filters: BookFilterState
  dialog: BooksManagementDialog
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
}

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

  if (!normalizedQuery) {
    return true
  }

  return [book.title, book.isbn].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  )
}

function getUniqueValues(books: Book[], accessor: (book: Book) => string | null): string[] {
  const valueSet = new Set<string>()
  for (const book of books) {
    const value = accessor(book)
    if (value) {
      valueSet.add(value)
    }
  }
  return Array.from(valueSet).sort()
}

export function useBooksViewModel(
  authUseCase: AuthUseCase,
  getBooksUseCase: GetBooksUseCase
): BooksViewModel {
  const [status, setStatus] = useState<BooksPageStatus>("idle")
  const [user, setUser] = useState<User | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [filters, setFilters] = useState<BookFilterState>(defaultFilters)
  const [dialog, setDialog] = useState<BooksManagementDialog>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async (): Promise<void> => {
    setStatus("loading")
    setError(null)

    const currentUserResult = await authUseCase.getCurrentUser()

    if (!currentUserResult.success) {
      setStatus("error")
      setUser(null)
      setError(currentUserResult.error)
      return
    }

    if (!currentUserResult.data) {
      setStatus("unauthenticated")
      setUser(null)
      return
    }

    const booksResult = await getBooksUseCase.getBooks()

    if (!booksResult.success) {
      setStatus("error")
      setError(booksResult.error)
      return
    }

    setUser(currentUserResult.data)
    setBooks(booksResult.data)
    setStatus("success")
  }, [authUseCase, getBooksUseCase])

  const logout = useCallback(async (): Promise<void> => {
    setStatus("loading")

    const result = await authUseCase.logout()

    if (!result.success) {
      setStatus("error")
      setError(result.error)
      return
    }

    setUser(null)
    setStatus("unauthenticated")
  }, [authUseCase])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reload()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [reload])

  const setSearchQuery = useCallback((searchQuery: string): void => {
    setFilters((current) => ({ ...current, searchQuery }))
  }, [])

  const setCategoryFilter = useCallback(
    (categoryFilter: BookCategoryFilter): void => {
      setFilters((current) => ({ ...current, categoryFilter }))
    },
    []
  )

  const setAuthorFilter = useCallback(
    (authorFilter: BookAuthorFilter): void => {
      setFilters((current) => ({ ...current, authorFilter }))
    },
    []
  )

  const setTranslatorFilter = useCallback(
    (translatorFilter: BookTranslatorFilter): void => {
      setFilters((current) => ({ ...current, translatorFilter }))
    },
    []
  )

  const setBranchFilter = useCallback(
    (branchFilter: BookBranchFilter): void => {
      setFilters((current) => ({ ...current, branchFilter }))
    },
    []
  )

  const closeDialog = useCallback((): void => {
    setDialog(null)
  }, [])

  const deleteBook = useCallback(
    async (bookId: string): Promise<void> => {
      const result = await getBooksUseCase.deleteBook(bookId)

      if (!result.success) {
        setDialog({
          title: "Book action unavailable",
          description: result.error,
        })
        return
      }

      setBooks((current) => current.filter((book) => book.id !== bookId))
    },
    [getBooksUseCase]
  )

  const categories = useMemo(
    () => getUniqueValues(books, (book) => book.category),
    [books]
  )

  const authors = useMemo(
    () => getUniqueValues(books, (book) => book.author),
    [books]
  )

  const translators = useMemo(
    () => getUniqueValues(books, (book) => book.translator),
    [books]
  )

  const branches = useMemo(
    () => getUniqueValues(books, (book) => book.firstAddedBranch),
    [books]
  )

  const filteredBooks = useMemo(
    () =>
      books.filter(
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
      ),
    [books, filters]
  )

  const state = useMemo<BooksViewModelState>(
    () => ({
      status,
      user,
      books,
      filteredBooks,
      categories,
      authors,
      translators,
      branches,
      filters,
      dialog,
      error: status === "error" ? error : null,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "success",
      isUnauthenticated: status === "unauthenticated",
    }),
    [
      authors,
      books,
      branches,
      categories,
      dialog,
      error,
      filteredBooks,
      filters,
      status,
      translators,
      user,
    ]
  )

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

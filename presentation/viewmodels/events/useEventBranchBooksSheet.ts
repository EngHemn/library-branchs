"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { EventBranchBook } from "@/domain/entities/event/EventBranchBook"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"

type AsyncStatus = "idle" | "loading" | "success" | "error"
type EventBooksFilter = "all" | string

type EventBranchSelection = {
  eventId: string
  eventName: string
  branchId: string
  branchName: string
}

type EventBranchBooksSheet = {
  selection: EventBranchSelection | null
  isOpen: boolean
  books: EventBranchBook[]
  booksStatus: AsyncStatus
  booksError: string | null
  searchQuery: string
  languageFilter: EventBooksFilter
  categoryFilter: EventBooksFilter
  authorFilter: EventBooksFilter
  translatorFilter: EventBooksFilter
  languages: string[]
  categories: string[]
  authors: string[]
  translators: string[]
  open: (selection: EventBranchSelection) => void
  close: () => void
  setIsOpen: (open: boolean) => void
  setSearchQuery: (value: string) => void
  setLanguageFilter: (value: EventBooksFilter) => void
  setCategoryFilter: (value: EventBooksFilter) => void
  setAuthorFilter: (value: EventBooksFilter) => void
  setTranslatorFilter: (value: EventBooksFilter) => void
  resetFilters: () => void
}

function getUniqueValues(
  books: EventBranchBook[],
  accessor: (book: EventBranchBook) => string | null
): string[] {
  const values = new Set<string>()

  for (const book of books) {
    const value = accessor(book)
    if (value) {
      values.add(value)
    }
  }

  return Array.from(values).sort()
}

function matchesBranchBookSearch(book: EventBranchBook, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return (
    book.title.toLowerCase().includes(normalizedQuery) ||
    book.author.toLowerCase().includes(normalizedQuery) ||
    book.isbn.toLowerCase().includes(normalizedQuery) ||
    book.category.toLowerCase().includes(normalizedQuery) ||
    book.language.toLowerCase().includes(normalizedQuery) ||
    (book.translator?.toLowerCase().includes(normalizedQuery) ?? false)
  )
}

function filterBranchBooks(
  books: EventBranchBook[],
  searchQuery: string,
  languageFilter: EventBooksFilter,
  categoryFilter: EventBooksFilter,
  authorFilter: EventBooksFilter,
  translatorFilter: EventBooksFilter
): EventBranchBook[] {
  return books.filter((book) => {
    if (languageFilter !== "all" && book.language !== languageFilter) {
      return false
    }

    if (categoryFilter !== "all" && book.category !== categoryFilter) {
      return false
    }

    if (authorFilter !== "all" && book.author !== authorFilter) {
      return false
    }

    if (translatorFilter !== "all") {
      if (!book.translator || book.translator !== translatorFilter) {
        return false
      }
    }

    return matchesBranchBookSearch(book, searchQuery)
  })
}

export function useEventBranchBooksSheet(
  getEventsUseCase: GetEventsUseCase
): EventBranchBooksSheet {
  const [selection, setSelection] = useState<EventBranchSelection | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [languageFilter, setLanguageFilter] = useState<EventBooksFilter>("all")
  const [categoryFilter, setCategoryFilter] = useState<EventBooksFilter>("all")
  const [authorFilter, setAuthorFilter] = useState<EventBooksFilter>("all")
  const [translatorFilter, setTranslatorFilter] =
    useState<EventBooksFilter>("all")

  const booksQuery = useQuery({
    queryKey: [
      "event-branch-books",
      selection?.eventId,
      selection?.branchId,
    ],
    queryFn: async () => {
      if (!selection) return []
      const result = await getEventsUseCase.getEventBranchBooks(
        selection.eventId,
        selection.branchId
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: selection !== null && isOpen,
  })

  const rawBooks = isOpen && selection ? (booksQuery.data ?? []) : []

  const booksStatus: AsyncStatus =
    !isOpen || !selection
      ? "idle"
      : booksQuery.isSuccess
        ? "success"
        : booksQuery.isError
          ? "error"
          : "loading"

  const booksError = isOpen && selection ? (booksQuery.error?.message ?? null) : null

  const filteredBooks = filterBranchBooks(
    rawBooks,
    searchQuery,
    languageFilter,
    categoryFilter,
    authorFilter,
    translatorFilter
  )

  const languages = getUniqueValues(rawBooks, (book) => book.language)
  const categories = getUniqueValues(rawBooks, (book) => book.category)
  const authors = getUniqueValues(rawBooks, (book) => book.author)
  const translators = getUniqueValues(rawBooks, (book) => book.translator)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        close()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  function open(nextSelection: EventBranchSelection): void {
    setSelection(nextSelection)
    setIsOpen(true)
    setSearchQuery("")
    setLanguageFilter("all")
    setCategoryFilter("all")
    setAuthorFilter("all")
    setTranslatorFilter("all")
  }

  function close(): void {
    setIsOpen(false)
    setSelection(null)
    setSearchQuery("")
    setLanguageFilter("all")
    setCategoryFilter("all")
    setAuthorFilter("all")
    setTranslatorFilter("all")
  }

  function resetFilters(): void {
    setSearchQuery("")
    setLanguageFilter("all")
    setCategoryFilter("all")
    setAuthorFilter("all")
    setTranslatorFilter("all")
  }

  return {
    selection,
    isOpen,
    books: filteredBooks,
    booksStatus,
    booksError,
    searchQuery,
    languageFilter,
    categoryFilter,
    authorFilter,
    translatorFilter,
    languages,
    categories,
    authors,
    translators,
    open,
    close,
    setIsOpen: (openState: boolean) => {
      if (!openState) {
        close()
      }
    },
    setSearchQuery,
    setLanguageFilter,
    setCategoryFilter,
    setAuthorFilter,
    setTranslatorFilter,
    resetFilters,
  }
}

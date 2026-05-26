"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"

type ViewStaffStatus = "idle" | "loading" | "loaded" | "not-found" | "error"

type ViewStaffTabKey = "details" | "books" | "authors" | "translators"

type ViewStaffViewModelState = {
  status: ViewStaffStatus
  staffMember: StaffMember | null
  books: Book[]
  authors: Author[]
  translators: Translator[]
  activeTab: ViewStaffTabKey
  searchQuery: string
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

type ViewStaffViewModel = {
  state: ViewStaffViewModelState
  setActiveTab: (tab: ViewStaffTabKey) => void
  setSearchQuery: (query: string) => void
}

function filterBySearch<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string
): T[] {
  if (!query.trim()) {
    return items
  }

  const lowerQuery = query.toLowerCase().trim()

  return items.filter((item) =>
    getSearchableText(item).toLowerCase().includes(lowerQuery)
  )
}

export function useViewStaffViewModel(
  staffId: string,
  staffManagementUseCase: StaffManagementUseCase,
  branchDetailUseCase: BranchDetailUseCase
): ViewStaffViewModel {
  const [status, setStatus] = useState<ViewStaffStatus>("idle")
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [translators, setTranslators] = useState<Translator[]>([])
  const [activeTab, setActiveTab] = useState<ViewStaffTabKey>("details")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadStaffDetail(): Promise<void> {
      setStatus("loading")
      setError(null)

      const staffResult = await staffManagementUseCase.getStaffById(staffId)

      if (cancelled) return

      if (!staffResult.success) {
        setStatus("error")
        setError(staffResult.error)
        return
      }

      if (!staffResult.data) {
        setStatus("not-found")
        return
      }

      const member = staffResult.data
      setStaffMember(member)

      const [booksResult, authorsResult, translatorsResult] =
        await Promise.all([
          branchDetailUseCase.getBooks(member.branchId),
          branchDetailUseCase.getAuthors(member.branchId),
          branchDetailUseCase.getTranslators(member.branchId),
        ])

      if (cancelled) return

      if (booksResult.success) setBooks(booksResult.data)
      if (authorsResult.success) setAuthors(authorsResult.data)
      if (translatorsResult.success) setTranslators(translatorsResult.data)

      setStatus("loaded")
    }

    void loadStaffDetail()

    return () => {
      cancelled = true
    }
  }, [staffId, staffManagementUseCase, branchDetailUseCase])

  const handleSetActiveTab = useCallback((tab: ViewStaffTabKey): void => {
    setActiveTab(tab)
    setSearchQuery("")
  }, [])

  const filteredBooks = useMemo(
    () =>
      filterBySearch(books, searchQuery, (b) =>
        [b.title, b.category, b.author, b.translator ?? "", b.isbn].join(" ")
      ),
    [books, searchQuery]
  )

  const filteredAuthors = useMemo(
    () =>
      filterBySearch(authors, searchQuery, (a) =>
        [a.name, a.nationality].join(" ")
      ),
    [authors, searchQuery]
  )

  const filteredTranslators = useMemo(
    () =>
      filterBySearch(translators, searchQuery, (t) =>
        [t.name, t.language].join(" ")
      ),
    [translators, searchQuery]
  )

  const state = useMemo<ViewStaffViewModelState>(
    () => ({
      status,
      staffMember,
      books: filteredBooks,
      authors: filteredAuthors,
      translators: filteredTranslators,
      activeTab,
      searchQuery,
      error,
      isLoading: status === "idle" || status === "loading",
      isLoaded: status === "loaded",
      isNotFound: status === "not-found",
      isError: status === "error",
    }),
    [
      activeTab,
      error,
      filteredAuthors,
      filteredBooks,
      filteredTranslators,
      searchQuery,
      staffMember,
      status,
    ]
  )

  return {
    state,
    setActiveTab: handleSetActiveTab,
    setSearchQuery,
  }
}

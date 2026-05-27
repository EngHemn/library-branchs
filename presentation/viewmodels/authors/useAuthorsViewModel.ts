"use client"

import { useEffect, useState } from "react"

import type { Author } from "@/domain/entities/author/Author"
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"

type AuthorsStatus = "idle" | "loading" | "ready" | "error"

type AuthorsViewModelState = {
  status: AuthorsStatus
  authors: Author[]
  filteredAuthors: Author[]
  searchQuery: string
  statusFilter: "all" | "active" | "inactive"
  error: string | null
  isLoading: boolean
  isReady: boolean
  isDeleting: boolean
}

type AuthorsViewModel = {
  state: AuthorsViewModelState
  setSearchQuery: (value: string) => void
  setStatusFilter: (value: "all" | "active" | "inactive") => void
  deleteAuthor: (authorId: string) => Promise<void>
  reload: () => Promise<void>
}

export function useAuthorsViewModel(
  getAuthorsUseCase: GetAuthorsUseCase
): AuthorsViewModel {
  const [status, setStatus] = useState<AuthorsStatus>("idle")
  const [authors, setAuthors] = useState<Author[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  )
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function loadAuthors(): Promise<void> {
    await Promise.resolve()
    setStatus("loading")
    setError(null)
    const result = await getAuthorsUseCase.getAuthors()
    if (!result.success) {
      setAuthors([])
      setStatus("error")
      setError(result.error)
      return
    }
    setAuthors(result.data)
    setStatus("ready")
  }

  async function deleteAuthor(authorId: string): Promise<void> {
    setIsDeleting(true)
    setError(null)
    const result = await getAuthorsUseCase.deleteAuthor(authorId)
    if (!result.success) {
      setIsDeleting(false)
      setError(result.error)
      setStatus("error")
      return
    }

    await loadAuthors()
    setIsDeleting(false)
  }

  useEffect(() => {
    void loadAuthors()
  }, [getAuthorsUseCase])

  const filteredAuthors = authors.filter((author) => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      author.name.toLowerCase().includes(normalizedSearch) ||
      author.nationality.toLowerCase().includes(normalizedSearch)

    const matchesStatus =
      statusFilter === "all" ? true : author.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const state: AuthorsViewModelState = {
    status,
    authors,
    filteredAuthors,
    searchQuery,
    statusFilter,
    error,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "ready",
    isDeleting,
  }

  return {
    state,
    setSearchQuery,
    setStatusFilter,
    deleteAuthor,
    reload: loadAuthors,
  }
}

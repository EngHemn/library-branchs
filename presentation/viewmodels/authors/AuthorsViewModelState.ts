"use client"

import type { Author } from "@/domain/entities/author/Author"

export type AuthorsStatus = "idle" | "loading" | "ready" | "error"

export type AuthorsViewModelState = {
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

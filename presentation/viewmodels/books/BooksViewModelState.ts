"use client"

import type { Book } from "@/domain/entities/book/Book"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { User } from "@/domain/entities/User"

export type BookCategoryFilter = "all" | string
export type BookAuthorFilter = "all" | string
export type BookTranslatorFilter = "all" | string
export type BookBranchFilter = "all" | "current" | string

export type BookBranchFilterOption = {
  value: BookBranchFilter
  label: string
}

export type BookFilterState = {
  searchQuery: string
  categoryFilter: BookCategoryFilter
  authorFilter: BookAuthorFilter
  translatorFilter: BookTranslatorFilter
  branchFilter: BookBranchFilter
  locationValues: Record<string, string>
}

export type BooksManagementDialog = {
  title: string
  description: string
} | null

export type BooksPageStatus =
  | "idle"
  | "loading"
  | "success"
  | "unauthenticated"
  | "error"

export type BooksViewModelState = {
  status: BooksPageStatus
  user: User | null
  books: Book[]
  filteredBooks: Book[]
  categories: string[]
  authors: string[]
  translators: string[]
  branchFilterOptions: BookBranchFilterOption[]
  locationOptions: ShelfLocationOptions | null
  locationManageError: string | null
  isManagingLocation: boolean
  filters: BookFilterState
  showBranchFilter: boolean
  dialog: BooksManagementDialog
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
}

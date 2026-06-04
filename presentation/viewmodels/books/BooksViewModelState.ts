"use client"

import type { Book } from "@/domain/entities/book/Book"
import type { User } from "@/domain/entities/User"

export type BookCategoryFilter = "all" | string
export type BookAuthorFilter = "all" | string
export type BookTranslatorFilter = "all" | string
export type BookBranchFilter = "all" | string

export type BookFilterState = {
  searchQuery: string
  categoryFilter: BookCategoryFilter
  authorFilter: BookAuthorFilter
  translatorFilter: BookTranslatorFilter
  branchFilter: BookBranchFilter
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
  branches: string[]
  filters: BookFilterState
  dialog: BooksManagementDialog
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
}

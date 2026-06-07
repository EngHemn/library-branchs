"use client"

import type { Book } from "@/domain/entities/book/Book"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"

export type CreateBookStatus = "idle" | "loading" | "ready" | "saving" | "saved"

export type CreateBookViewModelState = {
  status: CreateBookStatus
  books: Book[]
  authors: string[]
  translators: string[]
  categories: string[]
  languages: string[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
  locationOptions: ShelfLocationOptions | null
  locationManageError: string | null
  isManagingLocation: boolean
}

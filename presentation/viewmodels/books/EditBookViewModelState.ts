"use client"

import type { Book } from "@/domain/entities/book/Book"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"

export type EditBookStatus =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

export type EditBookViewModelState = {
  status: EditBookStatus
  books: Book[]
  authors: string[]
  translators: string[]
  categories: string[]
  languages: string[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
  locationOptions: ShelfLocationOptions | null
  locationManageError: string | null
  isManagingLocation: boolean
}

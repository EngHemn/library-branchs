"use client"

import type { Book } from "@/domain/entities/book/Book"

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
}

"use client"

import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"

export type CreateBookStatus = "idle" | "loading" | "ready" | "saving" | "saved"

export type CreateBookViewModelState = {
  status: CreateBookStatus
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

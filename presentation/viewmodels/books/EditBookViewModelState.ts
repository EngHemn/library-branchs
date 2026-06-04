"use client"

import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"

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
}

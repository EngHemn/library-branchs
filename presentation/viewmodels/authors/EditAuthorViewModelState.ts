"use client"

import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"

export type EditAuthorStatus =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

export type EditAuthorViewModelState = {
  status: EditAuthorStatus
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

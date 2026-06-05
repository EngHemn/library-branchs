"use client"

import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"

export type CreateAuthorStatus = "ready" | "saving" | "saved"

export type CreateAuthorViewModelState = {
  status: CreateAuthorStatus
  error: string | null
  savedAuthorId: string | null
  isSaving: boolean
  isSaved: boolean
}

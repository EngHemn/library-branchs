"use client"

export type CreateTranslatorStatus = "ready" | "saving" | "saved"

export type CreateTranslatorViewModelState = {
  status: CreateTranslatorStatus
  error: string | null
  isSaving: boolean
  isSaved: boolean
}

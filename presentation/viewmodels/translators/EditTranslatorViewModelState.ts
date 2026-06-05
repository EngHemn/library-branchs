"use client"

export type EditTranslatorStatus =
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

export type EditTranslatorViewModelState = {
  status: EditTranslatorStatus
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

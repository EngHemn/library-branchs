"use client"

import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"

export type TranslatorDetailStatus =
  | "loading"
  | "loaded"
  | "not-found"
  | "error"

export type TranslatorDetailViewModelState = {
  status: TranslatorDetailStatus
  translator: TranslatorDetail | null
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

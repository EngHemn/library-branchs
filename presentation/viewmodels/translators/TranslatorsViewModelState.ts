"use client"

import type { Translator } from "@/domain/entities/translator/Translator"

export type TranslatorsStatus = "idle" | "loading" | "ready" | "error"
export type TranslatorLanguageFilter = "all" | string

export type TranslatorsViewModelState = {
  status: TranslatorsStatus
  translators: Translator[]
  filteredTranslators: Translator[]
  languages: string[]
  searchQuery: string
  statusFilter: "all" | "active" | "inactive"
  languageFilter: TranslatorLanguageFilter
  error: string | null
  isLoading: boolean
  isReady: boolean
  isDeleting: boolean
}

"use client"

import { useEffect, useMemo, useState } from "react"

import type { Translator } from "@/domain/entities/translator/Translator"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"

type TranslatorsStatus = "idle" | "loading" | "ready" | "error"
type TranslatorLanguageFilter = "all" | string

type TranslatorsViewModelState = {
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

type TranslatorsViewModel = {
  state: TranslatorsViewModelState
  setSearchQuery: (value: string) => void
  setStatusFilter: (value: "all" | "active" | "inactive") => void
  setLanguageFilter: (value: TranslatorLanguageFilter) => void
  deleteTranslator: (translatorId: string) => Promise<void>
  reload: () => Promise<void>
}

function getUniqueLanguages(translators: Translator[]): string[] {
  const values = new Set<string>()
  for (const translator of translators) {
    values.add(translator.language)
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b))
}

export function useTranslatorsViewModel(
  getTranslatorsUseCase: GetTranslatorsUseCase
): TranslatorsViewModel {
  const [status, setStatus] = useState<TranslatorsStatus>("idle")
  const [translators, setTranslators] = useState<Translator[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  )
  const [languageFilter, setLanguageFilter] =
    useState<TranslatorLanguageFilter>("all")
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function loadTranslators(): Promise<void> {
    await Promise.resolve()
    setStatus("loading")
    setError(null)
    const result = await getTranslatorsUseCase.getTranslators()
    if (!result.success) {
      setTranslators([])
      setStatus("error")
      setError(result.error)
      return
    }
    setTranslators(result.data)
    setStatus("ready")
  }

  async function deleteTranslator(translatorId: string): Promise<void> {
    setIsDeleting(true)
    setError(null)
    const result = await getTranslatorsUseCase.deleteTranslator(translatorId)
    if (!result.success) {
      setIsDeleting(false)
      setError(result.error)
      setStatus("error")
      return
    }

    await loadTranslators()
    setIsDeleting(false)
  }

  useEffect(() => {
    void loadTranslators()
  }, [getTranslatorsUseCase])

  const languages = useMemo(() => getUniqueLanguages(translators), [translators])

  const filteredTranslators = translators.filter((translator) => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      translator.name.toLowerCase().includes(normalizedSearch) ||
      translator.id.toLowerCase().includes(normalizedSearch)

    const matchesStatus =
      statusFilter === "all" ? true : translator.status === statusFilter

    const matchesLanguage =
      languageFilter === "all" ? true : translator.language === languageFilter

    return matchesSearch && matchesStatus && matchesLanguage
  })

  const state: TranslatorsViewModelState = {
    status,
    translators,
    filteredTranslators,
    languages,
    searchQuery,
    statusFilter,
    languageFilter,
    error,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "ready",
    isDeleting,
  }

  return {
    state,
    setSearchQuery,
    setStatusFilter,
    setLanguageFilter,
    deleteTranslator,
    reload: loadTranslators,
  }
}

"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [languageFilter, setLanguageFilter] = useState<TranslatorLanguageFilter>("all")

  const {
    data: translators,
    status: queryStatus,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["translators"],
    queryFn: async () => {
      const result = await getTranslatorsUseCase.getTranslators()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const {
    mutateAsync: deleteTranslatorAsync,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: async (translatorId: string) => {
      const result = await getTranslatorsUseCase.deleteTranslator(translatorId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["translators"] }),
  })

  async function deleteTranslator(translatorId: string): Promise<void> {
    try {
      await deleteTranslatorAsync(translatorId)
    } catch {
      // error captured in deleteError mutation state
    }
  }

  async function reload(): Promise<void> {
    await refetch()
  }

  const allTranslators = translators ?? []

  const languages = getUniqueLanguages(allTranslators)

  const filteredTranslators = allTranslators.filter((translator) => {
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

  const status: TranslatorsStatus =
    queryStatus === "success" ? "ready" :
    queryStatus === "error" ? "error" :
    "loading"

  const state: TranslatorsViewModelState = {
    status,
    translators: allTranslators,
    filteredTranslators,
    languages,
    searchQuery,
    statusFilter,
    languageFilter,
    error: deleteError?.message ?? queryError?.message ?? null,
    isLoading: queryStatus === "pending",
    isReady: queryStatus === "success",
    isDeleting,
  }

  return {
    state,
    setSearchQuery,
    setStatusFilter,
    setLanguageFilter,
    deleteTranslator,
    reload,
  }
}

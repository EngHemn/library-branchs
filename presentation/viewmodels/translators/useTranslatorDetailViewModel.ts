"use client"

import { useEffect, useState } from "react"

import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"

type TranslatorDetailStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "not-found"
  | "error"

type TranslatorDetailViewModelState = {
  status: TranslatorDetailStatus
  translator: TranslatorDetail | null
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

type TranslatorDetailViewModel = {
  state: TranslatorDetailViewModelState
  reload: () => Promise<void>
}

export function useTranslatorDetailViewModel(
  translatorId: string,
  getTranslatorsUseCase: GetTranslatorsUseCase
): TranslatorDetailViewModel {
  const [status, setStatus] = useState<TranslatorDetailStatus>("idle")
  const [translator, setTranslator] = useState<TranslatorDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadTranslator(): Promise<void> {
    await Promise.resolve()
    setStatus("loading")
    setError(null)
    const result = await getTranslatorsUseCase.getTranslatorById(translatorId)
    if (!result.success) {
      setTranslator(null)
      setStatus("error")
      setError(result.error)
      return
    }
    if (!result.data) {
      setTranslator(null)
      setStatus("not-found")
      return
    }
    setTranslator(result.data)
    setStatus("loaded")
  }

  useEffect(() => {
    void loadTranslator()
  }, [translatorId, getTranslatorsUseCase])

  const state: TranslatorDetailViewModelState = {
    status,
    translator,
    error,
    isLoading: status === "idle" || status === "loading",
    isLoaded: status === "loaded",
    isNotFound: status === "not-found",
    isError: status === "error",
  }

  return { state, reload: loadTranslator }
}

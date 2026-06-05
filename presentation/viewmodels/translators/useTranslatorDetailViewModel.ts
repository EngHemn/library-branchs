"use client"

import { useQuery } from "@tanstack/react-query"

import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import type { TranslatorDetailStatus, TranslatorDetailViewModelState } from "./TranslatorDetailViewModelState"

type TranslatorDetailViewModel = {
  state: TranslatorDetailViewModelState
  reload: () => Promise<void>
}

export function useTranslatorDetailViewModel(
  translatorId: string,
  getTranslatorsUseCase: GetTranslatorsUseCase
): TranslatorDetailViewModel {
  const { data, status: queryStatus, error: queryError, refetch } = useQuery({
    queryKey: ["translators", translatorId],
    queryFn: async () => {
      const result = await getTranslatorsUseCase.getTranslatorById(translatorId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  async function reload(): Promise<void> {
    await refetch()
  }

  const status: TranslatorDetailStatus =
    queryStatus === "error" ? "error" :
    queryStatus === "pending" ? "loading" :
    data === null ? "not-found" :
    "loaded"

  const state: TranslatorDetailViewModelState = {
    status,
    translator: data ?? null,
    error: queryError?.message ?? null,
    isLoading: status === "loading",
    isLoaded: status === "loaded",
    isNotFound: status === "not-found",
    isError: status === "error",
  }

  return { state, reload }
}

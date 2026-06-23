"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"

import {
  translatorFormSchema,
  type TranslatorFormInput,
  type TranslatorFormValues,
} from "@/domain/schemas/translatorFormSchema"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import type {
  CreateTranslatorStatus,
  CreateTranslatorViewModelState,
} from "./CreateTranslatorViewModelState"

type CreateTranslatorViewModel = {
  state: CreateTranslatorViewModelState
  form: ReturnType<typeof useForm<TranslatorFormValues>>
  save: (values: TranslatorFormValues) => Promise<void>
}

export function useCreateTranslatorViewModel(
  getTranslatorsUseCase: GetTranslatorsUseCase
): CreateTranslatorViewModel {
  const form = useForm<TranslatorFormInput, unknown, TranslatorFormValues>({
    resolver: zodResolver(translatorFormSchema),
    defaultValues: {
      name: "",
      language: "",
      status: "active",
      biography: "",
      imageUrl: null,
    },
  })

  const {
    mutateAsync,
    isPending: isSaving,
    isSuccess: isSaved,
    error: mutationError,
  } = useMutation({
    mutationFn: async (values: TranslatorFormValues) => {
      const result = await getTranslatorsUseCase.createTranslator(values)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  async function save(values: TranslatorFormValues): Promise<void> {
    try {
      await mutateAsync(values)
    } catch {
      // error captured in mutationError state
    }
  }

  const status: CreateTranslatorStatus = isSaved
    ? "saved"
    : isSaving
      ? "saving"
      : "ready"

  const state: CreateTranslatorViewModelState = {
    status,
    error: mutationError?.message ?? null,
    isSaving,
    isSaved,
  }

  return { state, form, save }
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  translatorFormSchema,
  type TranslatorFormInput,
  type TranslatorFormValues,
} from "@/domain/schemas/translatorFormSchema"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"

type CreateTranslatorStatus = "ready" | "saving" | "saved"

type CreateTranslatorViewModelState = {
  status: CreateTranslatorStatus
  error: string | null
  isSaving: boolean
  isSaved: boolean
}

type CreateTranslatorViewModel = {
  state: CreateTranslatorViewModelState
  form: ReturnType<typeof useForm<TranslatorFormValues>>
  save: (values: TranslatorFormValues) => Promise<void>
}

export function useCreateTranslatorViewModel(
  getTranslatorsUseCase: GetTranslatorsUseCase
): CreateTranslatorViewModel {
  const [status, setStatus] = useState<CreateTranslatorStatus>("ready")
  const [error, setError] = useState<string | null>(null)

  const form = useForm<TranslatorFormInput, unknown, TranslatorFormValues>({
    resolver: zodResolver(translatorFormSchema as never),
    defaultValues: {
      name: "",
      language: "",
      status: "active",
      biography: "",
    },
  })

  async function save(values: TranslatorFormValues): Promise<void> {
    setStatus("saving")
    setError(null)
    const result = await getTranslatorsUseCase.createTranslator(values)
    if (!result.success) {
      setStatus("ready")
      setError(result.error)
      return
    }
    setStatus("saved")
  }

  const state: CreateTranslatorViewModelState = {
    status,
    error,
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save }
}

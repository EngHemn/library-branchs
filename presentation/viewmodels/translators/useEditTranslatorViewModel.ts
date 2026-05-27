"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  translatorFormSchema,
  type TranslatorFormInput,
  type TranslatorFormValues,
} from "@/domain/schemas/translatorFormSchema"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"

type EditTranslatorStatus =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

type EditTranslatorViewModelState = {
  status: EditTranslatorStatus
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

type EditTranslatorViewModel = {
  state: EditTranslatorViewModelState
  form: ReturnType<
    typeof useForm<TranslatorFormInput, unknown, TranslatorFormValues>
  >
  save: (values: TranslatorFormValues) => Promise<void>
}

export function useEditTranslatorViewModel(
  translatorId: string,
  getTranslatorsUseCase: GetTranslatorsUseCase
): EditTranslatorViewModel {
  const [status, setStatus] = useState<EditTranslatorStatus>("idle")
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

  useEffect(() => {
    let cancelled = false

    async function loadTranslator(): Promise<void> {
      setStatus("loading")
      setError(null)
      const result = await getTranslatorsUseCase.getTranslatorById(translatorId)
      if (cancelled) return

      if (!result.success) {
        setStatus("error")
        setError(result.error)
        return
      }

      if (!result.data) {
        setStatus("not-found")
        return
      }

      form.reset({
        name: result.data.name,
        language: result.data.language,
        status: result.data.status,
        biography: result.data.biography,
      })
      setStatus("ready")
    }

    void loadTranslator()

    return () => {
      cancelled = true
    }
  }, [translatorId, getTranslatorsUseCase, form])

  async function save(values: TranslatorFormValues): Promise<void> {
    setStatus("saving")
    setError(null)
    const result = await getTranslatorsUseCase.updateTranslator({
      id: translatorId,
      ...values,
    })
    if (!result.success) {
      setStatus("ready")
      setError(result.error)
      return
    }
    setStatus("saved")
  }

  const state: EditTranslatorViewModelState = {
    status,
    error,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "ready",
    isNotFound: status === "not-found",
    isError: status === "error",
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save }
}

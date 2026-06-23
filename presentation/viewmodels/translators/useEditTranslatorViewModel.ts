"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  translatorFormSchema,
  type TranslatorFormInput,
  type TranslatorFormValues,
} from "@/domain/schemas/translatorFormSchema"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import type {
  EditTranslatorStatus,
  EditTranslatorViewModelState,
} from "./EditTranslatorViewModelState"

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
  const queryClient = useQueryClient()

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
    data,
    status: queryStatus,
    error: queryError,
  } = useQuery({
    queryKey: ["translators", translatorId],
    queryFn: async () => {
      const result = await getTranslatorsUseCase.getTranslatorById(translatorId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        language: data.language,
        status: data.status,
        biography: data.biography,
        imageUrl: data.imageUrl ?? null,
      })
    }
  }, [data, form])

  const {
    mutateAsync,
    isPending: isSaving,
    isSuccess: isSaved,
    error: mutationError,
  } = useMutation({
    mutationFn: async (values: TranslatorFormValues) => {
      const result = await getTranslatorsUseCase.updateTranslator({
        id: translatorId,
        ...values,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["translators", translatorId],
      }),
  })

  async function save(values: TranslatorFormValues): Promise<void> {
    try {
      await mutateAsync(values)
    } catch {
      // error captured in mutationError state
    }
  }

  const status: EditTranslatorStatus = isSaved
    ? "saved"
    : isSaving
      ? "saving"
      : queryStatus === "error"
        ? "error"
        : queryStatus === "pending"
          ? "loading"
          : data === null
            ? "not-found"
            : "ready"

  const state: EditTranslatorViewModelState = {
    status,
    error: mutationError?.message ?? queryError?.message ?? null,
    isLoading: status === "loading",
    isReady: status === "ready",
    isNotFound: status === "not-found",
    isError: status === "error",
    isSaving,
    isSaved,
  }

  return { state, form, save }
}

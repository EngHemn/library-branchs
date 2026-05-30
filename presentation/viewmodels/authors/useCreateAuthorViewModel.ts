"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"

import {
  authorFormSchema,
  type AuthorFormInput,
  type AuthorFormValues,
} from "@/domain/schemas/authorFormSchema"
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"

type CreateAuthorStatus = "ready" | "saving" | "saved"

type CreateAuthorViewModelState = {
  status: CreateAuthorStatus
  error: string | null
  savedAuthorId: string | null
  isSaving: boolean
  isSaved: boolean
}

type CreateAuthorViewModel = {
  state: CreateAuthorViewModelState
  form: ReturnType<typeof useForm<AuthorFormValues>>
  save: (values: AuthorFormValues) => Promise<void>
}

export function useCreateAuthorViewModel(
  getAuthorsUseCase: GetAuthorsUseCase
): CreateAuthorViewModel {
  const [savedAuthorId, setSavedAuthorId] = useState<string | null>(null)

  const form = useForm<AuthorFormInput, unknown, AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: "",
      nationality: "",
      dateOfBirth: "",
      status: "active",
      biography: "",
    },
  })

  const {
    mutateAsync,
    isPending: isSaving,
    isSuccess: isSaved,
    error: mutationError,
  } = useMutation({
    mutationFn: async (values: AuthorFormValues) => {
      const result = await getAuthorsUseCase.createAuthor(values)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (data) => {
      setSavedAuthorId(data.id)
    },
  })

  async function save(values: AuthorFormValues): Promise<void> {
    try {
      await mutateAsync(values)
    } catch {
      // error captured in mutationError state
    }
  }

  const status: CreateAuthorStatus = isSaved ? "saved" : isSaving ? "saving" : "ready"

  const state: CreateAuthorViewModelState = {
    status,
    error: mutationError?.message ?? null,
    savedAuthorId,
    isSaving,
    isSaved,
  }

  return { state, form, save }
}

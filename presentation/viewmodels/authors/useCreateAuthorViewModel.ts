"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
  const [status, setStatus] = useState<CreateAuthorStatus>("ready")
  const [error, setError] = useState<string | null>(null)

  const form = useForm<AuthorFormInput, unknown, AuthorFormValues>({
    resolver: zodResolver(authorFormSchema as never),
    defaultValues: {
      name: "",
      nationality: "",
      dateOfBirth: "",
      status: "active",
      biography: "",
    },
  })

  async function save(values: AuthorFormValues): Promise<void> {
    setStatus("saving")
    setError(null)
    const result = await getAuthorsUseCase.createAuthor(values)
    if (!result.success) {
      setStatus("ready")
      setError(result.error)
      return
    }
    setStatus("saved")
  }

  const state: CreateAuthorViewModelState = {
    status,
    error,
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save }
}

"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  authorFormSchema,
  type AuthorFormInput,
  type AuthorFormValues,
} from "@/domain/schemas/authorFormSchema"
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"

type EditAuthorStatus =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

type EditAuthorViewModelState = {
  status: EditAuthorStatus
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

type EditAuthorViewModel = {
  state: EditAuthorViewModelState
  form: ReturnType<
    typeof useForm<AuthorFormInput, unknown, AuthorFormValues>
  >
  save: (values: AuthorFormValues) => Promise<void>
}

export function useEditAuthorViewModel(
  authorId: string,
  getAuthorsUseCase: GetAuthorsUseCase
): EditAuthorViewModel {
  const [status, setStatus] = useState<EditAuthorStatus>("idle")
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

  useEffect(() => {
    let cancelled = false

    async function loadAuthor(): Promise<void> {
      setStatus("loading")
      setError(null)
      const result = await getAuthorsUseCase.getAuthorById(authorId)
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
        nationality: result.data.nationality,
        dateOfBirth: result.data.dateOfBirth,
        status: result.data.status,
        biography: result.data.biography,
      })
      setStatus("ready")
    }

    void loadAuthor()

    return () => {
      cancelled = true
    }
  }, [authorId, getAuthorsUseCase, form])

  async function save(values: AuthorFormValues): Promise<void> {
    setStatus("saving")
    setError(null)
    const result = await getAuthorsUseCase.updateAuthor({
      id: authorId,
      ...values,
    })
    if (!result.success) {
      setStatus("ready")
      setError(result.error)
      return
    }
    setStatus("saved")
  }

  const state: EditAuthorViewModelState = {
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

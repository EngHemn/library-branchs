"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  authorFormSchema,
  type AuthorFormInput,
  type AuthorFormValues,
} from "@/domain/schemas/authorFormSchema"
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import type {
  EditAuthorStatus,
  EditAuthorViewModelState,
} from "./EditAuthorViewModelState"

type EditAuthorViewModel = {
  state: EditAuthorViewModelState
  form: ReturnType<typeof useForm<AuthorFormInput, unknown, AuthorFormValues>>
  save: (values: AuthorFormValues) => Promise<void>
}

export function useEditAuthorViewModel(
  authorId: string,
  getAuthorsUseCase: GetAuthorsUseCase
): EditAuthorViewModel {
  const queryClient = useQueryClient()

  const form = useForm<AuthorFormInput, unknown, AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: "",
      nationality: "",
      dateOfBirth: "",
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
    queryKey: ["authors", authorId],
    queryFn: async () => {
      const result = await getAuthorsUseCase.getAuthorById(authorId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        nationality: data.nationality,
        dateOfBirth: data.dateOfBirth,
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
    mutationFn: async (values: AuthorFormValues) => {
      const result = await getAuthorsUseCase.updateAuthor({
        id: authorId,
        ...values,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["authors", authorId] }),
  })

  async function save(values: AuthorFormValues): Promise<void> {
    try {
      await mutateAsync(values)
    } catch {
      // error captured in mutationError state
    }
  }

  const status: EditAuthorStatus = isSaved
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

  const state: EditAuthorViewModelState = {
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

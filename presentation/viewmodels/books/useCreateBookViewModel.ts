"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  bookFormSchema,
  type BookFormValues,
} from "@/domain/schemas/bookFormSchema"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { CreateBookStatus, CreateBookViewModelState } from "./CreateBookViewModelState"

type CreateBookViewModel = {
  state: CreateBookViewModelState
  form: ReturnType<typeof useForm<BookFormValues>>
  save: (values: BookFormValues) => Promise<void>
  addLanguage: (name: string) => void
}

const DEFAULT_CATEGORIES = [
  "Software Engineering",
  "Fiction",
  "Novel",
  "Poetry",
  "History",
  "Philosophy",
  "Psychology",
  "Self-Help",
  "Productivity",
  "Memoir",
  "Science",
  "Biography",
]

const DEFAULT_LANGUAGES = ["English", "Kurdish", "Arabic", "Persian", "Turkish"]

export function useCreateBookViewModel(
  getBooksUseCase: GetBooksUseCase
): CreateBookViewModel {
  const queryClient = useQueryClient()
  const [languages, setLanguages] = useState<string[]>(DEFAULT_LANGUAGES)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      language: "",
      category: "",
      author: "",
      translator: "",
      isbn: "",
      description: "",
      pages: 0,
      publicationDate: "",
      coverUrl: null,
    },
  })

  const authorNamesQuery = useQuery({
    queryKey: ["authorNames"],
    queryFn: async () => {
      const result = await getBooksUseCase.getAuthorNames()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const translatorNamesQuery = useQuery({
    queryKey: ["translatorNames"],
    queryFn: async () => {
      const result = await getBooksUseCase.getTranslatorNames()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const createBookMutation = useMutation({
    mutationFn: async (values: BookFormValues) => {
      const result = await getBooksUseCase.createBook({
        ...values,
        coverUrl: values.coverUrl,
        shelfHint: "",
        price: 0,
        stock: 0,
        branchId: "",
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
    onError: (err: Error) => setError(err.message),
  })

  async function save(values: BookFormValues): Promise<void> {
    setError(null)
    try {
      await createBookMutation.mutateAsync(values)
    } catch {
      // error handled in onError callback
    }
  }

  function addLanguage(name: string): void {
    setLanguages((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }

  const isLoading = authorNamesQuery.isPending || translatorNamesQuery.isPending
  const isSaving = createBookMutation.isPending
  const isSaved = createBookMutation.isSuccess

  const status: CreateBookStatus = isSaved
    ? "saved"
    : isSaving
      ? "saving"
      : isLoading
        ? "loading"
        : "ready"

  const state: CreateBookViewModelState = {
    status,
    authors: authorNamesQuery.data ?? [],
    translators: translatorNamesQuery.data ?? [],
    categories: DEFAULT_CATEGORIES,
    languages,
    error,
    isLoading,
    isReady: status === "ready",
    isSaving,
    isSaved,
  }

  return { state, form, save, addLanguage }
}

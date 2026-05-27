"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  bookFormSchema,
  type BookFormValues,
} from "@/domain/schemas/bookFormSchema"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"

type CreateBookStatus = "idle" | "loading" | "ready" | "saving" | "saved"

type CreateBookViewModelState = {
  status: CreateBookStatus
  authors: string[]
  translators: string[]
  categories: string[]
  languages: string[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

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
  const [status, setStatus] = useState<CreateBookStatus>("idle")
  const [authors, setAuthors] = useState<string[]>([])
  const [translators, setTranslators] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [languages, setLanguages] = useState<string[]>(DEFAULT_LANGUAGES)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema as never),
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
    },
  })

  useEffect(() => {
    let cancelled = false

    async function loadData(): Promise<void> {
      setStatus("loading")

      const [authorResult, translatorResult] = await Promise.all([
        getBooksUseCase.getAuthorNames(),
        getBooksUseCase.getTranslatorNames(),
      ])

      if (cancelled) return

      if (authorResult.success) setAuthors(authorResult.data)
      if (translatorResult.success) setTranslators(translatorResult.data)

      setStatus("ready")
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [getBooksUseCase])

  const addLanguage = useCallback((name: string) => {
    setLanguages((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }, [])

  const save = useCallback(
    async (values: BookFormValues): Promise<void> => {
      setStatus("saving")
      setError(null)

      const result = await getBooksUseCase.createBook({
        ...values,
        shelfHint: "",
        price: 0,
        stock: 0,
        branchId: "",
      })

      if (!result.success) {
        setStatus("ready")
        setError(result.error)
        return
      }

      setStatus("saved")
    },
    [getBooksUseCase]
  )

  const state = useMemo<CreateBookViewModelState>(
    () => ({
      status,
      authors,
      translators,
      categories,
      languages,
      error,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "ready",
      isSaving: status === "saving",
      isSaved: status === "saved",
    }),
    [authors, categories, error, languages, status, translators]
  )

  return { state, form, save, addLanguage }
}

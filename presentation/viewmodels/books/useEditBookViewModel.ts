"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  bookFormSchema,
  type BookFormValues,
} from "@/domain/schemas/bookFormSchema"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"

type EditBookStatus =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

type EditBookViewModelState = {
  status: EditBookStatus
  authors: string[]
  translators: string[]
  categories: string[]
  languages: string[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

type EditBookViewModel = {
  state: EditBookViewModelState
  form: ReturnType<typeof useForm<BookFormValues>>
  save: (values: BookFormValues) => Promise<void>
  addAuthor: (name: string) => void
  addTranslator: (name: string) => void
  addCategory: (name: string) => void
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

export function useEditBookViewModel(
  bookId: string,
  getBooksUseCase: GetBooksUseCase
): EditBookViewModel {
  const [status, setStatus] = useState<EditBookStatus>("idle")
  const [authors, setAuthors] = useState<string[]>([])
  const [translators, setTranslators] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [languages, setLanguages] = useState<string[]>(DEFAULT_LANGUAGES)
  const [error, setError] = useState<string | null>(null)
  const originalBookRef = useRef<{ branchId: string; price: number; stock: number; shelfHint: string } | null>(null)

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
    },
  })

  useEffect(() => {
    let cancelled = false

    async function loadData(): Promise<void> {
      setStatus("loading")

      const [bookResult, authorResult, translatorResult] = await Promise.all([
        getBooksUseCase.getBookById(bookId),
        getBooksUseCase.getAuthorNames(),
        getBooksUseCase.getTranslatorNames(),
      ])

      if (cancelled) return

      if (!bookResult.success) {
        setStatus("error")
        setError(bookResult.error)
        return
      }

      if (!bookResult.data) {
        setStatus("not-found")
        return
      }

      if (authorResult.success) setAuthors(authorResult.data)
      if (translatorResult.success) setTranslators(translatorResult.data)

      const book = bookResult.data

      originalBookRef.current = {
        branchId: book.branchId,
        price: book.price,
        stock: book.stock,
        shelfHint: book.shelfHint,
      }

      form.reset({
        title: book.title,
        language: book.language,
        category: book.category,
        author: book.author,
        translator: book.translator ?? "",
        isbn: book.isbn,
        description: book.description,
        pages: book.pages,
        publicationDate: book.publicationDate,
      })

      setStatus("ready")
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [bookId, getBooksUseCase, form])

  const addAuthor = useCallback((name: string) => {
    setAuthors((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }, [])

  const addTranslator = useCallback((name: string) => {
    setTranslators((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }, [])

  const addCategory = useCallback((name: string) => {
    setCategories((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }, [])

  const addLanguage = useCallback((name: string) => {
    setLanguages((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }, [])

  const save = useCallback(
    async (values: BookFormValues): Promise<void> => {
      setStatus("saving")
      setError(null)

      const original = originalBookRef.current

      const result = await getBooksUseCase.updateBook({
        id: bookId,
        ...values,
        branchId: original?.branchId ?? "",
        price: original?.price ?? 0,
        stock: original?.stock ?? 0,
        shelfHint: original?.shelfHint ?? "",
      })

      if (!result.success) {
        setStatus("ready")
        setError(result.error)
        return
      }

      setStatus("saved")
    },
    [bookId, getBooksUseCase]
  )

  const state = useMemo<EditBookViewModelState>(
    () => ({
      status,
      authors,
      translators,
      categories,
      languages,
      error,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "ready",
      isNotFound: status === "not-found",
      isError: status === "error",
      isSaving: status === "saving",
      isSaved: status === "saved",
    }),
    [authors, categories, error, languages, status, translators]
  )

  return { state, form, save, addAuthor, addTranslator, addCategory, addLanguage }
}

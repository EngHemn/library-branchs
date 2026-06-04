"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  bookFormSchema,
  type BookFormValues,
} from "@/domain/schemas/bookFormSchema"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { EditBookStatus, EditBookViewModelState } from "./EditBookViewModelState"

type EditBookViewModel = {
  state: EditBookViewModelState
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

export function useEditBookViewModel(
  bookId: string,
  getBooksUseCase: GetBooksUseCase
): EditBookViewModel {
  const queryClient = useQueryClient()
  const [languages, setLanguages] = useState<string[]>(DEFAULT_LANGUAGES)
  const [error, setError] = useState<string | null>(null)
  const originalBookRef = useRef<{
    branchId: string
    price: number
    stock: number
    shelfHint: string
  } | null>(null)

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

  const bookQuery = useQuery({
    queryKey: ["books", bookId],
    queryFn: async () => {
      const result = await getBooksUseCase.getBookById(bookId)
      if (!result.success) throw new Error(result.error)
      return result.data
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

  useEffect(() => {
    const book = bookQuery.data
    if (!book) return

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
      coverUrl: book.coverUrl ?? null,
    })
  }, [bookQuery.data, form])

  const updateBookMutation = useMutation({
    mutationFn: async (values: BookFormValues) => {
      const original = originalBookRef.current
      const result = await getBooksUseCase.updateBook({
        id: bookId,
        ...values,
        coverUrl: values.coverUrl,
        branchId: original?.branchId ?? "",
        price: original?.price ?? 0,
        stock: original?.stock ?? 0,
        shelfHint: original?.shelfHint ?? "",
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", bookId] })
      queryClient.invalidateQueries({ queryKey: ["books"] })
    },
    onError: (err: Error) => setError(err.message),
  })

  async function save(values: BookFormValues): Promise<void> {
    setError(null)
    try {
      await updateBookMutation.mutateAsync(values)
    } catch {
      // error handled in onError callback
    }
  }

  function addLanguage(name: string): void {
    setLanguages((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }

  const isLoading =
    bookQuery.isPending ||
    authorNamesQuery.isPending ||
    translatorNamesQuery.isPending
  const isError = bookQuery.isError
  const isNotFound = bookQuery.isSuccess && bookQuery.data === null
  const isSaving = updateBookMutation.isPending
  const isSaved = updateBookMutation.isSuccess

  const status: EditBookStatus = isSaved
    ? "saved"
    : isSaving
      ? "saving"
      : isLoading
        ? "loading"
        : isError
          ? "error"
          : isNotFound
            ? "not-found"
            : "ready"

  const state: EditBookViewModelState = {
    status,
    authors: authorNamesQuery.data ?? [],
    translators: translatorNamesQuery.data ?? [],
    categories: DEFAULT_CATEGORIES,
    languages,
    error,
    isLoading,
    isReady: status === "ready",
    isNotFound,
    isError,
    isSaving,
    isSaved,
  }

  return { state, form, save, addLanguage }
}

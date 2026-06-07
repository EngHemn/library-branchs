"use client"

import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  bookFormSchema,
  type BookFormValues,
} from "@/domain/schemas/bookFormSchema"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import type { CreateBookStatus, CreateBookViewModelState } from "./CreateBookViewModelState"
import { useBookFormLocation } from "./useBookFormLocation"

type CreateBookViewModel = {
  state: CreateBookViewModelState
  form: ReturnType<typeof useForm<BookFormValues>>
  save: (values: BookFormValues) => Promise<void>
  addLanguage: (name: string) => void
  populateFromBook: (bookId: string) => Promise<void>
  addLocationValue: (stepId: string, value: string) => Promise<void>
  updateLocationValue: (
    stepId: string,
    currentValue: string,
    value: string
  ) => Promise<void>
  deleteLocationValue: (stepId: string, value: string) => Promise<void>
  addLocationStep: (label: string) => Promise<void>
  updateLocationStep: (stepId: string, label: string) => Promise<void>
  deleteLocationStep: (stepId: string) => Promise<void>
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
  getBooksUseCase: GetBooksUseCase,
  shelfManagementUseCase: ShelfManagementUseCase
): CreateBookViewModel {
  const queryClient = useQueryClient()
  const [languages, setLanguages] = useState<string[]>(DEFAULT_LANGUAGES)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema) as Resolver<BookFormValues>,
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
      stock: 0,
      available: 0,
      minAlert: 0,
      initialPrice: 0,
      finalPrice: 0,
      coverUrl: null,
      locationValues: {},
    },
  })

  const location = useBookFormLocation(form, shelfManagementUseCase)

  const authorNamesQuery = useQuery({
    queryKey: ["authorNames"],
    queryFn: async () => {
      const result = await getBooksUseCase.getAuthorNames()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const result = await getBooksUseCase.getBooks()
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
      const { finalPrice, locationValues: _locationValues, ...rest } = values
      const result = await getBooksUseCase.createBook({
        ...rest,
        coverUrl: values.coverUrl,
        shelfHint: location.shelfHintFromForm(),
        price: finalPrice,
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

  async function populateFromBook(selectedBookId: string): Promise<void> {
    const result = await getBooksUseCase.getBookById(selectedBookId)
    if (!result.success || !result.data) return

    const book = result.data
    form.setValue("title", book.title)
    form.setValue("author", book.author)
    form.setValue("translator", book.translator ?? "")
    form.setValue("isbn", book.isbn)
    form.setValue("language", book.language)
    form.setValue("category", book.category)
    form.setValue("publicationDate", book.publicationDate)
    form.setValue("description", book.description)
    form.setValue("pages", book.pages)
    form.setValue("coverUrl", book.coverUrl ?? null)
    location.setLocationFromShelfHint(book.shelfHint)

    if (book.language && !languages.includes(book.language)) {
      setLanguages((prev) => [...prev, book.language])
    }
  }

  const isLoading =
    authorNamesQuery.isPending ||
    translatorNamesQuery.isPending ||
    booksQuery.isPending ||
    location.isLocationOptionsLoading
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
    books: booksQuery.data ?? [],
    authors: authorNamesQuery.data ?? [],
    translators: translatorNamesQuery.data ?? [],
    categories: DEFAULT_CATEGORIES,
    languages,
    error,
    isLoading,
    isReady: status === "ready",
    isSaving,
    isSaved,
    locationOptions: location.locationOptions,
    locationManageError: location.locationManageError,
    isManagingLocation: location.isManagingLocation,
  }

  return {
    state,
    form,
    save,
    addLanguage,
    populateFromBook,
    addLocationValue: location.addLocationValue,
    updateLocationValue: location.updateLocationValue,
    deleteLocationValue: location.deleteLocationValue,
    addLocationStep: location.addLocationStep,
    updateLocationStep: location.updateLocationStep,
    deleteLocationStep: location.deleteLocationStep,
  }
}

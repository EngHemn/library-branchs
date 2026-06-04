"use client"

import { useQuery } from "@tanstack/react-query"

import type { BookDetail } from "@/domain/entities/book/BookDetail"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { BookDetailStatus, BookDetailViewModelState } from "./BookDetailViewModelState"

type BookDetailViewModel = {
  state: BookDetailViewModelState
  reload: () => void
}

export function useBookDetailViewModel(
  bookId: string,
  getBooksUseCase: GetBooksUseCase
): BookDetailViewModel {
  const bookDetailQuery = useQuery({
    queryKey: ["books", bookId],
    queryFn: async () => {
      const result = await getBooksUseCase.getBookById(bookId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  function reload(): void {
    void bookDetailQuery.refetch()
  }

  const isLoading = bookDetailQuery.isPending
  const isError = bookDetailQuery.isError
  const isNotFound = bookDetailQuery.isSuccess && bookDetailQuery.data === null
  const isLoaded = bookDetailQuery.isSuccess && bookDetailQuery.data !== null

  const status: BookDetailStatus = isLoading
    ? "loading"
    : isError
      ? "error"
      : isNotFound
        ? "not-found"
        : isLoaded
          ? "loaded"
          : "idle"

  const state: BookDetailViewModelState = {
    status,
    bookDetail: bookDetailQuery.data ?? null,
    error: isError ? (bookDetailQuery.error?.message ?? null) : null,
    isLoading,
    isLoaded,
    isNotFound,
    isError,
  }

  return { state, reload }
}

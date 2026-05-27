"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { BookDetail } from "@/domain/entities/book/BookDetail"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"

type BookDetailStatus = "idle" | "loading" | "loaded" | "not-found" | "error"

type BookDetailViewModelState = {
  status: BookDetailStatus
  bookDetail: BookDetail | null
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

type BookDetailViewModel = {
  state: BookDetailViewModelState
  reload: () => void
}

export function useBookDetailViewModel(
  bookId: string,
  getBooksUseCase: GetBooksUseCase
): BookDetailViewModel {
  const [status, setStatus] = useState<BookDetailStatus>("idle")
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (): Promise<void> => {
    setStatus("loading")
    setError(null)

    const result = await getBooksUseCase.getBookById(bookId)

    if (!result.success) {
      setStatus("error")
      setError(result.error)
      return
    }

    if (!result.data) {
      setStatus("not-found")
      return
    }

    setBookDetail(result.data)
    setStatus("loaded")
  }, [bookId, getBooksUseCase])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [load])

  const reload = useCallback((): void => {
    void load()
  }, [load])

  const state = useMemo<BookDetailViewModelState>(
    () => ({
      status,
      bookDetail,
      error: status === "error" ? error : null,
      isLoading: status === "idle" || status === "loading",
      isLoaded: status === "loaded",
      isNotFound: status === "not-found",
      isError: status === "error",
    }),
    [bookDetail, error, status]
  )

  return {
    state,
    reload,
  }
}

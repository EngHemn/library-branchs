"use client"

import type { BookDetail } from "@/domain/entities/book/BookDetail"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"

export type BookDetailStatus = "idle" | "loading" | "loaded" | "not-found" | "error"

export type BookDetailViewModelState = {
  status: BookDetailStatus
  bookDetail: BookDetail | null
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

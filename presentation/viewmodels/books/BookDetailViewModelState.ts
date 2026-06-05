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
  /** Hide branch column in booking history for sub-branch users. */
  showBranchColumn: boolean
  /** Hide multi-branch stock table for sub-branch users (they only see their branch). */
  showBranchesTable: boolean
}

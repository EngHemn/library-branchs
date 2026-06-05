"use client"

import { useQuery } from "@tanstack/react-query"

import type { BookDetail } from "@/domain/entities/book/BookDetail"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { BookDetailStatus, BookDetailViewModelState } from "./BookDetailViewModelState"

type BookDetailViewModel = {
  state: BookDetailViewModelState
  reload: () => void
}

export function useBookDetailViewModel(
  bookId: string,
  authUseCase: AuthUseCase,
  getBooksUseCase: GetBooksUseCase
): BookDetailViewModel {
  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

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

  const user = userQuery.data ?? null
  const isSubBranch = user?.branchType === "sub"
  const showBranchColumn = !isSubBranch
  const showBranchesTable = !isSubBranch

  const isLoading = bookDetailQuery.isPending || userQuery.isPending
  const isError = bookDetailQuery.isError || userQuery.isError
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
    error: isError
      ? (bookDetailQuery.error?.message ??
          userQuery.error?.message ??
          null)
      : null,
    isLoading,
    isLoaded,
    isNotFound,
    isError,
    showBranchColumn,
    showBranchesTable,
  }

  return { state, reload }
}

"use client"

import { useQuery } from "@tanstack/react-query"

import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import type {
  AuthorDetailStatus,
  AuthorDetailViewModelState,
} from "./AuthorDetailViewModelState"

type AuthorDetailViewModel = {
  state: AuthorDetailViewModelState
  reload: () => Promise<void>
}

export function useAuthorDetailViewModel(
  authorId: string,
  getAuthorsUseCase: GetAuthorsUseCase
): AuthorDetailViewModel {
  const {
    data,
    status: queryStatus,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["authors", authorId],
    queryFn: async () => {
      const result = await getAuthorsUseCase.getAuthorById(authorId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  async function reload(): Promise<void> {
    await refetch()
  }

  const status: AuthorDetailStatus =
    queryStatus === "error"
      ? "error"
      : queryStatus === "pending"
        ? "loading"
        : data === null
          ? "not-found"
          : "loaded"

  const state: AuthorDetailViewModelState = {
    status,
    author: data ?? null,
    error: queryError?.message ?? null,
    isLoading: status === "loading",
    isLoaded: status === "loaded",
    isNotFound: status === "not-found",
    isError: status === "error",
  }

  return { state, reload }
}

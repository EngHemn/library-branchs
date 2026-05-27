"use client"

import { useEffect, useState } from "react"

import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"

type AuthorDetailStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "not-found"
  | "error"

type AuthorDetailViewModelState = {
  status: AuthorDetailStatus
  author: AuthorDetail | null
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

type AuthorDetailViewModel = {
  state: AuthorDetailViewModelState
  reload: () => Promise<void>
}

export function useAuthorDetailViewModel(
  authorId: string,
  getAuthorsUseCase: GetAuthorsUseCase
): AuthorDetailViewModel {
  const [status, setStatus] = useState<AuthorDetailStatus>("idle")
  const [author, setAuthor] = useState<AuthorDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadAuthor(): Promise<void> {
    await Promise.resolve()
    setStatus("loading")
    setError(null)
    const result = await getAuthorsUseCase.getAuthorById(authorId)
    if (!result.success) {
      setAuthor(null)
      setStatus("error")
      setError(result.error)
      return
    }
    if (!result.data) {
      setAuthor(null)
      setStatus("not-found")
      return
    }
    setAuthor(result.data)
    setStatus("loaded")
  }

  useEffect(() => {
    void loadAuthor()
  }, [authorId, getAuthorsUseCase])

  const state: AuthorDetailViewModelState = {
    status,
    author,
    error,
    isLoading: status === "idle" || status === "loading",
    isLoaded: status === "loaded",
    isNotFound: status === "not-found",
    isError: status === "error",
  }

  return { state, reload: loadAuthor }
}

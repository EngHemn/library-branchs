"use client"

import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"

export type AuthorDetailStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "not-found"
  | "error"

export type AuthorDetailViewModelState = {
  status: AuthorDetailStatus
  author: AuthorDetail | null
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

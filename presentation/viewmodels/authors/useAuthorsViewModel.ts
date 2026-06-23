"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Author } from "@/domain/entities/author/Author"
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import type {
  AuthorsStatus,
  AuthorsViewModelState,
} from "./AuthorsViewModelState"

type AuthorsViewModel = {
  state: AuthorsViewModelState
  setSearchQuery: (value: string) => void
  setStatusFilter: (value: "all" | "active" | "inactive") => void
  deleteAuthor: (authorId: string) => Promise<void>
  reload: () => Promise<void>
}

export function useAuthorsViewModel(
  getAuthorsUseCase: GetAuthorsUseCase
): AuthorsViewModel {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all")

  const {
    data: authors,
    status: queryStatus,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const result = await getAuthorsUseCase.getAuthors()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const {
    mutateAsync: deleteAuthorAsync,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: async (authorId: string) => {
      const result = await getAuthorsUseCase.deleteAuthor(authorId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authors"] }),
  })

  async function deleteAuthor(authorId: string): Promise<void> {
    try {
      await deleteAuthorAsync(authorId)
    } catch {
      // error captured in deleteError mutation state
    }
  }

  async function reload(): Promise<void> {
    await refetch()
  }

  const allAuthors = authors ?? []

  const filteredAuthors = allAuthors.filter((author) => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      author.name.toLowerCase().includes(normalizedSearch) ||
      author.nationality.toLowerCase().includes(normalizedSearch)

    const matchesStatus =
      statusFilter === "all" ? true : author.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const status: AuthorsStatus =
    queryStatus === "success"
      ? "ready"
      : queryStatus === "error"
        ? "error"
        : "loading"

  const state: AuthorsViewModelState = {
    status,
    authors: allAuthors,
    filteredAuthors,
    searchQuery,
    statusFilter,
    error: deleteError?.message ?? queryError?.message ?? null,
    isLoading: queryStatus === "pending",
    isReady: queryStatus === "success",
    isDeleting,
  }

  return {
    state,
    setSearchQuery,
    setStatusFilter,
    deleteAuthor,
    reload,
  }
}

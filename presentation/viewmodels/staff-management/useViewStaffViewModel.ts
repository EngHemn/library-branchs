"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import type {
  ViewStaffStatus,
  ViewStaffTabKey,
  ViewStaffViewModelState,
} from "./ViewStaffViewModelState"

type ViewStaffViewModel = {
  state: ViewStaffViewModelState
  setActiveTab: (tab: ViewStaffTabKey) => void
  setSearchQuery: (query: string) => void
}

function filterBySearch<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string
): T[] {
  if (!query.trim()) return items
  const lowerQuery = query.toLowerCase().trim()
  return items.filter((item) =>
    getSearchableText(item).toLowerCase().includes(lowerQuery)
  )
}

export function useViewStaffViewModel(
  staffId: string,
  staffManagementUseCase: StaffManagementUseCase,
  branchDetailUseCase: BranchDetailUseCase
): ViewStaffViewModel {
  const [activeTab, setActiveTabState] = useState<ViewStaffTabKey>("details")
  const [searchQuery, setSearchQuery] = useState("")

  const staffQuery = useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      const result = await staffManagementUseCase.getStaffById(staffId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const branchId = staffQuery.data?.branchId

  const branchDataQuery = useQuery({
    queryKey: ["branch-detail", branchId],
    queryFn: async () => {
      const [booksResult, authorsResult, translatorsResult] = await Promise.all(
        [
          branchDetailUseCase.getBooks(branchId!),
          branchDetailUseCase.getAuthors(branchId!),
          branchDetailUseCase.getTranslators(branchId!),
        ]
      )
      return {
        books: booksResult.success ? booksResult.data : [],
        authors: authorsResult.success ? authorsResult.data : [],
        translators: translatorsResult.success ? translatorsResult.data : [],
      }
    },
    enabled: !!branchId,
  })

  function setActiveTab(tab: ViewStaffTabKey): void {
    setActiveTabState(tab)
    setSearchQuery("")
  }

  const branchAuthors = branchDataQuery.data?.authors ?? []
  const branchTranslators = branchDataQuery.data?.translators ?? []
  const allBooks = branchDataQuery.data?.books ?? []

  const filteredBooks = filterBySearch(allBooks, searchQuery, (b) =>
    [b.title, b.category, b.author, b.translator ?? "", b.isbn].join(" ")
  )
  const filteredAuthors = filterBySearch(branchAuthors, searchQuery, (a) =>
    [a.name, a.nationality].join(" ")
  )
  const filteredTranslators = filterBySearch(
    branchTranslators,
    searchQuery,
    (t) => [t.name, t.language].join(" ")
  )

  const isLoadingStaff = staffQuery.isPending
  const isLoadingBranch = !!branchId && branchDataQuery.isPending
  const isNotFound = staffQuery.isSuccess && staffQuery.data === null
  const isError = staffQuery.isError

  let status: ViewStaffStatus
  if (isError) {
    status = "error"
  } else if (isNotFound) {
    status = "not-found"
  } else if (isLoadingStaff || isLoadingBranch) {
    status = "loading"
  } else if (staffQuery.isSuccess && staffQuery.data !== null) {
    status = "loaded"
  } else {
    status = "idle"
  }

  const state: ViewStaffViewModelState = {
    status,
    staffMember: staffQuery.data ?? null,
    books: filteredBooks,
    authors: filteredAuthors,
    translators: filteredTranslators,
    branchAuthors,
    branchTranslators,
    activeTab,
    searchQuery,
    error: staffQuery.error?.message ?? null,
    isLoading: status === "loading" || status === "idle",
    isLoaded: status === "loaded",
    isNotFound,
    isError,
  }

  return { state, setActiveTab, setSearchQuery }
}

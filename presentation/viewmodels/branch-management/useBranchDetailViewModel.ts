"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchDetail } from "@/domain/entities/branch/BranchDetail"
import type { Member } from "@/domain/entities/member/Member"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"

import { useBranchDetailActionsHook } from "./useBranchDetailActionsHook"

type BranchDetailStatus = "idle" | "loading" | "loaded" | "not-found" | "error"

type TabKey =
  | "details"
  | "location"
  | "sub-branches"
  | "books"
  | "authors"
  | "translators"
  | "staff"
  | "members"

type BranchDetailViewModelState = {
  status: BranchDetailStatus
  branchDetail: BranchDetail | null
  permissions: BranchPermissions | null
  subBranches: Branch[]
  books: Book[]
  authors: Author[]
  translators: Translator[]
  branchAuthors: Author[]
  branchTranslators: Translator[]
  staff: StaffMember[]
  members: Member[]
  activeTab: TabKey
  searchQuery: string
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

type BranchDetailViewModel = {
  state: BranchDetailViewModelState
  setActiveTab: (tab: TabKey) => void
  setSearchQuery: (query: string) => void
  deleteSubBranch: (branchId: string) => Promise<void>
  toggleSubBranchStatus: (branchId: string) => Promise<void>
  deleteBook: (bookId: string) => Promise<void>
  toggleBookStatus: (bookId: string) => Promise<void>
  deleteAuthor: (authorId: string) => Promise<void>
  toggleAuthorStatus: (authorId: string) => Promise<void>
  deleteTranslator: (translatorId: string) => Promise<void>
  toggleTranslatorStatus: (translatorId: string) => Promise<void>
  deleteStaff: (staffId: string) => Promise<void>
  toggleStaffStatus: (staffId: string) => Promise<void>
  deleteMember: (memberId: string) => Promise<void>
  toggleMemberStatus: (memberId: string) => Promise<void>
}

type BranchDetailQueryData = {
  branchDetail: BranchDetail
  permissions: BranchPermissions
  subBranches: Branch[]
  books: Book[]
  authors: Author[]
  translators: Translator[]
  staff: StaffMember[]
  members: Member[]
} | null

function filterBySearch<T>(items: T[], query: string, getText: (item: T) => string): T[] {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return items
  return items.filter((item) => getText(item).toLowerCase().includes(normalized))
}

export function useBranchDetailViewModel(
  branchId: string,
  branchDetailUseCase: BranchDetailUseCase
): BranchDetailViewModel {
  const [activeTab, setActiveTab] = useState<TabKey>("details")
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isPending, isError, error } = useQuery<BranchDetailQueryData, Error>({
    queryKey: ["branchDetail", branchId],
    queryFn: async () => {
      const detailResult = await branchDetailUseCase.getBranchDetail(branchId)
      if (!detailResult.success) throw new Error(detailResult.error)
      if (!detailResult.data) return null

      const detail = detailResult.data
      const permissions = branchDetailUseCase.getPermissions(detail)

      const [
        subBranchesResult,
        booksResult,
        authorsResult,
        translatorsResult,
        staffResult,
        membersResult,
      ] = await Promise.all([
        branchDetailUseCase.getSubBranches(branchId),
        branchDetailUseCase.getBooks(branchId),
        branchDetailUseCase.getAuthors(branchId),
        branchDetailUseCase.getTranslators(branchId),
        branchDetailUseCase.getStaff(branchId),
        branchDetailUseCase.getMembers(branchId),
      ])

      return {
        branchDetail: detail,
        permissions,
        subBranches: subBranchesResult.success ? subBranchesResult.data : [],
        books: booksResult.success ? booksResult.data : [],
        authors: authorsResult.success ? authorsResult.data : [],
        translators: translatorsResult.success ? translatorsResult.data : [],
        staff: staffResult.success ? staffResult.data : [],
        members: membersResult.success ? membersResult.data : [],
      }
    },
  })

  const actions = useBranchDetailActionsHook(branchId, branchDetailUseCase)

  const authors = data?.authors ?? []
  const translators = data?.translators ?? []

  const status: BranchDetailStatus = isPending
    ? "loading"
    : isError
    ? "error"
    : data === null
    ? "not-found"
    : data
    ? "loaded"
    : "idle"

  const state: BranchDetailViewModelState = {
    status,
    branchDetail: data?.branchDetail ?? null,
    permissions: data?.permissions ?? null,
    subBranches: filterBySearch(
      data?.subBranches ?? [],
      searchQuery,
      (b) => [b.branchName, b.adminName, b.email, b.phone, b.address].join(" ")
    ),
    books: filterBySearch(
      data?.books ?? [],
      searchQuery,
      (b) => [b.title, b.category, b.author, b.translator ?? "", b.isbn].join(" ")
    ),
    authors: filterBySearch(authors, searchQuery, (a) => [a.name, a.nationality].join(" ")),
    translators: filterBySearch(translators, searchQuery, (t) => [t.name, t.language].join(" ")),
    branchAuthors: authors,
    branchTranslators: translators,
    staff: filterBySearch(
      data?.staff ?? [],
      searchQuery,
      (s) => [s.staffName, s.staffId, s.role, s.branch, s.email, s.phone].join(" ")
    ),
    members: filterBySearch(
      data?.members ?? [],
      searchQuery,
      (m) => [m.memberName, m.registerBranch, m.email, m.phone].join(" ")
    ),
    activeTab,
    searchQuery,
    error: isError ? (error instanceof Error ? error.message : "Unknown error") : null,
    isLoading: status === "idle" || status === "loading",
    isLoaded: status === "loaded",
    isNotFound: status === "not-found",
    isError: status === "error",
  }

  return {
    state,
    setActiveTab,
    setSearchQuery,
    ...actions,
  }
}

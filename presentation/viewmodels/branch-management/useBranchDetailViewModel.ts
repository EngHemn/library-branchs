"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchDetail } from "@/domain/entities/branch/BranchDetail"
import type { Member } from "@/domain/entities/member/Member"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"

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

function filterBySearch<T>(items: T[], query: string, getSearchableText: (item: T) => string): T[] {
  if (!query.trim()) {
    return items
  }

  const lowerQuery = query.toLowerCase().trim()

  return items.filter((item) =>
    getSearchableText(item).toLowerCase().includes(lowerQuery)
  )
}

export function useBranchDetailViewModel(
  branchId: string,
  branchDetailUseCase: BranchDetailUseCase
): BranchDetailViewModel {
  const [status, setStatus] = useState<BranchDetailStatus>("idle")
  const [branchDetail, setBranchDetail] = useState<BranchDetail | null>(null)
  const [permissions, setPermissions] = useState<BranchPermissions | null>(null)
  const [subBranches, setSubBranches] = useState<Branch[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [translators, setTranslators] = useState<Translator[]>([])
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [activeTab, setActiveTab] = useState<TabKey>("details")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadBranchDetail(): Promise<void> {
      setStatus("loading")
      setError(null)

      const detailResult = await branchDetailUseCase.getBranchDetail(branchId)

      if (cancelled) return

      if (!detailResult.success) {
        setStatus("error")
        setError(detailResult.error)
        return
      }

      if (!detailResult.data) {
        setStatus("not-found")
        return
      }

      const detail = detailResult.data
      setBranchDetail(detail)
      setPermissions(branchDetailUseCase.getPermissions(detail))

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

      if (cancelled) return

      if (subBranchesResult.success) setSubBranches(subBranchesResult.data)
      if (booksResult.success) setBooks(booksResult.data)
      if (authorsResult.success) setAuthors(authorsResult.data)
      if (translatorsResult.success) setTranslators(translatorsResult.data)
      if (staffResult.success) setStaff(staffResult.data)
      if (membersResult.success) setMembers(membersResult.data)

      setStatus("loaded")
    }

    void loadBranchDetail()

    return () => {
      cancelled = true
    }
  }, [branchId, branchDetailUseCase])

  const filteredSubBranches = useMemo(
    () =>
      filterBySearch(subBranches, searchQuery, (b) =>
        [b.branchName, b.adminName, b.email, b.phone, b.address].join(" ")
      ),
    [subBranches, searchQuery]
  )

  const filteredBooks = useMemo(
    () =>
      filterBySearch(books, searchQuery, (b) =>
        [b.title, b.category, b.author, b.translator ?? "", b.isbn].join(" ")
      ),
    [books, searchQuery]
  )

  const filteredAuthors = useMemo(
    () =>
      filterBySearch(authors, searchQuery, (a) =>
        [a.name, a.nationality].join(" ")
      ),
    [authors, searchQuery]
  )

  const filteredTranslators = useMemo(
    () =>
      filterBySearch(translators, searchQuery, (t) =>
        [t.name, t.language].join(" ")
      ),
    [translators, searchQuery]
  )

  const filteredStaff = useMemo(
    () =>
      filterBySearch(staff, searchQuery, (s) =>
        [s.staffName, s.staffId, s.role, s.branch, s.email, s.phone].join(" ")
      ),
    [staff, searchQuery]
  )

  const filteredMembers = useMemo(
    () =>
      filterBySearch(members, searchQuery, (m) =>
        [m.memberName, m.registerBranch, m.email, m.phone].join(" ")
      ),
    [members, searchQuery]
  )

  const deleteSubBranch = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.deleteSubBranch(id)

      if (result.success) {
        setSubBranches((prev) => prev.filter((b) => b.id !== id))
      }
    },
    [branchDetailUseCase]
  )

  const toggleSubBranchStatus = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.toggleSubBranchStatus(id)

      if (result.success) {
        setSubBranches((prev) =>
          prev.map((b) => (b.id === id ? result.data : b))
        )
      }
    },
    [branchDetailUseCase]
  )

  const deleteBook = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.deleteBook(id)

      if (result.success) {
        setBooks((prev) => prev.filter((b) => b.id !== id))
      }
    },
    [branchDetailUseCase]
  )

  const toggleBookStatus = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.toggleBookStatus(id)

      if (result.success) {
        setBooks((prev) =>
          prev.map((b) => (b.id === id ? result.data : b))
        )
      }
    },
    [branchDetailUseCase]
  )

  const deleteAuthor = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.deleteAuthor(id)

      if (result.success) {
        setAuthors((prev) => prev.filter((a) => a.id !== id))
      }
    },
    [branchDetailUseCase]
  )

  const toggleAuthorStatus = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.toggleAuthorStatus(id)

      if (result.success) {
        setAuthors((prev) =>
          prev.map((a) => (a.id === id ? result.data : a))
        )
      }
    },
    [branchDetailUseCase]
  )

  const deleteTranslator = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.deleteTranslator(id)

      if (result.success) {
        setTranslators((prev) => prev.filter((t) => t.id !== id))
      }
    },
    [branchDetailUseCase]
  )

  const toggleTranslatorStatus = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.toggleTranslatorStatus(id)

      if (result.success) {
        setTranslators((prev) =>
          prev.map((t) => (t.id === id ? result.data : t))
        )
      }
    },
    [branchDetailUseCase]
  )

  const deleteStaff = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.deleteStaff(id)

      if (result.success) {
        setStaff((prev) => prev.filter((s) => s.id !== id))
      }
    },
    [branchDetailUseCase]
  )

  const toggleStaffStatus = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.toggleStaffStatus(id)

      if (result.success) {
        setStaff((prev) =>
          prev.map((s) => (s.id === id ? result.data : s))
        )
      }
    },
    [branchDetailUseCase]
  )

  const deleteMember = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.deleteMember(id)

      if (result.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id))
      }
    },
    [branchDetailUseCase]
  )

  const toggleMemberStatus = useCallback(
    async (id: string): Promise<void> => {
      const result = await branchDetailUseCase.toggleMemberStatus(id)

      if (result.success) {
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? result.data : m))
        )
      }
    },
    [branchDetailUseCase]
  )

  const state = useMemo<BranchDetailViewModelState>(
    () => ({
      status,
      branchDetail,
      permissions,
      subBranches: filteredSubBranches,
      books: filteredBooks,
      authors: filteredAuthors,
      translators: filteredTranslators,
      staff: filteredStaff,
      members: filteredMembers,
      activeTab,
      searchQuery,
      error,
      isLoading: status === "idle" || status === "loading",
      isLoaded: status === "loaded",
      isNotFound: status === "not-found",
      isError: status === "error",
    }),
    [
      status,
      branchDetail,
      permissions,
      filteredSubBranches,
      filteredBooks,
      filteredAuthors,
      filteredTranslators,
      filteredStaff,
      filteredMembers,
      activeTab,
      searchQuery,
      error,
    ]
  )

  return {
    state,
    setActiveTab,
    setSearchQuery,
    deleteSubBranch,
    toggleSubBranchStatus,
    deleteBook,
    toggleBookStatus,
    deleteAuthor,
    toggleAuthorStatus,
    deleteTranslator,
    toggleTranslatorStatus,
    deleteStaff,
    toggleStaffStatus,
    deleteMember,
    toggleMemberStatus,
  }
}

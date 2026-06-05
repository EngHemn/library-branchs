"use client"

import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchDetail } from "@/domain/entities/branch/BranchDetail"
import type { Member } from "@/domain/entities/member/Member"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"

export type BranchDetailStatus = "idle" | "loading" | "loaded" | "not-found" | "error"

export type TabKey =
  | "details"
  | "location"
  | "sub-branches"
  | "books"
  | "authors"
  | "translators"
  | "staff"
  | "members"

export type BranchDetailViewModelState = {
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

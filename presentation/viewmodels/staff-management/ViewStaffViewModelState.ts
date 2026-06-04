"use client"

import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"

export type ViewStaffTabKey = "details" | "books" | "authors" | "translators"
export type ViewStaffStatus = "idle" | "loading" | "loaded" | "not-found" | "error"

export type ViewStaffViewModelState = {
  status: ViewStaffStatus
  staffMember: StaffMember | null
  books: Book[]
  authors: Author[]
  translators: Translator[]
  branchAuthors: Author[]
  branchTranslators: Translator[]
  activeTab: ViewStaffTabKey
  searchQuery: string
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

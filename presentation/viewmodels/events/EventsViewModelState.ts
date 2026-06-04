"use client"

import type {
  EventStatus,
  EventSummary,
  LibraryEvent,
} from "@/domain/entities/event/Event"
import { useEventBranchBooksSheet } from "./useEventBranchBooksSheet"

export type AsyncStatus = "idle" | "loading" | "success" | "error"
export type EventStatusFilter = "all" | EventStatus

export type EventsViewModelState = {
  events: LibraryEvent[]
  eventsStatus: AsyncStatus
  eventsError: string | null
  summary: EventSummary | null
  summaryStatus: AsyncStatus
  searchQuery: string
  statusFilter: EventStatusFilter
  expandedEventIds: string[]
  filteredEvents: LibraryEvent[]
  isLoading: boolean
  isReady: boolean
  branchBooksSelection: ReturnType<typeof useEventBranchBooksSheet>["selection"]
  isBranchBooksSheetOpen: boolean
  branchBooks: ReturnType<typeof useEventBranchBooksSheet>["books"]
  filteredBranchBooks: ReturnType<typeof useEventBranchBooksSheet>["books"]
  branchBooksStatus: ReturnType<typeof useEventBranchBooksSheet>["booksStatus"]
  branchBooksError: ReturnType<typeof useEventBranchBooksSheet>["booksError"]
  branchBooksSearchQuery: string
  branchBooksLanguageFilter: ReturnType<typeof useEventBranchBooksSheet>["languageFilter"]
  branchBooksCategoryFilter: ReturnType<typeof useEventBranchBooksSheet>["categoryFilter"]
  branchBooksAuthorFilter: ReturnType<typeof useEventBranchBooksSheet>["authorFilter"]
  branchBooksTranslatorFilter: ReturnType<typeof useEventBranchBooksSheet>["translatorFilter"]
  branchBooksLanguages: string[]
  branchBooksCategories: string[]
  branchBooksAuthors: string[]
  branchBooksTranslators: string[]
}

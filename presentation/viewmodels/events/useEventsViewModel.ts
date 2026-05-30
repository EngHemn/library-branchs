"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type {
  EventStatus,
  EventSummary,
  LibraryEvent,
} from "@/domain/entities/event/Event"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"
import { useEventBranchBooksSheet } from "@/presentation/viewmodels/events/useEventBranchBooksSheet"

type AsyncStatus = "idle" | "loading" | "success" | "error"
type EventStatusFilter = "all" | EventStatus

type EventsViewModelState = {
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

export type EventsViewModel = {
  state: EventsViewModelState
  setSearchQuery: (value: string) => void
  setStatusFilter: (value: EventStatusFilter) => void
  toggleEventExpanded: (eventId: string) => void
  openBranchBooks: ReturnType<typeof useEventBranchBooksSheet>["open"]
  closeBranchBooks: () => void
  setBranchBooksSearchQuery: (value: string) => void
  setBranchBooksLanguageFilter: ReturnType<typeof useEventBranchBooksSheet>["setLanguageFilter"]
  setBranchBooksCategoryFilter: ReturnType<typeof useEventBranchBooksSheet>["setCategoryFilter"]
  setBranchBooksAuthorFilter: ReturnType<typeof useEventBranchBooksSheet>["setAuthorFilter"]
  setBranchBooksTranslatorFilter: ReturnType<typeof useEventBranchBooksSheet>["setTranslatorFilter"]
  resetBranchBooksFilters: () => void
  setBranchBooksSheetOpen: (open: boolean) => void
  reload: () => Promise<void>
}

function matchesSearch(event: LibraryEvent, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  if (event.name.toLowerCase().includes(normalizedQuery)) {
    return true
  }

  if (event.description.toLowerCase().includes(normalizedQuery)) {
    return true
  }

  if (event.id.toLowerCase().includes(normalizedQuery)) {
    return true
  }

  return event.branches.some((branch) =>
    branch.branchName.toLowerCase().includes(normalizedQuery)
  )
}

function filterEvents(
  events: LibraryEvent[],
  searchQuery: string,
  statusFilter: EventStatusFilter
): LibraryEvent[] {
  return events.filter((event) => {
    if (statusFilter !== "all" && event.status !== statusFilter) {
      return false
    }

    return matchesSearch(event, searchQuery)
  })
}

export function useEventsViewModel(
  getEventsUseCase: GetEventsUseCase
): EventsViewModel {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("all")
  const [expandedEventIds, setExpandedEventIds] = useState<string[]>([])

  const branchBooksSheet = useEventBranchBooksSheet(getEventsUseCase)

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const result = await getEventsUseCase.getEvents()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const summaryQuery = useQuery({
    queryKey: ["events", "summary"],
    queryFn: async () => {
      const result = await getEventsUseCase.getEventSummary()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const events = eventsQuery.data ?? []
  const summary = summaryQuery.data ?? null

  const eventsStatus: AsyncStatus = eventsQuery.isSuccess
    ? "success"
    : eventsQuery.isError
      ? "error"
      : "loading"

  const summaryStatus: AsyncStatus = summaryQuery.isSuccess
    ? "success"
    : summaryQuery.isError
      ? "error"
      : "loading"

  const filteredEvents = filterEvents(events, searchQuery, statusFilter)

  function toggleEventExpanded(eventId: string): void {
    setExpandedEventIds((currentIds) => {
      if (currentIds.includes(eventId)) {
        return currentIds.filter((id) => id !== eventId)
      }

      return [...currentIds, eventId]
    })
  }

  async function reload(): Promise<void> {
    await Promise.all([eventsQuery.refetch(), summaryQuery.refetch()])
  }

  return {
    state: {
      events,
      eventsStatus,
      eventsError: eventsQuery.error?.message ?? null,
      summary,
      summaryStatus,
      searchQuery,
      statusFilter,
      expandedEventIds,
      filteredEvents,
      isLoading: eventsQuery.isPending,
      isReady: eventsQuery.isSuccess,
      branchBooksSelection: branchBooksSheet.selection,
      isBranchBooksSheetOpen: branchBooksSheet.isOpen,
      branchBooks: branchBooksSheet.books,
      filteredBranchBooks: branchBooksSheet.books,
      branchBooksStatus: branchBooksSheet.booksStatus,
      branchBooksError: branchBooksSheet.booksError,
      branchBooksSearchQuery: branchBooksSheet.searchQuery,
      branchBooksLanguageFilter: branchBooksSheet.languageFilter,
      branchBooksCategoryFilter: branchBooksSheet.categoryFilter,
      branchBooksAuthorFilter: branchBooksSheet.authorFilter,
      branchBooksTranslatorFilter: branchBooksSheet.translatorFilter,
      branchBooksLanguages: branchBooksSheet.languages,
      branchBooksCategories: branchBooksSheet.categories,
      branchBooksAuthors: branchBooksSheet.authors,
      branchBooksTranslators: branchBooksSheet.translators,
    },
    setSearchQuery,
    setStatusFilter,
    toggleEventExpanded,
    openBranchBooks: branchBooksSheet.open,
    closeBranchBooks: branchBooksSheet.close,
    setBranchBooksSearchQuery: branchBooksSheet.setSearchQuery,
    setBranchBooksLanguageFilter: branchBooksSheet.setLanguageFilter,
    setBranchBooksCategoryFilter: branchBooksSheet.setCategoryFilter,
    setBranchBooksAuthorFilter: branchBooksSheet.setAuthorFilter,
    setBranchBooksTranslatorFilter: branchBooksSheet.setTranslatorFilter,
    resetBranchBooksFilters: branchBooksSheet.resetFilters,
    setBranchBooksSheetOpen: branchBooksSheet.setIsOpen,
    reload,
  }
}

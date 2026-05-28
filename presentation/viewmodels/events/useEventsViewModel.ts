"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { EventBranchBook } from "@/domain/entities/event/EventBranchBook"
import type {
  EventStatus,
  EventSummary,
  LibraryEvent,
} from "@/domain/entities/event/Event"
import type { EventBranchOption } from "@/domain/repositories/EventRepository"
import {
  eventFormSchema,
  type EventFormValues,
} from "@/domain/schemas/eventFormSchema"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"

type AsyncStatus = "idle" | "loading" | "success" | "error"
type EventStatusFilter = "all" | EventStatus
type EventBooksFilter = "all" | string
type EventFormMode = "create" | "edit" | null

type EventBranchSelection = {
  eventId: string
  eventName: string
  branchId: string
  branchName: string
}

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
  branchBooksSelection: EventBranchSelection | null
  isBranchBooksSheetOpen: boolean
  branchBooks: EventBranchBook[]
  filteredBranchBooks: EventBranchBook[]
  branchBooksStatus: AsyncStatus
  branchBooksError: string | null
  branchBooksSearchQuery: string
  branchBooksLanguageFilter: EventBooksFilter
  branchBooksCategoryFilter: EventBooksFilter
  branchBooksAuthorFilter: EventBooksFilter
  branchBooksTranslatorFilter: EventBooksFilter
  branchBooksLanguages: string[]
  branchBooksCategories: string[]
  branchBooksAuthors: string[]
  branchBooksTranslators: string[]
  formMode: EventFormMode
  editingEventId: string | null
  formError: string | null
  isSaving: boolean
  isFormOpen: boolean
  branchOptions: EventBranchOption[]
  viewingEvent: LibraryEvent | null
  isViewDialogOpen: boolean
}

export type EventsViewModel = {
  state: EventsViewModelState
  form: UseFormReturn<EventFormValues>
  setSearchQuery: (value: string) => void
  setStatusFilter: (value: EventStatusFilter) => void
  toggleEventExpanded: (eventId: string) => void
  openBranchBooks: (selection: EventBranchSelection) => void
  closeBranchBooks: () => void
  setBranchBooksSearchQuery: (value: string) => void
  setBranchBooksLanguageFilter: (value: EventBooksFilter) => void
  setBranchBooksCategoryFilter: (value: EventBooksFilter) => void
  setBranchBooksAuthorFilter: (value: EventBooksFilter) => void
  setBranchBooksTranslatorFilter: (value: EventBooksFilter) => void
  resetBranchBooksFilters: () => void
  openCreateDialog: () => void
  openEditDialog: (event: LibraryEvent) => void
  closeFormDialog: () => void
  openViewDialog: (event: LibraryEvent) => void
  closeViewDialog: () => void
  saveEvent: (values: EventFormValues) => Promise<void>
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

function getUniqueValues(
  books: EventBranchBook[],
  accessor: (book: EventBranchBook) => string | null
): string[] {
  const values = new Set<string>()

  for (const book of books) {
    const value = accessor(book)
    if (value) {
      values.add(value)
    }
  }

  return Array.from(values).sort()
}

function matchesBranchBookSearch(book: EventBranchBook, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return (
    book.title.toLowerCase().includes(normalizedQuery) ||
    book.author.toLowerCase().includes(normalizedQuery) ||
    book.isbn.toLowerCase().includes(normalizedQuery) ||
    book.category.toLowerCase().includes(normalizedQuery) ||
    book.language.toLowerCase().includes(normalizedQuery) ||
    (book.translator?.toLowerCase().includes(normalizedQuery) ?? false)
  )
}

function filterBranchBooks(
  books: EventBranchBook[],
  searchQuery: string,
  languageFilter: EventBooksFilter,
  categoryFilter: EventBooksFilter,
  authorFilter: EventBooksFilter,
  translatorFilter: EventBooksFilter
): EventBranchBook[] {
  return books.filter((book) => {
    if (languageFilter !== "all" && book.language !== languageFilter) {
      return false
    }

    if (categoryFilter !== "all" && book.category !== categoryFilter) {
      return false
    }

    if (authorFilter !== "all" && book.author !== authorFilter) {
      return false
    }

    if (translatorFilter !== "all") {
      if (!book.translator || book.translator !== translatorFilter) {
        return false
      }
    }

    return matchesBranchBookSearch(book, searchQuery)
  })
}

export function useEventsViewModel(
  getEventsUseCase: GetEventsUseCase
): EventsViewModel {
  const [events, setEvents] = useState<LibraryEvent[]>([])
  const [eventsStatus, setEventsStatus] = useState<AsyncStatus>("idle")
  const [eventsError, setEventsError] = useState<string | null>(null)
  const [summary, setSummary] = useState<EventSummary | null>(null)
  const [summaryStatus, setSummaryStatus] = useState<AsyncStatus>("idle")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("all")
  const [expandedEventIds, setExpandedEventIds] = useState<string[]>([])

  const [branchBooksSelection, setBranchBooksSelection] =
    useState<EventBranchSelection | null>(null)
  const [isBranchBooksSheetOpen, setIsBranchBooksSheetOpen] = useState(false)
  const [branchBooks, setBranchBooks] = useState<EventBranchBook[]>([])
  const [branchBooksStatus, setBranchBooksStatus] = useState<AsyncStatus>("idle")
  const [branchBooksError, setBranchBooksError] = useState<string | null>(null)
  const [branchBooksSearchQuery, setBranchBooksSearchQuery] = useState("")
  const [branchBooksLanguageFilter, setBranchBooksLanguageFilter] =
    useState<EventBooksFilter>("all")
  const [branchBooksCategoryFilter, setBranchBooksCategoryFilter] =
    useState<EventBooksFilter>("all")
  const [branchBooksAuthorFilter, setBranchBooksAuthorFilter] =
    useState<EventBooksFilter>("all")
  const [branchBooksTranslatorFilter, setBranchBooksTranslatorFilter] =
    useState<EventBooksFilter>("all")

  const [formMode, setFormMode] = useState<EventFormMode>(null)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [branchOptions, setBranchOptions] = useState<EventBranchOption[]>([])
  const [viewingEvent, setViewingEvent] = useState<LibraryEvent | null>(null)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema as never),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "upcoming",
      branchIds: [],
    },
  })

  const loadAll = useCallback(async (): Promise<void> => {
    setEventsStatus("loading")
    setSummaryStatus("loading")
    setEventsError(null)

    const [eventsResult, summaryResult] = await Promise.all([
      getEventsUseCase.getEvents(),
      getEventsUseCase.getEventSummary(),
    ])

    if (!eventsResult.success) {
      setEvents([])
      setEventsStatus("error")
      setEventsError(eventsResult.error)
    } else {
      setEvents(eventsResult.data)
      setEventsStatus("success")
    }

    if (summaryResult.success) {
      setSummary(summaryResult.data)
      setSummaryStatus("success")
    } else {
      setSummary(null)
      setSummaryStatus(eventsResult.success ? "success" : "error")
    }
  }, [getEventsUseCase])

  const loadBranchBooks = useCallback(
    async (selection: EventBranchSelection): Promise<void> => {
      setBranchBooksStatus("loading")
      setBranchBooksError(null)

      const result = await getEventsUseCase.getEventBranchBooks(
        selection.eventId,
        selection.branchId
      )

      if (!result.success) {
        setBranchBooks([])
        setBranchBooksStatus("error")
        setBranchBooksError(result.error)
        return
      }

      setBranchBooks(result.data)
      setBranchBooksStatus("success")
    },
    [getEventsUseCase]
  )

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  useEffect(() => {
    void getEventsUseCase.getEventBranchOptions().then((result) => {
      if (result.success) {
        setBranchOptions(result.data)
      }
    })
  }, [getEventsUseCase])

  const filteredEvents = useMemo(
    () => filterEvents(events, searchQuery, statusFilter),
    [events, searchQuery, statusFilter]
  )

  const filteredBranchBooks = useMemo(
    () =>
      filterBranchBooks(
        branchBooks,
        branchBooksSearchQuery,
        branchBooksLanguageFilter,
        branchBooksCategoryFilter,
        branchBooksAuthorFilter,
        branchBooksTranslatorFilter
      ),
    [
      branchBooks,
      branchBooksSearchQuery,
      branchBooksLanguageFilter,
      branchBooksCategoryFilter,
      branchBooksAuthorFilter,
      branchBooksTranslatorFilter,
    ]
  )

  const branchBooksLanguages = useMemo(
    () => getUniqueValues(branchBooks, (book) => book.language),
    [branchBooks]
  )

  const branchBooksCategories = useMemo(
    () => getUniqueValues(branchBooks, (book) => book.category),
    [branchBooks]
  )

  const branchBooksAuthors = useMemo(
    () => getUniqueValues(branchBooks, (book) => book.author),
    [branchBooks]
  )

  const branchBooksTranslators = useMemo(
    () => getUniqueValues(branchBooks, (book) => book.translator),
    [branchBooks]
  )

  function toggleEventExpanded(eventId: string): void {
    setExpandedEventIds((currentIds) => {
      if (currentIds.includes(eventId)) {
        return currentIds.filter((id) => id !== eventId)
      }

      return [...currentIds, eventId]
    })
  }

  function openBranchBooks(selection: EventBranchSelection): void {
    setBranchBooksSelection(selection)
    setIsBranchBooksSheetOpen(true)
    setBranchBooksSearchQuery("")
    setBranchBooksLanguageFilter("all")
    setBranchBooksCategoryFilter("all")
    setBranchBooksAuthorFilter("all")
    setBranchBooksTranslatorFilter("all")
    void loadBranchBooks(selection)
  }

  function closeBranchBooks(): void {
    setIsBranchBooksSheetOpen(false)
    setBranchBooksSelection(null)
    setBranchBooks([])
    setBranchBooksStatus("idle")
    setBranchBooksError(null)
    setBranchBooksSearchQuery("")
    setBranchBooksLanguageFilter("all")
    setBranchBooksCategoryFilter("all")
    setBranchBooksAuthorFilter("all")
    setBranchBooksTranslatorFilter("all")
  }

  function resetBranchBooksFilters(): void {
    setBranchBooksSearchQuery("")
    setBranchBooksLanguageFilter("all")
    setBranchBooksCategoryFilter("all")
    setBranchBooksAuthorFilter("all")
    setBranchBooksTranslatorFilter("all")
  }

  function openCreateDialog(): void {
    setFormMode("create")
    setEditingEventId(null)
    setFormError(null)
    form.reset({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "upcoming",
      branchIds: [],
    })
  }

  function openViewDialog(event: LibraryEvent): void {
    setViewingEvent(event)
  }

  function closeViewDialog(): void {
    setViewingEvent(null)
  }

  function openEditDialog(event: LibraryEvent): void {
    closeViewDialog()
    setFormMode("edit")
    setEditingEventId(event.id)
    setFormError(null)
    form.reset({
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
      branchIds: event.branches.map((branch) => branch.branchId),
    })
  }

  function closeFormDialog(): void {
    setFormMode(null)
    setEditingEventId(null)
    setFormError(null)
    form.reset({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "upcoming",
      branchIds: [],
    })
  }

  async function saveEvent(values: EventFormValues): Promise<void> {
    setIsSaving(true)
    setFormError(null)

    const result =
      formMode === "edit" && editingEventId
        ? await getEventsUseCase.updateEvent({
            id: editingEventId,
            ...values,
          })
        : await getEventsUseCase.createEvent(values)

    if (!result.success) {
      setIsSaving(false)
      setFormError(result.error)
      return
    }

    closeFormDialog()
    await loadAll()
    setIsSaving(false)
  }

  const isLoading = eventsStatus === "idle" || eventsStatus === "loading"
  const isReady = eventsStatus === "success"
  const isFormOpen = formMode !== null

  return {
    form,
    state: {
      events,
      eventsStatus,
      eventsError,
      summary,
      summaryStatus,
      searchQuery,
      statusFilter,
      expandedEventIds,
      filteredEvents,
      isLoading,
      isReady,
      branchBooksSelection,
      isBranchBooksSheetOpen,
      branchBooks,
      filteredBranchBooks,
      branchBooksStatus,
      branchBooksError,
      branchBooksSearchQuery,
      branchBooksLanguageFilter,
      branchBooksCategoryFilter,
      branchBooksAuthorFilter,
      branchBooksTranslatorFilter,
      branchBooksLanguages,
      branchBooksCategories,
      branchBooksAuthors,
      branchBooksTranslators,
      formMode,
      editingEventId,
      formError,
      isSaving,
      isFormOpen,
      branchOptions,
      viewingEvent,
      isViewDialogOpen: viewingEvent !== null,
    },
    setSearchQuery,
    setStatusFilter,
    toggleEventExpanded,
    openBranchBooks,
    closeBranchBooks,
    setBranchBooksSearchQuery,
    setBranchBooksLanguageFilter,
    setBranchBooksCategoryFilter,
    setBranchBooksAuthorFilter,
    setBranchBooksTranslatorFilter,
    resetBranchBooksFilters,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    openViewDialog,
    closeViewDialog,
    saveEvent,
    reload: loadAll,
  }
}

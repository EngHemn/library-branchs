"use client"

import { useEffect, useMemo, useState } from "react"

import type {
  Booking,
  BookingStats,
  BookingStatus,
  BookingType,
} from "@/domain/entities/booking/Booking"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"

export type BookingStatusFilter = "all" | BookingStatus
export type BookingTypeFilter = "all" | BookingType
export type BookingBranchFilter = "all" | string

export type BookingFilterState = {
  searchQuery: string
  statusFilter: BookingStatusFilter
  typeFilter: BookingTypeFilter
  branchFilter: BookingBranchFilter
}

type BookingsPageStatus = "idle" | "loading" | "ready" | "error"

type BookingsViewModelState = {
  status: BookingsPageStatus
  bookings: Booking[]
  filteredBookings: Booking[]
  stats: BookingStats
  branches: string[]
  filters: BookingFilterState
  error: string | null
  isLoading: boolean
  isReady: boolean
  isActionPending: boolean
}

type BookingsViewModel = {
  state: BookingsViewModelState
  setSearchQuery: (searchQuery: string) => void
  setStatusFilter: (statusFilter: BookingStatusFilter) => void
  setTypeFilter: (typeFilter: BookingTypeFilter) => void
  setBranchFilter: (branchFilter: BookingBranchFilter) => void
  returnBooking: (bookingId: string) => Promise<void>
  extendBooking: (bookingId: string) => Promise<void>
  cancelBooking: (bookingId: string) => Promise<void>
  deleteBooking: (bookingId: string) => Promise<void>
  reload: () => Promise<void>
}

const defaultFilters: BookingFilterState = {
  searchQuery: "",
  statusFilter: "all",
  typeFilter: "all",
  branchFilter: "all",
}

const emptyStats: BookingStats = {
  reserved: 0,
  borrowed: 0,
  returned: 0,
  overdue: 0,
  cancelled: 0,
  inside: 0,
  outside: 0,
}

function matchesBookingSearch(booking: Booking, searchQuery: string): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return [
    booking.bookingId,
    booking.bookTitle,
    booking.memberName,
    booking.branchName,
  ].some((value) => value.toLowerCase().includes(normalizedQuery))
}

function filterBookings(
  bookings: Booking[],
  filters: BookingFilterState
): Booking[] {
  return bookings.filter(
    (booking) =>
      matchesBookingSearch(booking, filters.searchQuery) &&
      (filters.statusFilter === "all" ||
        booking.status === filters.statusFilter) &&
      (filters.typeFilter === "all" || booking.type === filters.typeFilter) &&
      (filters.branchFilter === "all" ||
        booking.branchName === filters.branchFilter)
  )
}

function getUniqueBranches(bookings: Booking[]): string[] {
  const branchSet = new Set(bookings.map((booking) => booking.branchName))
  return Array.from(branchSet).sort()
}

function calculateBookingStats(bookings: Booking[]): BookingStats {
  return {
    reserved: bookings.filter((booking) => booking.status === "reserved").length,
    borrowed: bookings.filter((booking) => booking.status === "borrowed").length,
    returned: bookings.filter((booking) => booking.status === "returned").length,
    overdue: bookings.filter((booking) => booking.status === "overdue").length,
    cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
    inside: bookings.filter((booking) => booking.type === "inside").length,
    outside: bookings.filter((booking) => booking.type === "outside").length,
  }
}

function replaceBooking(bookings: Booking[], updated: Booking): Booking[] {
  return bookings.map((booking) =>
    booking.id === updated.id ? updated : booking
  )
}

export function useBookingsViewModel(
  bookingManagementUseCase: BookingManagementUseCase
): BookingsViewModel {
  const [status, setStatus] = useState<BookingsPageStatus>("idle")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<BookingStats>(emptyStats)
  const [filters, setFilters] = useState<BookingFilterState>(defaultFilters)
  const [error, setError] = useState<string | null>(null)
  const [isActionPending, setIsActionPending] = useState(false)

  async function loadBookings(): Promise<void> {
    setStatus("loading")
    setError(null)

    const result = await bookingManagementUseCase.getBookings()

    if (!result.success) {
      setBookings([])
      setStats(emptyStats)
      setStatus("error")
      setError(result.error)
      return
    }

    setBookings(result.data.bookings)
    setStats(result.data.stats)
    setStatus("ready")
  }

  useEffect(() => {
    void loadBookings()
  }, [bookingManagementUseCase])

  async function returnBooking(bookingId: string): Promise<void> {
    setIsActionPending(true)
    setError(null)

    const result = await bookingManagementUseCase.returnBooking(bookingId)

    if (!result.success) {
      setIsActionPending(false)
      setError(result.error)
      return
    }

    setBookings((current) => {
      const next = replaceBooking(current, result.data)
      setStats(calculateBookingStats(next))
      return next
    })
    setIsActionPending(false)
  }

  async function extendBooking(bookingId: string): Promise<void> {
    setIsActionPending(true)
    setError(null)

    const result = await bookingManagementUseCase.extendBooking(bookingId)

    if (!result.success) {
      setIsActionPending(false)
      setError(result.error)
      return
    }

    setBookings((current) => {
      const next = replaceBooking(current, result.data)
      setStats(calculateBookingStats(next))
      return next
    })
    setIsActionPending(false)
  }

  async function cancelBooking(bookingId: string): Promise<void> {
    setIsActionPending(true)
    setError(null)

    const result = await bookingManagementUseCase.cancelBooking(bookingId)

    if (!result.success) {
      setIsActionPending(false)
      setError(result.error)
      return
    }

    setBookings((current) => {
      const next = replaceBooking(current, result.data)
      setStats(calculateBookingStats(next))
      return next
    })
    setIsActionPending(false)
  }

  async function deleteBooking(bookingId: string): Promise<void> {
    setIsActionPending(true)
    setError(null)

    const result = await bookingManagementUseCase.deleteBooking(bookingId)

    if (!result.success) {
      setIsActionPending(false)
      setError(result.error)
      return
    }

    setBookings((current) => {
      const next = current.filter((booking) => booking.id !== bookingId)
      setStats(calculateBookingStats(next))
      return next
    })
    setIsActionPending(false)
  }

  const branches = useMemo(() => getUniqueBranches(bookings), [bookings])

  const filteredBookings = useMemo(
    () => filterBookings(bookings, filters),
    [bookings, filters]
  )

  const state = useMemo<BookingsViewModelState>(
    () => ({
      status,
      bookings,
      filteredBookings,
      stats,
      branches,
      filters,
      error: status === "error" ? error : error,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "ready",
      isActionPending,
    }),
    [
      bookings,
      branches,
      error,
      filteredBookings,
      filters,
      isActionPending,
      stats,
      status,
    ]
  )

  return {
    state,
    setSearchQuery: (searchQuery) => {
      setFilters((current) => ({ ...current, searchQuery }))
    },
    setStatusFilter: (statusFilter) => {
      setFilters((current) => ({ ...current, statusFilter }))
    },
    setTypeFilter: (typeFilter) => {
      setFilters((current) => ({ ...current, typeFilter }))
    },
    setBranchFilter: (branchFilter) => {
      setFilters((current) => ({ ...current, branchFilter }))
    },
    returnBooking,
    extendBooking,
    cancelBooking,
    deleteBooking,
    reload: loadBookings,
  }
}

"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  Booking,
  BookingStats,
  BookingStatus,
  BookingType,
} from "@/domain/entities/booking/Booking"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import type { BookingBranchFilter, BookingFilterState, BookingStatusFilter, BookingTypeFilter, BookingsPageStatus, BookingsViewModelState } from "./BookingsViewModelState"
export type { BookingStatusFilter } from "./BookingsViewModelState"
export type { BookingTypeFilter } from "./BookingsViewModelState"
export type { BookingBranchFilter } from "./BookingsViewModelState"
export type { BookingFilterState } from "./BookingsViewModelState"

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

export function useBookingsViewModel(
  bookingManagementUseCase: BookingManagementUseCase
): BookingsViewModel {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<BookingFilterState>(defaultFilters)
  const [actionError, setActionError] = useState<string | null>(null)

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const result = await bookingManagementUseCase.getBookings()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const { mutateAsync: returnBookingAsync, isPending: isReturning } =
    useMutation({
      mutationFn: async (bookingId: string) => {
        const result = await bookingManagementUseCase.returnBooking(bookingId)
        if (!result.success) throw new Error(result.error)
        return result.data
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
      onError: (err: Error) => setActionError(err.message),
    })

  const { mutateAsync: extendBookingAsync, isPending: isExtending } =
    useMutation({
      mutationFn: async (bookingId: string) => {
        const result = await bookingManagementUseCase.extendBooking(bookingId)
        if (!result.success) throw new Error(result.error)
        return result.data
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
      onError: (err: Error) => setActionError(err.message),
    })

  const { mutateAsync: cancelBookingAsync, isPending: isCancelling } =
    useMutation({
      mutationFn: async (bookingId: string) => {
        const result = await bookingManagementUseCase.cancelBooking(bookingId)
        if (!result.success) throw new Error(result.error)
        return result.data
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
      onError: (err: Error) => setActionError(err.message),
    })

  const { mutateAsync: deleteBookingAsync, isPending: isDeleting } =
    useMutation({
      mutationFn: async (bookingId: string) => {
        const result = await bookingManagementUseCase.deleteBooking(bookingId)
        if (!result.success) throw new Error(result.error)
        return result.data
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
      onError: (err: Error) => setActionError(err.message),
    })

  const bookings = bookingsQuery.data?.bookings ?? []
  const stats = bookingsQuery.data?.stats ?? emptyStats
  const filteredBookings = filterBookings(bookings, filters)
  const branches = getUniqueBranches(bookings)
  const isActionPending = isReturning || isExtending || isCancelling || isDeleting

  const status: BookingsPageStatus = bookingsQuery.isPending
    ? "loading"
    : bookingsQuery.isError
      ? "error"
      : bookingsQuery.isSuccess
        ? "ready"
        : "idle"

  const queryError = bookingsQuery.isError
    ? bookingsQuery.error instanceof Error
      ? bookingsQuery.error.message
      : String(bookingsQuery.error)
    : null

  function setSearchQuery(searchQuery: string): void {
    setFilters((current) => ({ ...current, searchQuery }))
  }

  function setStatusFilter(statusFilter: BookingStatusFilter): void {
    setFilters((current) => ({ ...current, statusFilter }))
  }

  function setTypeFilter(typeFilter: BookingTypeFilter): void {
    setFilters((current) => ({ ...current, typeFilter }))
  }

  function setBranchFilter(branchFilter: BookingBranchFilter): void {
    setFilters((current) => ({ ...current, branchFilter }))
  }

  async function returnBooking(bookingId: string): Promise<void> {
    setActionError(null)
    await returnBookingAsync(bookingId)
  }

  async function extendBooking(bookingId: string): Promise<void> {
    setActionError(null)
    await extendBookingAsync(bookingId)
  }

  async function cancelBooking(bookingId: string): Promise<void> {
    setActionError(null)
    await cancelBookingAsync(bookingId)
  }

  async function deleteBooking(bookingId: string): Promise<void> {
    setActionError(null)
    await deleteBookingAsync(bookingId)
  }

  async function reload(): Promise<void> {
    await bookingsQuery.refetch()
  }

  const state: BookingsViewModelState = {
    status,
    bookings,
    filteredBookings,
    stats,
    branches,
    filters,
    error: queryError ?? actionError,
    isLoading: bookingsQuery.isPending,
    isReady: bookingsQuery.isSuccess,
    isActionPending,
  }

  return {
    state,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    setBranchFilter,
    returnBooking,
    extendBooking,
    cancelBooking,
    deleteBooking,
    reload,
  }
}

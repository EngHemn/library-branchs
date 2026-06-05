"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  Booking,
  BookingStats,
  BookingStatus,
  BookingType,
} from "@/domain/entities/booking/Booking"
<<<<<<< HEAD
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import { fakeBranches } from "@/data/fake/fakeBranches"
import {
  getDashboardBranchScope,
  matchesDashboardBranchFilter,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"
import type {
  BookingBranchFilter,
  BookingFilterState,
  BookingStatusFilter,
  BookingTypeFilter,
  BookingsPageStatus,
  BookingsViewModelState,
} from "./BookingsViewModelState"
export type { BookingBranchFilter } from "./BookingsViewModelState"
=======
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import type { BookingFilterState, BookingStatusFilter, BookingTypeFilter, BookingsPageStatus, BookingsViewModelState } from "./BookingsViewModelState"
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
export type { BookingStatusFilter } from "./BookingsViewModelState"
export type { BookingTypeFilter } from "./BookingsViewModelState"
export type { BookingFilterState } from "./BookingsViewModelState"

type BookingsViewModel = {
  state: BookingsViewModelState
  setSearchQuery: (searchQuery: string) => void
  setStatusFilter: (statusFilter: BookingStatusFilter) => void
  setTypeFilter: (typeFilter: BookingTypeFilter) => void
<<<<<<< HEAD
  setBranchFilter: (branchFilter: BookingBranchFilter) => void
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
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
<<<<<<< HEAD
  branchFilter: "current",
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
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

<<<<<<< HEAD
function matchesBookingBranchFilter(
  bookingBranchId: string,
  branchFilter: BookingBranchFilter,
  userBranchId: string,
  scopedBranchIds: string[]
): boolean {
  if (branchFilter === "current") {
    return bookingBranchId === userBranchId
  }

  return matchesDashboardBranchFilter(
    bookingBranchId,
    branchFilter,
    scopedBranchIds
  )
}

function filterBookings(
  bookings: Booking[],
  filters: BookingFilterState,
  userBranchId: string,
  scopedBranchIds: string[]
=======
function filterBookings(
  bookings: Booking[],
  filters: BookingFilterState
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
): Booking[] {
  return bookings.filter(
    (booking) =>
      matchesBookingSearch(booking, filters.searchQuery) &&
      (filters.statusFilter === "all" ||
        booking.status === filters.statusFilter) &&
<<<<<<< HEAD
      (filters.typeFilter === "all" || booking.type === filters.typeFilter) &&
      matchesBookingBranchFilter(
        booking.branchId,
        filters.branchFilter,
        userBranchId,
        scopedBranchIds
      )
=======
      (filters.typeFilter === "all" || booking.type === filters.typeFilter)
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
  )
}

export function useBookingsViewModel(
<<<<<<< HEAD
  authUseCase: AuthUseCase,
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
  bookingManagementUseCase: BookingManagementUseCase
): BookingsViewModel {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<BookingFilterState>(defaultFilters)
  const [actionError, setActionError] = useState<string | null>(null)

<<<<<<< HEAD
  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
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

<<<<<<< HEAD
  const user = userQuery.data ?? null
  const bookings = bookingsQuery.data?.bookings ?? []
  const stats = bookingsQuery.data?.stats ?? emptyStats

  const allBranches = fakeBranches.map((branch) => ({
    id: branch.id,
    name: branch.branchName,
  }))
  const branchScope = user ? getDashboardBranchScope(user, allBranches) : null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const scopedBranchIds = branchScope?.branchIds ?? []
  const filteredBookings = filterBookings(
    bookings,
    filters,
    userBranchId,
    scopedBranchIds
  )
  const isActionPending = isReturning || isExtending || isCancelling || isDeleting

  const isLoading = userQuery.isPending || bookingsQuery.isPending

  const status: BookingsPageStatus = isLoading
    ? "loading"
    : userQuery.isError || bookingsQuery.isError
      ? "error"
      : userQuery.isSuccess && bookingsQuery.isSuccess
        ? "ready"
        : "idle"

  const queryError =
    userQuery.isError || bookingsQuery.isError
      ? userQuery.error instanceof Error
        ? userQuery.error.message
        : bookingsQuery.error instanceof Error
          ? bookingsQuery.error.message
          : String(userQuery.error ?? bookingsQuery.error)
      : null
=======
  const bookings = bookingsQuery.data?.bookings ?? []
  const stats = bookingsQuery.data?.stats ?? emptyStats
  const filteredBookings = filterBookings(bookings, filters)
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
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013

  function setSearchQuery(searchQuery: string): void {
    setFilters((current) => ({ ...current, searchQuery }))
  }

  function setStatusFilter(statusFilter: BookingStatusFilter): void {
    setFilters((current) => ({ ...current, statusFilter }))
  }

  function setTypeFilter(typeFilter: BookingTypeFilter): void {
    setFilters((current) => ({ ...current, typeFilter }))
  }

<<<<<<< HEAD
  function setBranchFilter(branchFilter: BookingBranchFilter): void {
    if (user?.branchType === "sub") return
    setFilters((current) => ({ ...current, branchFilter }))
  }

=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
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
<<<<<<< HEAD
    await Promise.all([userQuery.refetch(), bookingsQuery.refetch()])
  }

  const showBranchFilter = user?.branchType !== "sub"
  const showBranchColumn =
    showBranchFilter && filters.branchFilter !== "current"
  const filterBranches = (branchScope?.branches ?? []).filter(
    (branch) => branch.id !== userBranchId
  )
  const currentBranchName =
    branchScope?.branches.find((branch) => branch.id === userBranchId)?.name ??
    ""

=======
    await bookingsQuery.refetch()
  }

>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
  const state: BookingsViewModelState = {
    status,
    bookings,
    filteredBookings,
    stats,
    filters,
<<<<<<< HEAD
    branches: filterBranches,
    currentBranchName,
    showBranchFilter,
    showBranchColumn,
    error: queryError ?? actionError,
    isLoading,
    isReady: userQuery.isSuccess && bookingsQuery.isSuccess,
=======
    error: queryError ?? actionError,
    isLoading: bookingsQuery.isPending,
    isReady: bookingsQuery.isSuccess,
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
    isActionPending,
  }

  return {
    state,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
<<<<<<< HEAD
    setBranchFilter,
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
    returnBooking,
    extendBooking,
    cancelBooking,
    deleteBooking,
    reload,
  }
}

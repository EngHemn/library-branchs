"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fakeBranches } from "@/data/fake/fakeBranches"
import type {
  Booking,
  BookingStats,
} from "@/domain/entities/booking/Booking"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import {
  getDashboardBranchScope,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"
import type {
  BookingBranchFilter,
  BookingBranchFilterOption,
  BookingFilterState,
  BookingStatusFilter,
  BookingTypeFilter,
  BookingsPageStatus,
  BookingsViewModelState,
} from "./BookingsViewModelState"
export type { BookingStatusFilter } from "./BookingsViewModelState"
export type { BookingTypeFilter } from "./BookingsViewModelState"
export type { BookingBranchFilter } from "./BookingsViewModelState"
export type { BookingBranchFilterOption } from "./BookingsViewModelState"
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
  branchFilter: "current",
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

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

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

function resolveBranchFilterId(
  branchFilter: BookingBranchFilter,
  userBranchId: string
): string {
  return branchFilter === "current" ? userBranchId : branchFilter
}

function filterBookings(
  bookings: Booking[],
  filters: BookingFilterState,
  userBranchId: string,
  isSubBranch: boolean
): Booking[] {
  const effectiveBranchId = isSubBranch
    ? userBranchId
    : resolveBranchFilterId(filters.branchFilter, userBranchId)

  return bookings.filter(
    (booking) =>
      booking.branchId === effectiveBranchId &&
      matchesBookingSearch(booking, filters.searchQuery) &&
      (filters.statusFilter === "all" ||
        booking.status === filters.statusFilter) &&
      (filters.typeFilter === "all" || booking.type === filters.typeFilter)
  )
}

function getBranchFilterOptions(user: User): BookingBranchFilterOption[] {
  if (user.branchType === "sub") {
    return []
  }

  const userBranchId = resolveUserBranchId(user)
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)

  const otherBranches = branchScope.branches
    .filter((branch) => branch.id !== userBranchId)
    .map((branch) => ({ value: branch.id, label: branch.name }))
    .sort((left, right) => left.label.localeCompare(right.label))

  return [{ value: "current", label: "Current Branch" }, ...otherBranches]
}

export function useBookingsViewModel(
  authUseCase: AuthUseCase,
  bookingManagementUseCase: BookingManagementUseCase
): BookingsViewModel {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<BookingFilterState>(defaultFilters)
  const [actionError, setActionError] = useState<string | null>(null)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const result = await bookingManagementUseCase.getBookings()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
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

  const user = userQuery.data ?? null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const isSubBranch = user?.branchType === "sub"
  const showBranchFilter = !isSubBranch
  const showBranchColumn = !isSubBranch && filters.branchFilter !== "current"
  const branchFilterOptions = user ? getBranchFilterOptions(user) : []

  const bookings = bookingsQuery.data?.bookings ?? []
  const stats = bookingsQuery.data?.stats ?? emptyStats
  const filteredBookings = userBranchId
    ? filterBookings(bookings, filters, userBranchId, isSubBranch)
    : []
  const isActionPending = isReturning || isExtending || isCancelling || isDeleting

  const status: BookingsPageStatus =
    userQuery.isPending || bookingsQuery.isPending
      ? "loading"
      : userQuery.isError || bookingsQuery.isError
        ? "error"
        : userQuery.isSuccess && bookingsQuery.isSuccess
          ? "ready"
          : "idle"

  const queryError =
    userQuery.error instanceof Error
      ? userQuery.error.message
      : bookingsQuery.error instanceof Error
        ? bookingsQuery.error.message
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
    await Promise.all([userQuery.refetch(), bookingsQuery.refetch()])
  }

  const state: BookingsViewModelState = {
    status,
    bookings,
    filteredBookings,
    stats,
    filters,
    branchFilterOptions,
    showBranchFilter,
    showBranchColumn,
    error: queryError ?? actionError,
    isLoading: userQuery.isPending || bookingsQuery.isPending,
    isReady: userQuery.isSuccess && bookingsQuery.isSuccess,
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

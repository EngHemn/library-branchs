"use client"

import type {
  Booking,
  BookingStats,
  BookingStatus,
  BookingType,
} from "@/domain/entities/booking/Booking"

export type BookingStatusFilter = "all" | BookingStatus
export type BookingTypeFilter = "all" | BookingType
<<<<<<< HEAD
export type BookingBranchFilter = "current" | "all" | string

export type BookingBranchOption = {
  id: string
  name: string
}
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013

export type BookingFilterState = {
  searchQuery: string
  statusFilter: BookingStatusFilter
  typeFilter: BookingTypeFilter
<<<<<<< HEAD
  branchFilter: BookingBranchFilter
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
}

export type BookingsPageStatus = "idle" | "loading" | "ready" | "error"

export type BookingsViewModelState = {
  status: BookingsPageStatus
  bookings: Booking[]
  filteredBookings: Booking[]
  stats: BookingStats
  filters: BookingFilterState
<<<<<<< HEAD
  branches: BookingBranchOption[]
  currentBranchName: string
  showBranchFilter: boolean
  showBranchColumn: boolean
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
  error: string | null
  isLoading: boolean
  isReady: boolean
  isActionPending: boolean
}

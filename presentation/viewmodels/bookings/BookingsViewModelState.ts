"use client"

import type {
  Booking,
  BookingStats,
  BookingStatus,
  BookingType,
} from "@/domain/entities/booking/Booking"

export type BookingStatusFilter = "all" | BookingStatus
export type BookingTypeFilter = "all" | BookingType
export type BookingBranchFilter = "all" | string

export type BookingFilterState = {
  searchQuery: string
  statusFilter: BookingStatusFilter
  typeFilter: BookingTypeFilter
  branchFilter: BookingBranchFilter
}

export type BookingsPageStatus = "idle" | "loading" | "ready" | "error"

export type BookingsViewModelState = {
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

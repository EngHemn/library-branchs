"use client"

import type {
  Booking,
  BookingStats,
  BookingStatus,
  BookingType,
} from "@/domain/entities/booking/Booking"

export type BookingStatusFilter = "all" | BookingStatus
export type BookingTypeFilter = "all" | BookingType
export type BookingBranchFilter = "current" | string

export type BookingBranchFilterOption = {
  value: string
  label: string
}

export type BookingFilterState = {
  searchQuery: string
  statusFilter: BookingStatusFilter
  typeFilter: BookingTypeFilter
  branchFilter: BookingBranchFilter
  dateFrom: string | null
  dateTo: string | null
}

export type BookingsPageStatus = "idle" | "loading" | "ready" | "error"

export type BookingsViewModelState = {
  status: BookingsPageStatus
  bookings: Booking[]
  filteredBookings: Booking[]
  stats: BookingStats
  filters: BookingFilterState
  branchFilterOptions: BookingBranchFilterOption[]
  showBranchFilter: boolean
  showBranchColumn: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isActionPending: boolean
}

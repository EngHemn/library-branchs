"use client"

import type {
  Booking,
  BookingStats,
  BookingStatus,
  BookingType,
} from "@/domain/entities/booking/Booking"

export type BookingStatusFilter = "all" | BookingStatus
export type BookingTypeFilter = "all" | BookingType
export type BookingBranchFilter = "current" | "all" | string

export type BookingBranchOption = {
  id: string
  name: string
}

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
  filters: BookingFilterState
  branches: BookingBranchOption[]
  currentBranchName: string
  showBranchFilter: boolean
  showBranchColumn: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isActionPending: boolean
}

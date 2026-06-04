"use client"

import type {
  DashboardBooking,
  DashboardBook,
  DashboardMember,
  DashboardSale,
  DashboardStaff,
  DashboardSummary,
} from "@/domain/entities/dashboard/DashboardSummary"
import type { User } from "@/domain/entities/User"

export type DateRangeFilter = "today" | "week" | "month" | "all"

export type DashboardFilterState = {
  branchId: string
  dateRange: DateRangeFilter
}

export type DashboardStatus = "idle" | "loading" | "success" | "unauthenticated" | "error"

export type DashboardViewModelState = {
  status: DashboardStatus
  user: User | null
  summary: DashboardSummary | null
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
  filterState: DashboardFilterState
  filteredBookings: DashboardBooking[]
  filteredBooks: DashboardBook[]
  filteredMembers: DashboardMember[]
  filteredSales: DashboardSale[]
  filteredStaff: DashboardStaff[]
}

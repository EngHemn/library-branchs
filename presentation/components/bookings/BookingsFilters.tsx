"use client"

import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  BookingBranchFilter,
  BookingStatusFilter,
  BookingTypeFilter,
} from "@/presentation/viewmodels/bookings/useBookingsViewModel"

type BookingsFiltersProps = {
  searchQuery: string
  statusFilter: BookingStatusFilter
  typeFilter: BookingTypeFilter
  branchFilter: BookingBranchFilter
  branches: string[]
  onSearchQueryChange: (searchQuery: string) => void
  onStatusFilterChange: (statusFilter: BookingStatusFilter) => void
  onTypeFilterChange: (typeFilter: BookingTypeFilter) => void
  onBranchFilterChange: (branchFilter: BookingBranchFilter) => void
}

const statusOptions: { value: BookingStatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "reserved", label: "Reserved" },
  { value: "borrowed", label: "Borrowed" },
  { value: "returned", label: "Returned" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
]

const typeOptions: { value: BookingTypeFilter; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "inside", label: "Inside" },
  { value: "outside", label: "Outside" },
]

function isBookingStatusFilter(value: string): value is BookingStatusFilter {
  return (
    value === "all" ||
    value === "reserved" ||
    value === "borrowed" ||
    value === "returned" ||
    value === "overdue" ||
    value === "cancelled"
  )
}

function isBookingTypeFilter(value: string): value is BookingTypeFilter {
  return value === "all" || value === "inside" || value === "outside"
}

function isBookingBranchFilter(
  value: string,
  branches: string[]
): value is BookingBranchFilter {
  return value === "all" || branches.includes(value)
}

export function BookingsFilters({
  searchQuery,
  statusFilter,
  typeFilter,
  branchFilter,
  branches,
  onSearchQueryChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onBranchFilterChange,
}: BookingsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search bookings..."
          className="pl-9"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            if (isBookingStatusFilter(value)) {
              onStatusFilterChange(value)
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(value) => {
            if (isBookingTypeFilter(value)) {
              onTypeFilterChange(value)
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={branchFilter}
          onValueChange={(value) => {
            if (isBookingBranchFilter(value, branches)) {
              onBranchFilterChange(value)
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

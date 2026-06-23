"use client"

import { useMemo } from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  BookingBranchFilter,
  BookingBranchFilterOption,
  BookingStatusFilter,
  BookingTypeFilter,
} from "@/presentation/viewmodels/bookings/useBookingsViewModel"

type BookingsFiltersProps = {
  searchQuery: string
  statusFilter: BookingStatusFilter
  typeFilter: BookingTypeFilter
  branchFilter: BookingBranchFilter
  dateFrom: string | null
  dateTo: string | null
  branchFilterOptions: BookingBranchFilterOption[]
  showBranchFilter?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onStatusFilterChange: (statusFilter: BookingStatusFilter) => void
  onTypeFilterChange: (typeFilter: BookingTypeFilter) => void
  onBranchFilterChange: (branchFilter: BookingBranchFilter) => void
  onDateFromChange: (dateFrom: string | null) => void
  onDateToChange: (dateTo: string | null) => void
}

const STATUS_FILTER_KEYS: Record<BookingStatusFilter, TranslationKey> = {
  all: "bookings.filters.allStatus",
  reserved: "bookings.statuses.reserved",
  borrowed: "bookings.statuses.borrowed",
  returned: "bookings.statuses.returned",
  overdue: "bookings.statuses.overdue",
  cancelled: "bookings.statuses.cancelled",
}

const TYPE_FILTER_KEYS: Record<BookingTypeFilter, TranslationKey> = {
  all: "bookings.filters.allTypes",
  inside: "bookings.types.inside",
  outside: "bookings.types.outside",
}

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

export function BookingsFilters({
  searchQuery,
  statusFilter,
  typeFilter,
  branchFilter,
  dateFrom,
  dateTo,
  branchFilterOptions,
  showBranchFilter = false,
  onSearchQueryChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onBranchFilterChange,
  onDateFromChange,
  onDateToChange,
}: BookingsFiltersProps) {
  const { t } = useTranslation()

  const statusOptions = useMemo(
    () =>
      (Object.keys(STATUS_FILTER_KEYS) as BookingStatusFilter[]).map(
        (value) => ({
          value,
          label: t(STATUS_FILTER_KEYS[value]),
        })
      ),
    [t]
  )

  const typeOptions = useMemo(
    () =>
      (Object.keys(TYPE_FILTER_KEYS) as BookingTypeFilter[]).map((value) => ({
        value,
        label: t(TYPE_FILTER_KEYS[value]),
      })),
    [t]
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("bookings.filters.searchPlaceholder")}
          className="pl-9"
        />
      </div>
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
      {showBranchFilter ? (
        <Select value={branchFilter} onValueChange={onBranchFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {branchFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.value === "current"
                  ? t("bookings.filters.currentBranch")
                  : option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
      <Input
        id="bookings-date-from"
        type="date"
        aria-label={t("bookings.filters.dateFrom")}
        className="w-full sm:w-[150px]"
        value={dateFrom ?? ""}
        max={dateTo ?? undefined}
        onChange={(event) => onDateFromChange(event.target.value || null)}
      />
      <Input
        id="bookings-date-to"
        type="date"
        aria-label={t("bookings.filters.dateTo")}
        className="w-full sm:w-[150px]"
        value={dateTo ?? ""}
        min={dateFrom ?? undefined}
        onChange={(event) => onDateToChange(event.target.value || null)}
      />
    </div>
  )
}

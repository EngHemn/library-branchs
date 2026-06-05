"use client"

import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  SalesHistoryBranchFilter,
  SalesHistoryBranchFilterOption,
  SalesHistoryStatusFilter,
} from "@/presentation/viewmodels/sales/useSalesHistoryViewModel"

type SalesHistoryFiltersProps = {
  searchQuery: string
  statusFilter: SalesHistoryStatusFilter
  branchFilter: SalesHistoryBranchFilter
  dateFrom: string | null
  dateTo: string | null
  branchFilterOptions: SalesHistoryBranchFilterOption[]
  showBranchFilter?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onStatusFilterChange: (statusFilter: SalesHistoryStatusFilter) => void
  onBranchFilterChange: (branchFilter: SalesHistoryBranchFilter) => void
  onDateFromChange: (dateFrom: string | null) => void
  onDateToChange: (dateTo: string | null) => void
}

const statusOptions: { value: SalesHistoryStatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "voided", label: "Voided" },
]

const STATUS_FILTER_VALUES = new Set<string>(
  statusOptions.map((option) => option.value)
)

function isSalesHistoryStatusFilter(
  value: string
): value is SalesHistoryStatusFilter {
  return STATUS_FILTER_VALUES.has(value)
}

export function SalesHistoryFilters({
  searchQuery,
  statusFilter,
  branchFilter,
  dateFrom,
  dateTo,
  branchFilterOptions,
  showBranchFilter = false,
  onSearchQueryChange,
  onStatusFilterChange,
  onBranchFilterChange,
  onDateFromChange,
  onDateToChange,
}: SalesHistoryFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by book name..."
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="sales-history-status-filter">Filter by Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (isSalesHistoryStatusFilter(value)) {
                onStatusFilterChange(value)
              }
            }}
          >
            <SelectTrigger id="sales-history-status-filter" className="w-full">
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
        </div>

        {showBranchFilter ? (
          <div className="space-y-2">
            <Label htmlFor="sales-history-branch-filter">Filter by Branch</Label>
            <Select value={branchFilter} onValueChange={onBranchFilterChange}>
              <SelectTrigger id="sales-history-branch-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branchFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="sales-history-date-from">Date From</Label>
          <Input
            id="sales-history-date-from"
            type="date"
            value={dateFrom ?? ""}
            max={dateTo ?? undefined}
            onChange={(event) =>
              onDateFromChange(event.target.value || null)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sales-history-date-to">Date To</Label>
          <Input
            id="sales-history-date-to"
            type="date"
            value={dateTo ?? ""}
            min={dateFrom ?? undefined}
            onChange={(event) => onDateToChange(event.target.value || null)}
          />
        </div>
      </div>
    </div>
  )
}

"use client"

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
  GroupBranchFilterOption,
  GroupSalesBranchFilter,
} from "@/presentation/viewmodels/groups/GroupDetailViewModelState"

type GroupSalesHistoryFiltersProps = {
  branchFilter: GroupSalesBranchFilter
  dateFrom: string | null
  dateTo: string | null
  branchFilterOptions: GroupBranchFilterOption[]
  showBranchFilter?: boolean
  onBranchFilterChange: (branchFilter: GroupSalesBranchFilter) => void
  onDateFromChange: (dateFrom: string | null) => void
  onDateToChange: (dateTo: string | null) => void
}

export function GroupSalesHistoryFilters({
  branchFilter,
  dateFrom,
  dateTo,
  branchFilterOptions,
  showBranchFilter = false,
  onBranchFilterChange,
  onDateFromChange,
  onDateToChange,
}: GroupSalesHistoryFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {showBranchFilter ? (
        <div className="space-y-2">
          <Label htmlFor="group-sales-branch-filter">Branch</Label>
          <Select value={branchFilter} onValueChange={onBranchFilterChange}>
            <SelectTrigger id="group-sales-branch-filter" className="w-full">
              <SelectValue placeholder="Current branch" />
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
        <Label htmlFor="group-sales-date-from">Date From</Label>
        <Input
          id="group-sales-date-from"
          type="date"
          value={dateFrom ?? ""}
          max={dateTo ?? undefined}
          onChange={(event) => onDateFromChange(event.target.value || null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="group-sales-date-to">Date To</Label>
        <Input
          id="group-sales-date-to"
          type="date"
          value={dateTo ?? ""}
          min={dateFrom ?? undefined}
          onChange={(event) => onDateToChange(event.target.value || null)}
        />
      </div>
    </div>
  )
}

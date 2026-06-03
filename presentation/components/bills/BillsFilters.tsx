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
import type { Bill } from "@/domain/entities/bill/Bill"

type BillsFiltersProps = {
  bills: Bill[]
  searchQuery: string
  branchFilter: string
  onSearchQueryChange: (searchQuery: string) => void
  onBranchFilterChange: (branchFilter: string) => void
}

export function BillsFilters({
  bills,
  searchQuery,
  branchFilter,
  onSearchQueryChange,
  onBranchFilterChange,
}: BillsFiltersProps) {
  const branchOptions = Array.from(
    new Map(bills.map((bill) => [bill.branchId, bill.branchName])).entries()
  )

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search bills by company, branch, or phone..."
          className="pl-9"
        />
      </div>
      <Select value={branchFilter} onValueChange={onBranchFilterChange}>
        <SelectTrigger className="w-full sm:w-[220px]">
          <SelectValue placeholder="All branches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Branches</SelectItem>
          {branchOptions.map(([branchId, branchName]) => (
            <SelectItem key={branchId} value={branchId}>
              {branchName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

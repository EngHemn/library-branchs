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
import {
  SHELF_TYPES,
  getShelfTypeLabel,
} from "@/domain/entities/shelf/ShelfType"
import type { ShelfType } from "@/domain/entities/shelf/ShelfType"

export type ShelfBranchFilter = "all" | string

type ShelvesFiltersProps = {
  searchQuery: string
  branchFilter: ShelfBranchFilter
  shelfTypeFilter: "all" | ShelfType
  statusFilter: "all" | "active" | "inactive"
  branchOptions: Array<{ id: string; name: string }>
  showBranchFilter?: boolean
  onSearchQueryChange: (value: string) => void
  onBranchFilterChange: (value: ShelfBranchFilter) => void
  onShelfTypeFilterChange: (value: "all" | ShelfType) => void
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void
}

export function ShelvesFilters({
  searchQuery,
  branchFilter,
  shelfTypeFilter,
  statusFilter,
  branchOptions,
  showBranchFilter = true,
  onSearchQueryChange,
  onBranchFilterChange,
  onShelfTypeFilterChange,
  onStatusFilterChange,
}: ShelvesFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by name, branch, or location..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap lg:justify-end">
        {showBranchFilter ? (
          <Select
            value={branchFilter}
            onValueChange={(value) => onBranchFilterChange(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branchOptions.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <Select
          value={shelfTypeFilter}
          onValueChange={(value) =>
            onShelfTypeFilterChange(value as "all" | ShelfType)
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Shelf Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shelf Types</SelectItem>
            {SHELF_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {getShelfTypeLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            onStatusFilterChange(value as "all" | "active" | "inactive")
          }
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

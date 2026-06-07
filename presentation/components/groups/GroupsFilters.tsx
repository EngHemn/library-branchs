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
import type { GroupStatus } from "@/domain/entities/group/Group"

export type GroupStatusFilter = "all" | GroupStatus

type GroupsFiltersProps = {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  statusFilter: GroupStatusFilter
  onStatusFilterChange: (value: GroupStatusFilter) => void
}

export function GroupsFilters({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
}: GroupsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search groups by name or description..."
          className="pl-9"
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(value) =>
          onStatusFilterChange(value as GroupStatusFilter)
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

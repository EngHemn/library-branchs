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
import type { EventStatus } from "@/domain/entities/event/Event"

type EventStatusFilter = "all" | EventStatus

type EventsFiltersProps = {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  statusFilter: EventStatusFilter
  onStatusFilterChange: (value: EventStatusFilter) => void
}

const statusOptions: { value: EventStatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export function EventsFilters({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
}: EventsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="relative flex-1">
        <Label htmlFor="event-search" className="sr-only">
          Search events
        </Label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="event-search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Searchxxx by event name, ID, or branch..."
          className="pl-9 not-[]:"
        />
      </div>
      <div className="w-full flex items-center gap-1 sm:w-48">
        <Label htmlFor="event-status-filter" className="mb-1.5 block text-sm">
          Status
        </Label>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            onStatusFilterChange(value as EventStatusFilter)
          }
        >
          <SelectTrigger id="event-status-filter" className="w-full">
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
    </div>
  )
}

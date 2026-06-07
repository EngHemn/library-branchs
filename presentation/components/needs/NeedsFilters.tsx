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
import { NEED_CATEGORIES, getNeedCategoryLabel } from "@/domain/entities/need/NeedCategory"
import { NEED_PRIORITIES, getNeedPriorityLabel } from "@/domain/entities/need/NeedPriority"
import { NEED_STATUSES, getNeedStatusLabel } from "@/domain/entities/need/NeedStatus"
import type { NeedCategory } from "@/domain/entities/need/NeedCategory"
import type { NeedPriority } from "@/domain/entities/need/NeedPriority"
import type { NeedStatus } from "@/domain/entities/need/NeedStatus"

export type NeedCategoryFilter = "all" | NeedCategory
export type NeedPriorityFilter = "all" | NeedPriority
export type NeedStatusFilter = "all" | NeedStatus
export type NeedBranchFilter = "all" | string

type NeedsFiltersProps = {
  searchQuery: string
  categoryFilter: NeedCategoryFilter
  branchFilter: NeedBranchFilter
  priorityFilter: NeedPriorityFilter
  statusFilter: NeedStatusFilter
  dateFrom: string | null
  dateTo: string | null
  branchOptions: Array<{ id: string; name: string }>
  showBranchFilter?: boolean
  onSearchQueryChange: (value: string) => void
  onCategoryFilterChange: (value: NeedCategoryFilter) => void
  onBranchFilterChange: (value: NeedBranchFilter) => void
  onPriorityFilterChange: (value: NeedPriorityFilter) => void
  onStatusFilterChange: (value: NeedStatusFilter) => void
  onDateFromChange: (value: string | null) => void
  onDateToChange: (value: string | null) => void
}

export function NeedsFilters({
  searchQuery,
  categoryFilter,
  branchFilter,
  priorityFilter,
  statusFilter,
  dateFrom,
  dateTo,
  branchOptions,
  showBranchFilter = true,
  onSearchQueryChange,
  onCategoryFilterChange,
  onBranchFilterChange,
  onPriorityFilterChange,
  onStatusFilterChange,
  onDateFromChange,
  onDateToChange,
}: NeedsFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by need name, requester, or branch..."
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              onCategoryFilterChange(value as NeedCategoryFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {NEED_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {getNeedCategoryLabel(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showBranchFilter ? (
          <div className="space-y-2">
            <Label>Branch</Label>
            <Select
              value={branchFilter}
              onValueChange={(value) =>
                onBranchFilterChange(value as NeedBranchFilter)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All branches</SelectItem>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={priorityFilter}
            onValueChange={(value) =>
              onPriorityFilterChange(value as NeedPriorityFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {NEED_PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {getNeedPriorityLabel(priority)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as NeedStatusFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {NEED_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {getNeedStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="needs-date-from">Date From</Label>
          <Input
            id="needs-date-from"
            type="date"
            value={dateFrom ?? ""}
            max={dateTo ?? undefined}
            onChange={(event) =>
              onDateFromChange(event.target.value || null)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="needs-date-to">Date To</Label>
          <Input
            id="needs-date-to"
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

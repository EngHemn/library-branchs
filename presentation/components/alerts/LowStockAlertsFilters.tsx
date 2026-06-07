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

export type LowStockAlertStatusFilter = "all" | "active" | "resolved"
export type LowStockAlertBranchFilter = "all" | string

type LowStockAlertsFiltersProps = {
  searchQuery: string
  branchFilter: LowStockAlertBranchFilter
  statusFilter: LowStockAlertStatusFilter
  branchOptions: Array<{ id: string; name: string }>
  showBranchFilter?: boolean
  onSearchQueryChange: (value: string) => void
  onBranchFilterChange: (value: LowStockAlertBranchFilter) => void
  onStatusFilterChange: (value: LowStockAlertStatusFilter) => void
}

export function LowStockAlertsFilters({
  searchQuery,
  branchFilter,
  statusFilter,
  branchOptions,
  showBranchFilter = true,
  onSearchQueryChange,
  onBranchFilterChange,
  onStatusFilterChange,
}: LowStockAlertsFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by book title or ISBN..."
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {showBranchFilter ? (
          <div className="space-y-2">
            <Label>Branch</Label>
            <Select
              value={branchFilter}
              onValueChange={(value) =>
                onBranchFilterChange(value as LowStockAlertBranchFilter)
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
          <Label>Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as LowStockAlertStatusFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

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
  MemberBranchFilter,
  MemberStatusFilter,
} from "@/presentation/viewmodels/members/MembersViewModelState"

const MEMBER_STATUS_VALUES = new Set<string>(["all", "active", "inactive", "suspended"])

function isMemberStatusFilter(value: string): value is MemberStatusFilter {
  return MEMBER_STATUS_VALUES.has(value)
}

type MembersFiltersProps = {
  searchQuery: string
  statusFilter: MemberStatusFilter
  branchRegisteredFilter: MemberBranchFilter
  branchUsedFilter: MemberBranchFilter
  registeredBranches: string[]
  usedBranches: string[]
  showRegisterBranchFilter?: boolean
  showBranchUsedFilter?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onStatusFilterChange: (statusFilter: MemberStatusFilter) => void
  onBranchRegisteredFilterChange: (branchRegisteredFilter: MemberBranchFilter) => void
  onBranchUsedFilterChange: (branchUsedFilter: MemberBranchFilter) => void
}

const statusOptions: { value: MemberStatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
]

export function MembersFilters({
  searchQuery,
  statusFilter,
  branchRegisteredFilter,
  branchUsedFilter,
  registeredBranches,
  usedBranches,
  showRegisterBranchFilter = true,
  showBranchUsedFilter = true,
  onSearchQueryChange,
  onStatusFilterChange,
  onBranchRegisteredFilterChange,
  onBranchUsedFilterChange,
}: MembersFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by name, email, or phone..."
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            if (isMemberStatusFilter(value)) onStatusFilterChange(value)
          }}
        >
          <SelectTrigger className="w-[160px]">
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
        {showRegisterBranchFilter ? (
          <Select
            value={branchRegisteredFilter}
            onValueChange={onBranchRegisteredFilterChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Registered Branches</SelectItem>
              {registeredBranches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        {showBranchUsedFilter ? (
          <Select value={branchUsedFilter} onValueChange={onBranchUsedFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches Used</SelectItem>
              {usedBranches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>
    </div>
  )
}

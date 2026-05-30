"use client"

import { useEffect, useState } from "react"

const MEMBER_STATUS_VALUES = new Set<string>(["all", "active", "inactive", "suspended"])
function isMemberStatusFilter(value: string): value is MemberStatusFilter {
  return MEMBER_STATUS_VALUES.has(value)
}
import { ListFilterIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MemberStatus } from "@/domain/entities/member/Member"
import { MembersActiveFilters } from "@/presentation/components/members/MembersActiveFilters"
import type {
  MemberActiveFilter,
  MemberActiveFilterId,
  MemberFilterState,
} from "@/presentation/viewmodels/members/useMembersViewModel"

type MemberStatusFilter = "all" | MemberStatus
type MemberBranchFilter = "all" | string

type MembersFiltersProps = {
  appliedFilters: MemberFilterState
  activeFilters: MemberActiveFilter[]
  registeredBranches: string[]
  usedBranches: string[]
  onSearchQueryChange: (searchQuery: string) => void
  onApply: (filters: MemberFilterState) => void
  onClearFilter: (filterId: MemberActiveFilterId) => void
  onResetFilters: () => void
}

const defaultFilters: MemberFilterState = {
  searchQuery: "",
  statusFilter: "all",
  branchRegisteredFilter: "all",
  branchUsedFilter: "all",
  startDate: "",
  endDate: "",
}

const statusOptions: { value: MemberStatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
]

export function MembersFilters({
  appliedFilters,
  activeFilters,
  registeredBranches,
  usedBranches,
  onSearchQueryChange,
  onApply,
  onClearFilter,
  onResetFilters,
}: MembersFiltersProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<MemberFilterState>(appliedFilters)

  useEffect(() => {
    if (open) {
      setDraft(appliedFilters)
    }
  }, [open, appliedFilters])

  const updateDraft = (partial: Partial<MemberFilterState>): void => {
    setDraft((current) => ({ ...current, ...partial }))
  }

  const handleApply = (): void => {
    onApply({ ...draft, searchQuery: appliedFilters.searchQuery })
    setOpen(false)
  }

  const handleClearDraft = (): void => {
    setDraft({ ...defaultFilters, searchQuery: appliedFilters.searchQuery })
  }

  const handleResetAll = (): void => {
    onResetFilters()
    setDraft(defaultFilters)
    setOpen(false)
  }

  const dialogActiveCount = activeFilters.filter(
    (filter) => filter.id !== "search"
  ).length

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={appliedFilters.searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search by name, email, or phone..."
            className="pl-9"
          />
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          {activeFilters.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleResetAll}>
              Clear all
            </Button>
          ) : null}
          <Button variant="outline" onClick={() => setOpen(true)}>
            <ListFilterIcon />
            Filters
            {dialogActiveCount > 0 ? (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {dialogActiveCount}
              </span>
            ) : null}
          </Button>
        </div>
      </div>

      <MembersActiveFilters
        filters={activeFilters}
        onClearFilter={onClearFilter}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:min-w-[600px]">
          <DialogHeader>
            <DialogTitle>Filter Members</DialogTitle>
            <DialogDescription>
              Choose filters below, then click Apply to update the table.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Status</Label>
                <Select
                  value={draft.statusFilter}
                  onValueChange={(value) => {
                    if (isMemberStatusFilter(value)) updateDraft({ statusFilter: value })
                  }}
                >
                  <SelectTrigger className="w-full">
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

              <div className="flex flex-col gap-1.5">
                <Label>Registered Branch</Label>
                <Select
                  value={draft.branchRegisteredFilter}
                  onValueChange={(value) => updateDraft({ branchRegisteredFilter: value })}
                >
                  <SelectTrigger className="w-full">
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
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Branch Used</Label>
                <Select
                  value={draft.branchUsedFilter}
                  onValueChange={(value) => updateDraft({ branchUsedFilter: value })}
                >
                  <SelectTrigger className="w-full">
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
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="members-filter-start-date">
                  Registration From
                </Label>
                <Input
                  id="members-filter-start-date"
                  type="date"
                  value={draft.startDate}
                  onChange={(event) =>
                    updateDraft({ startDate: event.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="members-filter-end-date">Registration To</Label>
                <Input
                  id="members-filter-end-date"
                  type="date"
                  value={draft.endDate}
                  onChange={(event) =>
                    updateDraft({ endDate: event.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClearDraft}>
              Clear
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleApply}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

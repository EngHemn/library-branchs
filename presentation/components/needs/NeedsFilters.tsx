"use client"

import { useEffect, useMemo, useState } from "react"
import { ListFilterIcon, RotateCcwIcon, SearchIcon, XIcon } from "lucide-react"

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
import { NEED_CATEGORIES } from "@/domain/entities/need/NeedCategory"
import { NEED_PRIORITIES } from "@/domain/entities/need/NeedPriority"
import { NEED_STATUSES } from "@/domain/entities/need/NeedStatus"
import type { NeedCategory } from "@/domain/entities/need/NeedCategory"
import type { NeedPriority } from "@/domain/entities/need/NeedPriority"
import type { NeedStatus } from "@/domain/entities/need/NeedStatus"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  onClearFilters: () => void
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
  onClearFilters,
}: NeedsFiltersProps) {
  const { t } = useTranslation()
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [draftCategoryFilter, setDraftCategoryFilter] =
    useState<NeedCategoryFilter>(categoryFilter)
  const [draftBranchFilter, setDraftBranchFilter] =
    useState<NeedBranchFilter>(branchFilter)
  const [draftPriorityFilter, setDraftPriorityFilter] =
    useState<NeedPriorityFilter>(priorityFilter)
  const [draftStatusFilter, setDraftStatusFilter] =
    useState<NeedStatusFilter>(statusFilter)
  const [draftDateFrom, setDraftDateFrom] = useState<string | null>(dateFrom)
  const [draftDateTo, setDraftDateTo] = useState<string | null>(dateTo)

  useEffect(() => {
    if (!isFilterDialogOpen) return

    setDraftCategoryFilter(categoryFilter)
    setDraftBranchFilter(branchFilter)
    setDraftPriorityFilter(priorityFilter)
    setDraftStatusFilter(statusFilter)
    setDraftDateFrom(dateFrom)
    setDraftDateTo(dateTo)
  }, [
    isFilterDialogOpen,
    categoryFilter,
    branchFilter,
    priorityFilter,
    statusFilter,
    dateFrom,
    dateTo,
  ])

  const activeFilterCount = [
    categoryFilter !== "all" ? categoryFilter : null,
    showBranchFilter && branchFilter !== "all" ? branchFilter : null,
    priorityFilter !== "all" ? priorityFilter : null,
    statusFilter !== "all" ? statusFilter : null,
    dateFrom,
    dateTo,
  ].filter(Boolean).length

  const selectedBranchLabel = branchOptions.find(
    (branch) => branch.id === branchFilter
  )?.name

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onRemove: () => void }> =
      []

    if (categoryFilter !== "all") {
      chips.push({
        key: `category-${categoryFilter}`,
        label: t("needs.filters.filterChipCategory", {
          label: t(`needs.categories.${categoryFilter}` as any),
        }),
        onRemove: () => onCategoryFilterChange("all"),
      })
    }

    if (showBranchFilter && branchFilter !== "all" && selectedBranchLabel) {
      chips.push({
        key: `branch-${branchFilter}`,
        label: t("needs.filters.filterChipBranch", {
          name: selectedBranchLabel,
        }),
        onRemove: () => onBranchFilterChange("all"),
      })
    }

    if (priorityFilter !== "all") {
      chips.push({
        key: `priority-${priorityFilter}`,
        label: t("needs.filters.filterChipPriority", {
          label: t(`needs.priorities.${priorityFilter}` as any),
        }),
        onRemove: () => onPriorityFilterChange("all"),
      })
    }

    if (statusFilter !== "all") {
      chips.push({
        key: `status-${statusFilter}`,
        label: t("needs.filters.filterChipStatus", {
          label: t(`needs.statuses.${statusFilter}` as any),
        }),
        onRemove: () => onStatusFilterChange("all"),
      })
    }

    if (dateFrom) {
      chips.push({
        key: `from-${dateFrom}`,
        label: t("needs.filters.filterChipFrom", { date: dateFrom }),
        onRemove: () => onDateFromChange(null),
      })
    }

    if (dateTo) {
      chips.push({
        key: `to-${dateTo}`,
        label: t("needs.filters.filterChipTo", { date: dateTo }),
        onRemove: () => onDateToChange(null),
      })
    }

    return chips
  }, [
    branchFilter,
    categoryFilter,
    dateFrom,
    dateTo,
    onBranchFilterChange,
    onCategoryFilterChange,
    onDateFromChange,
    onDateToChange,
    onPriorityFilterChange,
    onStatusFilterChange,
    priorityFilter,
    selectedBranchLabel,
    showBranchFilter,
    statusFilter,
    t,
  ])

  function applyDraftFilters(): void {
    onCategoryFilterChange(draftCategoryFilter)
    onBranchFilterChange(draftBranchFilter)
    onPriorityFilterChange(draftPriorityFilter)
    onStatusFilterChange(draftStatusFilter)
    onDateFromChange(draftDateFrom)
    onDateToChange(draftDateTo)
    setIsFilterDialogOpen(false)
  }

  function clearDraftFilters(): void {
    setDraftCategoryFilter("all")
    setDraftBranchFilter("all")
    setDraftPriorityFilter("all")
    setDraftStatusFilter("all")
    setDraftDateFrom(null)
    setDraftDateTo(null)
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-full sm:max-w-md">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={t("needs.filters.searchPlaceholder")}
              className="pl-9"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFilterDialogOpen(true)}
            >
              <ListFilterIcon />
              {t("needs.filters.filters")}
              {activeFilterCount > 0 ? (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClearFilters}
              disabled={activeFilterCount === 0 && searchQuery === ""}
            >
              <RotateCcwIcon />
              {t("needs.filters.reset")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {t("needs.filters.filterBy")}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {activeFilterChips.length > 0 ? (
              activeFilterChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {chip.label}
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="rounded-full p-0.5 hover:bg-primary/20"
                    aria-label={t("needs.filters.removeFilter", {
                      label: chip.label,
                    })}
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {t("common.all")}
              </span>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:min-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("needs.filters.filterDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("needs.filters.filterDialogDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("needs.table.columns.category")}</Label>
                <Select
                  value={draftCategoryFilter}
                  onValueChange={(value) =>
                    setDraftCategoryFilter(value as NeedCategoryFilter)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("needs.filters.allCategories")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("needs.filters.allCategories")}
                    </SelectItem>
                    {NEED_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {t(`needs.categories.${category}` as any)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showBranchFilter ? (
                <div className="space-y-2">
                  <Label>{t("needs.table.columns.branch")}</Label>
                  <Select
                    value={draftBranchFilter}
                    onValueChange={(value) =>
                      setDraftBranchFilter(value as NeedBranchFilter)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("needs.filters.allBranches")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("needs.filters.allBranches")}
                      </SelectItem>
                      {branchOptions.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("needs.table.columns.priority")}</Label>
                <Select
                  value={draftPriorityFilter}
                  onValueChange={(value) =>
                    setDraftPriorityFilter(value as NeedPriorityFilter)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("needs.filters.allPriorities")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("needs.filters.allPriorities")}
                    </SelectItem>
                    {NEED_PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {t(`needs.priorities.${priority}` as any)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("needs.table.columns.status")}</Label>
                <Select
                  value={draftStatusFilter}
                  onValueChange={(value) =>
                    setDraftStatusFilter(value as NeedStatusFilter)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("needs.filters.allStatuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("needs.filters.allStatuses")}
                    </SelectItem>
                    {NEED_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`needs.statuses.${status}` as any)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="needs-dialog-date-from">
                  {t("needs.filters.dateFrom")}
                </Label>
                <Input
                  id="needs-dialog-date-from"
                  type="date"
                  value={draftDateFrom ?? ""}
                  max={draftDateTo ?? undefined}
                  onChange={(event) =>
                    setDraftDateFrom(event.target.value || null)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="needs-dialog-date-to">
                  {t("needs.filters.dateTo")}
                </Label>
                <Input
                  id="needs-dialog-date-to"
                  type="date"
                  value={draftDateTo ?? ""}
                  min={draftDateFrom ?? undefined}
                  onChange={(event) =>
                    setDraftDateTo(event.target.value || null)
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button type="button" variant="outline" onClick={clearDraftFilters}>
              {t("needs.filters.clear")}
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFilterDialogOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="button" onClick={applyDraftFilters}>
                {t("needs.filters.apply")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

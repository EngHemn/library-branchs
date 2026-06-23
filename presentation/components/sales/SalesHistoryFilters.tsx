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
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  SalesHistoryBranchFilter,
  SalesHistoryBranchFilterOption,
  SalesHistoryStatusFilter,
} from "@/presentation/viewmodels/sales/useSalesHistoryViewModel"

type SalesHistoryFiltersProps = {
  searchQuery: string
  statusFilter: SalesHistoryStatusFilter
  branchFilter: SalesHistoryBranchFilter
  dateFrom: string | null
  dateTo: string | null
  branchFilterOptions: SalesHistoryBranchFilterOption[]
  showBranchFilter?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onStatusFilterChange: (statusFilter: SalesHistoryStatusFilter) => void
  onBranchFilterChange: (branchFilter: SalesHistoryBranchFilter) => void
  onDateFromChange: (dateFrom: string | null) => void
  onDateToChange: (dateTo: string | null) => void
}

const STATUS_FILTER_VALUES = new Set<string>(["all", "completed", "voided"])

const STATUS_OPTION_KEYS: Record<SalesHistoryStatusFilter, TranslationKey> = {
  all: "sales.history.allStatus",
  completed: "sales.statuses.completed",
  voided: "sales.statuses.voided",
}

function isSalesHistoryStatusFilter(
  value: string
): value is SalesHistoryStatusFilter {
  return STATUS_FILTER_VALUES.has(value)
}

export function SalesHistoryFilters({
  searchQuery,
  statusFilter,
  branchFilter,
  dateFrom,
  dateTo,
  branchFilterOptions,
  showBranchFilter = false,
  onSearchQueryChange,
  onStatusFilterChange,
  onBranchFilterChange,
  onDateFromChange,
  onDateToChange,
}: SalesHistoryFiltersProps) {
  const { t } = useTranslation()
  const statusOptions: SalesHistoryStatusFilter[] = [
    "all",
    "completed",
    "voided",
  ]

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("sales.history.searchPlaceholder")}
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="sales-history-status-filter">
            {t("sales.history.filterByStatus")}
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (isSalesHistoryStatusFilter(value)) {
                onStatusFilterChange(value)
              }
            }}
          >
            <SelectTrigger id="sales-history-status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(STATUS_OPTION_KEYS[option])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showBranchFilter ? (
          <div className="space-y-2">
            <Label htmlFor="sales-history-branch-filter">
              {t("sales.history.filterByBranch")}
            </Label>
            <Select value={branchFilter} onValueChange={onBranchFilterChange}>
              <SelectTrigger
                id="sales-history-branch-filter"
                className="w-full"
              >
                <SelectValue />
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
          <Label htmlFor="sales-history-date-from">
            {t("sales.history.dateFrom")}
          </Label>
          <Input
            id="sales-history-date-from"
            type="date"
            value={dateFrom ?? ""}
            max={dateTo ?? undefined}
            onChange={(event) => onDateFromChange(event.target.value || null)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sales-history-date-to">
            {t("sales.history.dateTo")}
          </Label>
          <Input
            id="sales-history-date-to"
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

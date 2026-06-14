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
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  BillBranchFilter,
  BillBranchFilterOption,
} from "@/presentation/viewmodels/bills/useBillsViewModel"

type BillsFiltersProps = {
  searchQuery: string
  branchFilter: BillBranchFilter
  dateFrom: string | null
  dateTo: string | null
  branchFilterOptions: BillBranchFilterOption[]
  showBranchFilter?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onBranchFilterChange: (branchFilter: BillBranchFilter) => void
  onDateFromChange: (dateFrom: string | null) => void
  onDateToChange: (dateTo: string | null) => void
}

export function BillsFilters({
  searchQuery,
  branchFilter,
  dateFrom,
  dateTo,
  branchFilterOptions,
  showBranchFilter = false,
  onSearchQueryChange,
  onBranchFilterChange,
  onDateFromChange,
  onDateToChange,
}: BillsFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div
        className={
          showBranchFilter
            ? "grid gap-3 sm:grid-cols-2"
            : "grid gap-3 sm:grid-cols-1"
        }
      >
        <div className="space-y-2">
          <Label htmlFor="bills-search">{t("bills.filters.search")}</Label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="bills-search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={t("bills.filters.searchPlaceholder")}
              className="pl-9"
            />
          </div>
        </div>

        {showBranchFilter ? (
          <div className="space-y-2">
            <Label htmlFor="bills-branch-filter">{t("bills.filters.filterByBranch")}</Label>
            <Select value={branchFilter} onValueChange={onBranchFilterChange}>
              <SelectTrigger id="bills-branch-filter" className="w-full">
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
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bills-date-from">{t("bills.filters.dateFrom")}</Label>
          <Input
            id="bills-date-from"
            type="date"
            value={dateFrom ?? ""}
            max={dateTo ?? undefined}
            onChange={(event) =>
              onDateFromChange(event.target.value || null)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bills-date-to">{t("bills.filters.dateTo")}</Label>
          <Input
            id="bills-date-to"
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

"use client"

import { SearchIcon } from "lucide-react"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
  BillAddedByFilter,
  BillAddedByFilterOption,
  BillBranchFilter,
  BillBranchFilterOption,
} from "@/presentation/viewmodels/bills/useBillsViewModel"

type BillsFiltersProps = {
  searchQuery: string
  branchFilter: BillBranchFilter
  addedByFilter: BillAddedByFilter
  dateFrom: string | null
  dateTo: string | null
  branchFilterOptions: BillBranchFilterOption[]
  addedByFilterOptions: BillAddedByFilterOption[]
  showBranchFilter?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onBranchFilterChange: (branchFilter: BillBranchFilter) => void
  onAddedByFilterChange: (addedByFilter: BillAddedByFilter) => void
  onDateFromChange: (dateFrom: string | null) => void
  onDateToChange: (dateTo: string | null) => void
}

export function BillsFilters({
  searchQuery,
  branchFilter,
  addedByFilter,
  dateFrom,
  dateTo,
  branchFilterOptions,
  addedByFilterOptions,
  showBranchFilter = false,
  onSearchQueryChange,
  onBranchFilterChange,
  onAddedByFilterChange,
  onDateFromChange,
  onDateToChange,
}: BillsFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor="bills-search">{t("bills.filters.search")}</Label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="bills-search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={t("bills.filters.searchPlaceholder")}
              className="w-full pl-9"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:shrink-0 sm:flex-row sm:flex-wrap sm:items-end">
          {showBranchFilter ? (
            <div className="space-y-2 sm:w-48">
              <Label htmlFor="bills-branch-filter">
                {t("bills.filters.filterByBranch")}
              </Label>
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

          <div className="sm:w-48">
            <Label htmlFor="bills-added-by-filter">
              {t("bills.filters.filterByAddedBy")}
            </Label>
            <Combobox
              value={addedByFilter}
              onValueChange={(next) =>
                onAddedByFilterChange((next ?? "all") as BillAddedByFilter)
              }
              onInputValueChange={() => undefined}
              filter={null}
            >
              <ComboboxInput
                id="bills-added-by-filter"
                className="w-full"
                placeholder={t("bills.filters.searchAddedBy")}
              />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxItem value="all">
                    {t("bills.filters.allAddedBy")}
                  </ComboboxItem>
                  {addedByFilterOptions.map((option) => (
                    <ComboboxItem key={option.value} value={option.value}>
                      {option.label}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="space-y-2 sm:w-40">
            <Label htmlFor="bills-date-from">
              {t("bills.filters.dateFrom")}
            </Label>
            <Input
              id="bills-date-from"
              type="date"
              value={dateFrom ?? ""}
              max={dateTo ?? undefined}
              onChange={(event) => onDateFromChange(event.target.value || null)}
            />
          </div>

          <div className="space-y-2 sm:w-40">
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
    </div>
  )
}

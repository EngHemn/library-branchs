"use client"

import { useEffect, useMemo, useState } from "react"
import { ListFilterIcon, RotateCcwIcon, SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
import { ORDER_STATUSES } from "@/domain/entities/order/OrderStatus"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  OrderBranchFilter,
  OrderBranchFilterOption,
  OrdersFilterState,
} from "@/presentation/viewmodels/orders/useOrdersViewModel"

type FilterComboboxProps = {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  allLabel: string
  options: string[]
}

function FilterCombobox({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  allLabel,
  options,
}: FilterComboboxProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Combobox
        value={value}
        onValueChange={(next) => onValueChange(next ?? "all")}
        onInputValueChange={() => undefined}
        filter={null}
      >
        <ComboboxInput
          id={id}
          className="w-full"
          placeholder={placeholder}
          disabled={false}
        />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="all">{allLabel}</ComboboxItem>
            {options.map((option) => (
              <ComboboxItem key={option} value={option}>
                {option}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

type OrdersFiltersProps = {
  searchQuery: string
  branchFilter: OrderBranchFilter
  statusFilter: OrdersFilterState["statusFilter"]
  categoryFilter: OrdersFilterState["categoryFilter"]
  authorFilter: OrdersFilterState["authorFilter"]
  translatorFilter: OrdersFilterState["translatorFilter"]
  dateFrom: string | null
  dateTo: string | null
  branchFilterOptions: OrderBranchFilterOption[]
  categories: string[]
  authors: string[]
  translators: string[]
  showSubBranchFilter?: boolean
  showTranslatorFilter?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onBranchFilterChange: (branchFilter: OrderBranchFilter) => void
  onStatusFilterChange: (
    statusFilter: OrdersFilterState["statusFilter"]
  ) => void
  onCategoryFilterChange: (
    categoryFilter: OrdersFilterState["categoryFilter"]
  ) => void
  onAuthorFilterChange: (
    authorFilter: OrdersFilterState["authorFilter"]
  ) => void
  onTranslatorFilterChange: (
    translatorFilter: OrdersFilterState["translatorFilter"]
  ) => void
  onDateFromChange: (dateFrom: string | null) => void
  onDateToChange: (dateTo: string | null) => void
  onClearFilters: () => void
}

export function OrdersFilters({
  searchQuery,
  branchFilter,
  statusFilter,
  categoryFilter,
  authorFilter,
  translatorFilter,
  dateFrom,
  dateTo,
  branchFilterOptions,
  categories,
  authors,
  translators,
  showSubBranchFilter = false,
  showTranslatorFilter = true,
  onSearchQueryChange,
  onBranchFilterChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onAuthorFilterChange,
  onTranslatorFilterChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: OrdersFiltersProps) {
  const { t } = useTranslation()
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [draftStatusFilter, setDraftStatusFilter] =
    useState<OrdersFilterState["statusFilter"]>(statusFilter)
  const [draftBranchFilter, setDraftBranchFilter] =
    useState<OrderBranchFilter>(branchFilter)
  const [draftCategoryFilter, setDraftCategoryFilter] =
    useState<OrdersFilterState["categoryFilter"]>(categoryFilter)
  const [draftAuthorFilter, setDraftAuthorFilter] =
    useState<OrdersFilterState["authorFilter"]>(authorFilter)
  const [draftTranslatorFilter, setDraftTranslatorFilter] =
    useState<OrdersFilterState["translatorFilter"]>(translatorFilter)
  const [draftDateFrom, setDraftDateFrom] = useState<string | null>(dateFrom)
  const [draftDateTo, setDraftDateTo] = useState<string | null>(dateTo)

  useEffect(() => {
    if (!isFilterDialogOpen) return

    setDraftStatusFilter(statusFilter)
    setDraftBranchFilter(branchFilter)
    setDraftCategoryFilter(categoryFilter)
    setDraftAuthorFilter(authorFilter)
    setDraftTranslatorFilter(translatorFilter)
    setDraftDateFrom(dateFrom)
    setDraftDateTo(dateTo)
  }, [
    isFilterDialogOpen,
    statusFilter,
    branchFilter,
    categoryFilter,
    authorFilter,
    translatorFilter,
    dateFrom,
    dateTo,
  ])

  const activeFilterCount = [
    statusFilter !== "all" ? statusFilter : null,
    showSubBranchFilter && branchFilter !== "current" ? branchFilter : null,
    categoryFilter !== "all" ? categoryFilter : null,
    authorFilter !== "all" ? authorFilter : null,
    showTranslatorFilter && translatorFilter !== "all"
      ? translatorFilter
      : null,
    dateFrom,
    dateTo,
  ].filter(Boolean).length

  const selectedBranchLabel = branchFilterOptions.find(
    (option) => option.value === branchFilter
  )?.label

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onRemove: () => void }> =
      []

    if (statusFilter !== "all") {
      chips.push({
        key: `status-${statusFilter}`,
        label: t("orders.filters.filterChipStatus", {
          label: t(`orders.status.${statusFilter}`),
        }),
        onRemove: () => onStatusFilterChange("all"),
      })
    }

    if (
      showSubBranchFilter &&
      branchFilter !== "current" &&
      selectedBranchLabel
    ) {
      chips.push({
        key: `branch-${branchFilter}`,
        label: t("orders.filters.filterChipBranch", {
          name: selectedBranchLabel,
        }),
        onRemove: () => onBranchFilterChange("current"),
      })
    }

    if (categoryFilter !== "all") {
      chips.push({
        key: `category-${categoryFilter}`,
        label: t("orders.filters.filterChipCategory", {
          label: categoryFilter,
        }),
        onRemove: () => onCategoryFilterChange("all"),
      })
    }

    if (authorFilter !== "all") {
      chips.push({
        key: `author-${authorFilter}`,
        label: t("orders.filters.filterChipAuthor", { label: authorFilter }),
        onRemove: () => onAuthorFilterChange("all"),
      })
    }

    if (showTranslatorFilter && translatorFilter !== "all") {
      chips.push({
        key: `translator-${translatorFilter}`,
        label: t("orders.filters.filterChipTranslator", {
          label: translatorFilter,
        }),
        onRemove: () => onTranslatorFilterChange("all"),
      })
    }

    if (dateFrom) {
      chips.push({
        key: `from-${dateFrom}`,
        label: t("orders.filters.filterChipFrom", { date: dateFrom }),
        onRemove: () => onDateFromChange(null),
      })
    }

    if (dateTo) {
      chips.push({
        key: `to-${dateTo}`,
        label: t("orders.filters.filterChipTo", { date: dateTo }),
        onRemove: () => onDateToChange(null),
      })
    }

    return chips
  }, [
    statusFilter,
    showSubBranchFilter,
    showTranslatorFilter,
    branchFilter,
    selectedBranchLabel,
    categoryFilter,
    authorFilter,
    translatorFilter,
    dateFrom,
    dateTo,
    onStatusFilterChange,
    onBranchFilterChange,
    onCategoryFilterChange,
    onAuthorFilterChange,
    onTranslatorFilterChange,
    onDateFromChange,
    onDateToChange,
    t,
  ])

  function applyFilters(): void {
    onStatusFilterChange(draftStatusFilter)
    onBranchFilterChange(draftBranchFilter)
    onCategoryFilterChange(draftCategoryFilter)
    onAuthorFilterChange(draftAuthorFilter)
    onTranslatorFilterChange(draftTranslatorFilter)
    onDateFromChange(draftDateFrom)
    onDateToChange(draftDateTo)
    setIsFilterDialogOpen(false)
  }

  function clearDraftFilters(): void {
    setDraftStatusFilter("all")
    setDraftBranchFilter("current")
    setDraftCategoryFilter("all")
    setDraftAuthorFilter("all")
    setDraftTranslatorFilter("all")
    setDraftDateFrom(null)
    setDraftDateTo(null)
  }

  function handleReset(): void {
    onClearFilters()
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-full sm:max-w-md">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="orders-search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={t("orders.filters.searchPlaceholder")}
              className="pl-9"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFilterDialogOpen(true)}
            >
              <ListFilterIcon />
              {t("orders.filters.filters")}
              {activeFilterCount > 0 ? (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={activeFilterCount === 0 && searchQuery === ""}
            >
              <RotateCcwIcon />
              {t("orders.filters.reset")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {t("orders.filters.filterBy")}
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
                    aria-label={t("orders.filters.removeFilter", {
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
            <DialogTitle>{t("orders.filters.filterDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("orders.filters.filterDialogDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orders-dialog-status-filter">
                  {t("orders.filters.status")}
                </Label>
                <Select
                  value={draftStatusFilter}
                  onValueChange={(value) =>
                    setDraftStatusFilter(
                      value as OrdersFilterState["statusFilter"]
                    )
                  }
                >
                  <SelectTrigger
                    id="orders-dialog-status-filter"
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("orders.filters.allStatuses")}
                    </SelectItem>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`orders.status.${status}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orders-dialog-category-filter">
                  {t("orders.filters.category")}
                </Label>
                <Select
                  value={draftCategoryFilter}
                  onValueChange={setDraftCategoryFilter}
                >
                  <SelectTrigger
                    id="orders-dialog-category-filter"
                    className="w-full"
                  >
                    <SelectValue
                      placeholder={t("orders.filters.allCategories")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("orders.filters.allCategories")}
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FilterCombobox
                id="orders-dialog-author-filter"
                label={t("orders.filters.author")}
                value={draftAuthorFilter}
                onValueChange={setDraftAuthorFilter}
                placeholder={t("orders.filters.searchAuthor")}
                allLabel={t("orders.filters.allAuthors")}
                options={authors}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {showSubBranchFilter ? (
                <div className="space-y-2">
                  <Label htmlFor="orders-dialog-sub-branch-filter">
                    {t("orders.filters.branch")}
                  </Label>
                  <Select
                    value={draftBranchFilter}
                    onValueChange={(value) =>
                      setDraftBranchFilter(value as OrderBranchFilter)
                    }
                  >
                    <SelectTrigger
                      id="orders-dialog-sub-branch-filter"
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
              ) : showTranslatorFilter ? (
                <FilterCombobox
                  id="orders-dialog-translator-filter"
                  label={t("orders.filters.translator")}
                  value={draftTranslatorFilter}
                  onValueChange={setDraftTranslatorFilter}
                  placeholder={t("orders.filters.searchTranslator")}
                  allLabel={t("orders.filters.allTranslators")}
                  options={translators}
                />
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="orders-dialog-date-from">
                  {t("orders.filters.dateFrom")}
                </Label>
                <Input
                  id="orders-dialog-date-from"
                  type="date"
                  value={draftDateFrom ?? ""}
                  max={draftDateTo ?? undefined}
                  onChange={(event) =>
                    setDraftDateFrom(event.target.value || null)
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orders-dialog-date-to">
                  {t("orders.filters.dateTo")}
                </Label>
                <Input
                  id="orders-dialog-date-to"
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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={clearDraftFilters}>
              {t("orders.filters.clear")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsFilterDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="button" onClick={applyFilters}>
              {t("orders.filters.apply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

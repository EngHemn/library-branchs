"use client"

import { useMemo, useState } from "react"
import { MapPinIcon, RotateCcwIcon, SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import {
  hasActiveLocationFilter,
  shelfHintFromLocationValues,
} from "@/lib/bookLocationForm"
import { BooksShelfFilterDialog } from "@/presentation/components/books/BooksShelfFilterDialog"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type { BookBranchFilterOption } from "@/presentation/viewmodels/books/BooksViewModelState"

type BooksFiltersProps = {
  searchQuery: string
  categoryFilter: string
  authorFilter: string
  translatorFilter: string
  branchFilter: string
  locationValues: Record<string, string>
  categories: string[]
  authors: string[]
  translators: string[]
  branchFilterOptions: BookBranchFilterOption[]
  locationOptions: ShelfLocationOptions | null
  locationManageError: string | null
  isManagingLocation: boolean
  showBranchFilter?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onCategoryFilterChange: (categoryFilter: string) => void
  onAuthorFilterChange: (authorFilter: string) => void
  onTranslatorFilterChange: (translatorFilter: string) => void
  onBranchFilterChange: (branchFilter: string) => void
  onLocationFilterChange: (locationValues: Record<string, string>) => void
  onClearFilters: () => void
  onAddLocationValue: (stepId: string, value: string) => Promise<void>
  onUpdateLocationValue: (
    stepId: string,
    currentValue: string,
    value: string
  ) => Promise<void>
  onDeleteLocationValue: (stepId: string, value: string) => Promise<void>
  onAddLocationStep: (label: string) => Promise<void>
  onUpdateLocationStep: (stepId: string, label: string) => Promise<void>
  onDeleteLocationStep: (stepId: string) => Promise<void>
}

export function BooksFilters({
  searchQuery,
  categoryFilter,
  authorFilter,
  translatorFilter,
  branchFilter,
  locationValues,
  categories,
  authors,
  translators,
  branchFilterOptions,
  locationOptions,
  locationManageError,
  isManagingLocation,
  showBranchFilter = true,
  onSearchQueryChange,
  onCategoryFilterChange,
  onAuthorFilterChange,
  onTranslatorFilterChange,
  onBranchFilterChange,
  onLocationFilterChange,
  onClearFilters,
  onAddLocationValue,
  onUpdateLocationValue,
  onDeleteLocationValue,
  onAddLocationStep,
  onUpdateLocationStep,
  onDeleteLocationStep,
}: BooksFiltersProps) {
  const { t } = useTranslation()
  const [isShelfDialogOpen, setIsShelfDialogOpen] = useState(false)

  const selectedBranchLabel = branchFilterOptions.find(
    (option) => option.value === branchFilter
  )?.label

  const activeShelfFilterCount =
    locationOptions &&
    hasActiveLocationFilter(locationOptions.steps, locationValues)
      ? 1
      : 0

  const shelfFilterLabel =
    locationOptions &&
    hasActiveLocationFilter(locationOptions.steps, locationValues)
      ? shelfHintFromLocationValues(locationOptions.steps, locationValues)
      : null

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onRemove: () => void }> =
      []

    if (categoryFilter !== "all") {
      chips.push({
        key: `category-${categoryFilter}`,
        label: t("books.filters.chipCategory", { value: categoryFilter }),
        onRemove: () => onCategoryFilterChange("all"),
      })
    }

    if (authorFilter !== "all") {
      chips.push({
        key: `author-${authorFilter}`,
        label: t("books.filters.chipAuthor", { value: authorFilter }),
        onRemove: () => onAuthorFilterChange("all"),
      })
    }

    if (translatorFilter !== "all") {
      chips.push({
        key: `translator-${translatorFilter}`,
        label: t("books.filters.chipTranslator", { value: translatorFilter }),
        onRemove: () => onTranslatorFilterChange("all"),
      })
    }

    if (showBranchFilter && branchFilter !== "all" && selectedBranchLabel) {
      chips.push({
        key: `branch-${branchFilter}`,
        label: t("books.filters.chipBranch", { value: selectedBranchLabel }),
        onRemove: () => onBranchFilterChange("all"),
      })
    }

    if (shelfFilterLabel) {
      chips.push({
        key: "shelf-location",
        label: t("books.filters.chipShelf", { value: shelfFilterLabel }),
        onRemove: () => onLocationFilterChange({}),
      })
    }

    return chips
  }, [
    categoryFilter,
    authorFilter,
    translatorFilter,
    branchFilter,
    showBranchFilter,
    selectedBranchLabel,
    shelfFilterLabel,
    onCategoryFilterChange,
    onAuthorFilterChange,
    onTranslatorFilterChange,
    onBranchFilterChange,
    onLocationFilterChange,
    t,
  ])

  const hasActiveFilters =
    activeFilterChips.length > 0 || searchQuery.trim().length > 0

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-full sm:max-w-md">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="books-search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={t("books.filters.searchPlaceholder")}
              className="pl-9"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsShelfDialogOpen(true)}
            >
              <MapPinIcon />
              {t("books.filters.shelf")}
              {activeShelfFilterCount > 0 ? (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {activeShelfFilterCount}
                </span>
              ) : null}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
            >
              <RotateCcwIcon />
              {t("books.filters.reset")}
            </Button>
          </div>
        </div>

        <div
          className={`grid gap-3 ${showBranchFilter ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}
        >
          <div className="space-y-2">
            <Label htmlFor="books-category-filter">
              {t("books.filters.category")}
            </Label>
            <Select
              value={categoryFilter}
              onValueChange={onCategoryFilterChange}
            >
              <SelectTrigger id="books-category-filter" className="w-full">
                <SelectValue placeholder={t("books.filters.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("books.filters.allCategories")}
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="books-author-filter">
              {t("books.filters.author")}
            </Label>
            <Select value={authorFilter} onValueChange={onAuthorFilterChange}>
              <SelectTrigger id="books-author-filter" className="w-full">
                <SelectValue placeholder={t("books.filters.allAuthors")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("books.filters.allAuthors")}
                </SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="books-translator-filter">
              {t("books.filters.translator")}
            </Label>
            <Select
              value={translatorFilter}
              onValueChange={onTranslatorFilterChange}
            >
              <SelectTrigger id="books-translator-filter" className="w-full">
                <SelectValue placeholder={t("books.filters.allTranslators")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("books.filters.allTranslators")}
                </SelectItem>
                {translators.map((translator) => (
                  <SelectItem key={translator} value={translator}>
                    {translator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showBranchFilter ? (
            <div className="space-y-2">
              <Label htmlFor="books-branch-filter">
                {t("books.filters.branch")}
              </Label>
              <Select value={branchFilter} onValueChange={onBranchFilterChange}>
                <SelectTrigger id="books-branch-filter" className="w-full">
                  <SelectValue placeholder={t("books.filters.allBranches")} />
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

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {t("books.filters.filterBy")}
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
                    aria-label={t("books.filters.clearFilter", {
                      label: chip.label,
                    })}
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {t("books.filters.all")}
              </span>
            )}
          </div>
        </div>
      </div>

      <BooksShelfFilterDialog
        open={isShelfDialogOpen}
        onOpenChange={setIsShelfDialogOpen}
        locationOptions={locationOptions}
        locationValues={locationValues}
        locationManageError={locationManageError}
        isManagingLocation={isManagingLocation}
        onApply={onLocationFilterChange}
        onAddLocationValue={onAddLocationValue}
        onUpdateLocationValue={onUpdateLocationValue}
        onDeleteLocationValue={onDeleteLocationValue}
        onAddLocationStep={onAddLocationStep}
        onUpdateLocationStep={onUpdateLocationStep}
        onDeleteLocationStep={onDeleteLocationStep}
      />
    </>
  )
}

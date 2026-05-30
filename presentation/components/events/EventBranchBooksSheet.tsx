"use client"

import { useEffect, useState } from "react"
import {
  ListFilterIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"

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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { EventBranchBook } from "@/domain/entities/event/EventBranchBook"
import { EventBranchBooksTable } from "@/presentation/components/events/EventBranchBooksTable"
import {
  BranchDetailLink,
  EventLink,
} from "@/presentation/components/shared/DashboardEntityLink"

type EventBooksFilter = "all" | string

type EventBranchBooksSheetProps = {
  isOpen: boolean
  eventId: string
  eventName: string
  branchId: string
  branchName: string
  books: EventBranchBook[]
  booksStatus: "idle" | "loading" | "success" | "error"
  booksError: string | null
  searchQuery: string
  languageFilter: EventBooksFilter
  categoryFilter: EventBooksFilter
  authorFilter: EventBooksFilter
  translatorFilter: EventBooksFilter
  languages: string[]
  categories: string[]
  authors: string[]
  translators: string[]
  onOpenChange: (open: boolean) => void
  onSearchQueryChange: (value: string) => void
  onLanguageFilterChange: (value: EventBooksFilter) => void
  onCategoryFilterChange: (value: EventBooksFilter) => void
  onAuthorFilterChange: (value: EventBooksFilter) => void
  onTranslatorFilterChange: (value: EventBooksFilter) => void
  onResetFilters: () => void
}

type FilterComboboxProps = {
  id: string
  label: string
  value: EventBooksFilter
  onValueChange: (value: EventBooksFilter) => void
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
        <ComboboxInput id={id} className="w-full" placeholder={placeholder} />
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

export function EventBranchBooksSheet({
  isOpen,
  eventId,
  eventName,
  branchId,
  branchName,
  books,
  booksStatus,
  booksError,
  searchQuery,
  languageFilter,
  categoryFilter,
  authorFilter,
  translatorFilter,
  languages,
  categories,
  authors,
  translators,
  onOpenChange,
  onSearchQueryChange,
  onLanguageFilterChange,
  onCategoryFilterChange,
  onAuthorFilterChange,
  onTranslatorFilterChange,
  onResetFilters,
}: EventBranchBooksSheetProps) {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [draftLanguageFilter, setDraftLanguageFilter] =
    useState<EventBooksFilter>(languageFilter)
  const [draftCategoryFilter, setDraftCategoryFilter] =
    useState<EventBooksFilter>(categoryFilter)
  const [draftAuthorFilter, setDraftAuthorFilter] =
    useState<EventBooksFilter>(authorFilter)
  const [draftTranslatorFilter, setDraftTranslatorFilter] =
    useState<EventBooksFilter>(translatorFilter)

  useEffect(() => {
    if (!isFilterDialogOpen) {
      return
    }

    setDraftLanguageFilter(languageFilter)
    setDraftCategoryFilter(categoryFilter)
    setDraftAuthorFilter(authorFilter)
    setDraftTranslatorFilter(translatorFilter)
  }, [
    isFilterDialogOpen,
    languageFilter,
    categoryFilter,
    authorFilter,
    translatorFilter,
  ])

  const activeFilterCount = [
    languageFilter !== "all",
    categoryFilter !== "all",
    authorFilter !== "all",
    translatorFilter !== "all",
  ].filter(Boolean).length

  const activeFilterChips: Array<{
    key: string
    label: string
    onRemove: () => void
  }> = []

  if (languageFilter !== "all") {
    activeFilterChips.push({
      key: "language",
      label: `Language: ${languageFilter}`,
      onRemove: () => onLanguageFilterChange("all"),
    })
  }

  if (categoryFilter !== "all") {
    activeFilterChips.push({
      key: "category",
      label: `Category: ${categoryFilter}`,
      onRemove: () => onCategoryFilterChange("all"),
    })
  }

  if (authorFilter !== "all") {
    activeFilterChips.push({
      key: "author",
      label: `Author: ${authorFilter}`,
      onRemove: () => onAuthorFilterChange("all"),
    })
  }

  if (translatorFilter !== "all") {
    activeFilterChips.push({
      key: "translator",
      label: `Translator: ${translatorFilter}`,
      onRemove: () => onTranslatorFilterChange("all"),
    })
  }

  function applyFilters(): void {
    onLanguageFilterChange(draftLanguageFilter)
    onCategoryFilterChange(draftCategoryFilter)
    onAuthorFilterChange(draftAuthorFilter)
    onTranslatorFilterChange(draftTranslatorFilter)
    setIsFilterDialogOpen(false)
  }

  function clearDraftFilters(): void {
    setDraftLanguageFilter("all")
    setDraftCategoryFilter("all")
    setDraftAuthorFilter("all")
    setDraftTranslatorFilter("all")
  }

  const isLoading = booksStatus === "idle" || booksStatus === "loading"

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:min-w-4/5"
        >
          <SheetHeader className="border-b px-4 py-4 text-left">
            <SheetTitle className="text-base">
              <BranchDetailLink
                branchId={branchId}
                branchName={branchName}
                className="text-base font-semibold"
              />
            </SheetTitle>
            <SheetDescription>
              Books allocated for{" "}
              <EventLink
                eventId={eventId}
                name={eventName}
                className="font-semibold text-foreground"
              />{" "}
              at this branch
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-3 border-b px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => onSearchQueryChange(event.target.value)}
                  placeholder="Search by title, author, ISBN..."
                  className="pl-9"
                />
              </div>
              <div className="flex shrink-0 items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFilterDialogOpen(true)}
                >
                  <ListFilterIcon />
                  Filters
                  {activeFilterCount > 0 ? (
                    <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onResetFilters}
                  disabled={activeFilterCount === 0 && searchQuery === ""}
                >
                  <RotateCcwIcon />
                  Reset
                </Button>
              </div>
            </div>

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
                      aria-label={`Remove ${chip.label} filter`}
                    >
                      <XIcon className="size-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  All books
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {booksStatus === "error" && booksError ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {booksError}
              </p>
            ) : (
              <EventBranchBooksTable books={books} isLoading={isLoading} />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:min-w-[560px]">
          <DialogHeader>
            <DialogTitle>Filter event books</DialogTitle>
            <DialogDescription>
              Narrow books by language, category, author, or translator.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <FilterCombobox
              id="event-book-language"
              label="Language"
              value={draftLanguageFilter}
              onValueChange={setDraftLanguageFilter}
              placeholder="All languages"
              allLabel="All languages"
              options={languages}
            />
            <FilterCombobox
              id="event-book-category"
              label="Category"
              value={draftCategoryFilter}
              onValueChange={setDraftCategoryFilter}
              placeholder="All categories"
              allLabel="All categories"
              options={categories}
            />
            <FilterCombobox
              id="event-book-author"
              label="Author"
              value={draftAuthorFilter}
              onValueChange={setDraftAuthorFilter}
              placeholder="All authors"
              allLabel="All authors"
              options={authors}
            />
            <FilterCombobox
              id="event-book-translator"
              label="Translator"
              value={draftTranslatorFilter}
              onValueChange={setDraftTranslatorFilter}
              placeholder="All translators"
              allLabel="All translators"
              options={translators}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={clearDraftFilters}>
              Clear
            </Button>
            <Button type="button" onClick={applyFilters}>
              Apply filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

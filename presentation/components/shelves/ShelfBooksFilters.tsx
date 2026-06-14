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
  ShelfBookCategoryFilter,
  ShelfBookLanguageFilter,
} from "@/domain/services/shelves/filterShelfBooks"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelfBooksFiltersProps = {
  searchQuery: string
  categoryFilter: ShelfBookCategoryFilter
  languageFilter: ShelfBookLanguageFilter
  categoryOptions: string[]
  languageOptions: string[]
  onSearchQueryChange: (value: string) => void
  onCategoryFilterChange: (value: ShelfBookCategoryFilter) => void
  onLanguageFilterChange: (value: ShelfBookLanguageFilter) => void
}

export function ShelfBooksFilters({
  searchQuery,
  categoryFilter,
  languageFilter,
  categoryOptions,
  languageOptions,
  onSearchQueryChange,
  onCategoryFilterChange,
  onLanguageFilterChange,
}: ShelfBooksFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("shelves.booksFilters.searchPlaceholder")}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap lg:justify-end">
        <Select
          value={categoryFilter}
          onValueChange={(value) => onCategoryFilterChange(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("shelves.booksFilters.allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("shelves.booksFilters.allCategories")}</SelectItem>
            {categoryOptions.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={languageFilter}
          onValueChange={(value) => onLanguageFilterChange(value)}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("shelves.booksFilters.allLanguages")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("shelves.booksFilters.allLanguages")}</SelectItem>
            {languageOptions.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

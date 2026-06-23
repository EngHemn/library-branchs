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
  GroupBooksAuthorFilter,
  GroupBooksBranchFilter,
  GroupBooksCategoryFilter,
  GroupBranchFilterOption,
} from "@/presentation/viewmodels/groups/GroupDetailViewModelState"

type GroupBooksFiltersProps = {
  searchQuery: string
  categoryFilter: GroupBooksCategoryFilter
  authorFilter: GroupBooksAuthorFilter
  branchFilter: GroupBooksBranchFilter
  categories: string[]
  authors: string[]
  branchFilterOptions: GroupBranchFilterOption[]
  showBranchFilter?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onCategoryFilterChange: (categoryFilter: GroupBooksCategoryFilter) => void
  onAuthorFilterChange: (authorFilter: GroupBooksAuthorFilter) => void
  onBranchFilterChange: (branchFilter: GroupBooksBranchFilter) => void
}

export function GroupBooksFilters({
  searchQuery,
  categoryFilter,
  authorFilter,
  branchFilter,
  categories,
  authors,
  branchFilterOptions,
  showBranchFilter = false,
  onSearchQueryChange,
  onCategoryFilterChange,
  onAuthorFilterChange,
  onBranchFilterChange,
}: GroupBooksFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("groups.booksFilters.searchPlaceholder")}
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="group-books-category-filter">
            {t("groups.booksFilters.category")}
          </Label>
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger id="group-books-category-filter" className="w-full">
              <SelectValue
                placeholder={t("groups.booksFilters.allCategories")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("groups.booksFilters.allCategories")}
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
          <Label htmlFor="group-books-author-filter">
            {t("groups.booksFilters.author")}
          </Label>
          <Select value={authorFilter} onValueChange={onAuthorFilterChange}>
            <SelectTrigger id="group-books-author-filter" className="w-full">
              <SelectValue placeholder={t("groups.booksFilters.allAuthors")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("groups.booksFilters.allAuthors")}
              </SelectItem>
              {authors.map((author) => (
                <SelectItem key={author} value={author}>
                  {author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showBranchFilter ? (
          <div className="space-y-2">
            <Label htmlFor="group-books-branch-filter">
              {t("groups.booksFilters.branch")}
            </Label>
            <Select value={branchFilter} onValueChange={onBranchFilterChange}>
              <SelectTrigger id="group-books-branch-filter" className="w-full">
                <SelectValue placeholder={t("groups.filters.currentBranch")} />
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
    </div>
  )
}

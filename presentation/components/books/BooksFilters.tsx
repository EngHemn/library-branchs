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

type BooksFiltersProps = {
  searchQuery: string
  categoryFilter: string
  authorFilter: string
  translatorFilter: string
  branchFilter: string
  categories: string[]
  authors: string[]
  translators: string[]
  branches: string[]
  onSearchQueryChange: (searchQuery: string) => void
  onCategoryFilterChange: (categoryFilter: string) => void
  onAuthorFilterChange: (authorFilter: string) => void
  onTranslatorFilterChange: (translatorFilter: string) => void
  onBranchFilterChange: (branchFilter: string) => void
}

export function BooksFilters({
  searchQuery,
  categoryFilter,
  authorFilter,
  translatorFilter,
  branchFilter,
  categories,
  authors,
  translators,
  branches,
  onSearchQueryChange,
  onCategoryFilterChange,
  onAuthorFilterChange,
  onTranslatorFilterChange,
  onBranchFilterChange,
}: BooksFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[200px]">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search title/ISBN..."
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          value={categoryFilter}
          onValueChange={onCategoryFilterChange}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={authorFilter}
          onValueChange={onAuthorFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {authors.map((author) => (
              <SelectItem key={author} value={author}>
                {author}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={translatorFilter}
          onValueChange={onTranslatorFilterChange}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Translators</SelectItem>
            {translators.map((translator) => (
              <SelectItem key={translator} value={translator}>
                {translator}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={branchFilter}
          onValueChange={onBranchFilterChange}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches (has stock)</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

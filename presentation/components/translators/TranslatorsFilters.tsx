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

type TranslatorsFiltersProps = {
  searchQuery: string
  statusFilter: "all" | "active" | "inactive"
  languageFilter: string
  languages: string[]
  onSearchQueryChange: (searchQuery: string) => void
  onStatusFilterChange: (statusFilter: "all" | "active" | "inactive") => void
  onLanguageFilterChange: (languageFilter: string) => void
}

export function TranslatorsFilters({
  searchQuery,
  statusFilter,
  languageFilter,
  languages,
  onSearchQueryChange,
  onStatusFilterChange,
  onLanguageFilterChange,
}: TranslatorsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[200px]">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by name or ID..."
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          value={languageFilter}
          onValueChange={onLanguageFilterChange}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            onStatusFilterChange(value as "all" | "active" | "inactive")
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

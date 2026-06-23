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
import { useTranslation } from "@/presentation/i18n/useTranslation"

type CategoriesFiltersProps = {
  searchQuery: string
  statusFilter: "all" | "active" | "inactive"
  onSearchQueryChange: (searchQuery: string) => void
  onStatusFilterChange: (statusFilter: "all" | "active" | "inactive") => void
}

export function CategoriesFilters({
  searchQuery,
  statusFilter,
  onSearchQueryChange,
  onStatusFilterChange,
}: CategoriesFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("categories.filters.searchPlaceholder")}
          className="pl-9"
        />
      </div>
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
          <SelectItem value="all">
            {t("categories.filters.allStatus")}
          </SelectItem>
          <SelectItem value="active">{t("common.active")}</SelectItem>
          <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

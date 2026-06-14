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
import {
  SHELF_TYPES,
  getShelfTypeLabel,
} from "@/domain/entities/shelf/ShelfType"
import type { ShelfType } from "@/domain/entities/shelf/ShelfType"
import { useTranslation } from "@/presentation/i18n/useTranslation"

export type ShelfBranchFilter = "all" | string

type ShelvesFiltersProps = {
  searchQuery: string
  branchFilter: ShelfBranchFilter
  shelfTypeFilter: "all" | ShelfType
  statusFilter: "all" | "active" | "inactive"
  branchOptions: Array<{ id: string; name: string }>
  showBranchFilter?: boolean
  onSearchQueryChange: (value: string) => void
  onBranchFilterChange: (value: ShelfBranchFilter) => void
  onShelfTypeFilterChange: (value: "all" | ShelfType) => void
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void
}

export function ShelvesFilters({
  searchQuery,
  branchFilter,
  shelfTypeFilter,
  statusFilter,
  branchOptions,
  showBranchFilter = true,
  onSearchQueryChange,
  onBranchFilterChange,
  onShelfTypeFilterChange,
  onStatusFilterChange,
}: ShelvesFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("shelves.filters.searchPlaceholder")}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap lg:justify-end">
        {showBranchFilter ? (
          <Select
            value={branchFilter}
            onValueChange={(value) => onBranchFilterChange(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t("shelves.filters.allBranches")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("shelves.filters.allBranches")}</SelectItem>
              {branchOptions.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <Select
          value={shelfTypeFilter}
          onValueChange={(value) =>
            onShelfTypeFilterChange(value as "all" | ShelfType)
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("shelves.filters.allShelfTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("shelves.filters.allShelfTypes")}</SelectItem>
            {SHELF_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {getShelfTypeLabel(type)}
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
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder={t("shelves.filters.allStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("shelves.filters.allStatus")}</SelectItem>
            <SelectItem value="active">{t("common.active")}</SelectItem>
            <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

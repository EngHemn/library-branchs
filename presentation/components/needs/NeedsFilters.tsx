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
import { NEED_CATEGORIES } from "@/domain/entities/need/NeedCategory"
import { NEED_PRIORITIES } from "@/domain/entities/need/NeedPriority"
import { NEED_STATUSES } from "@/domain/entities/need/NeedStatus"
import type { NeedCategory } from "@/domain/entities/need/NeedCategory"
import type { NeedPriority } from "@/domain/entities/need/NeedPriority"
import type { NeedStatus } from "@/domain/entities/need/NeedStatus"
import { useTranslation } from "@/presentation/i18n/useTranslation"

export type NeedCategoryFilter = "all" | NeedCategory
export type NeedPriorityFilter = "all" | NeedPriority
export type NeedStatusFilter = "all" | NeedStatus
export type NeedBranchFilter = "all" | string

type NeedsFiltersProps = {
  searchQuery: string
  categoryFilter: NeedCategoryFilter
  branchFilter: NeedBranchFilter
  priorityFilter: NeedPriorityFilter
  statusFilter: NeedStatusFilter
  dateFrom: string | null
  dateTo: string | null
  branchOptions: Array<{ id: string; name: string }>
  showBranchFilter?: boolean
  onSearchQueryChange: (value: string) => void
  onCategoryFilterChange: (value: NeedCategoryFilter) => void
  onBranchFilterChange: (value: NeedBranchFilter) => void
  onPriorityFilterChange: (value: NeedPriorityFilter) => void
  onStatusFilterChange: (value: NeedStatusFilter) => void
  onDateFromChange: (value: string | null) => void
  onDateToChange: (value: string | null) => void
}

export function NeedsFilters({
  searchQuery,
  categoryFilter,
  branchFilter,
  priorityFilter,
  statusFilter,
  dateFrom,
  dateTo,
  branchOptions,
  showBranchFilter = true,
  onSearchQueryChange,
  onCategoryFilterChange,
  onBranchFilterChange,
  onPriorityFilterChange,
  onStatusFilterChange,
  onDateFromChange,
  onDateToChange,
}: NeedsFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("needs.filters.searchPlaceholder")}
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="space-y-2">
          <Label>{t("needs.table.columns.category")}</Label>
          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              onCategoryFilterChange(value as NeedCategoryFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("needs.filters.allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("needs.filters.allCategories")}</SelectItem>
              {NEED_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {t(`needs.categories.${category}` as any)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showBranchFilter ? (
          <div className="space-y-2">
            <Label>{t("needs.table.columns.branch")}</Label>
            <Select
              value={branchFilter}
              onValueChange={(value) =>
                onBranchFilterChange(value as NeedBranchFilter)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("needs.filters.allBranches")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("needs.filters.allBranches")}</SelectItem>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label>{t("needs.table.columns.priority")}</Label>
          <Select
            value={priorityFilter}
            onValueChange={(value) =>
              onPriorityFilterChange(value as NeedPriorityFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("needs.filters.allPriorities")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("needs.filters.allPriorities")}</SelectItem>
              {NEED_PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {t(`needs.priorities.${priority}` as any)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("needs.table.columns.status")}</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as NeedStatusFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("needs.filters.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("needs.filters.allStatuses")}</SelectItem>
              {NEED_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`needs.statuses.${status}` as any)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="needs-date-from">{t("needs.filters.dateFrom")}</Label>
          <Input
            id="needs-date-from"
            type="date"
            value={dateFrom ?? ""}
            max={dateTo ?? undefined}
            onChange={(event) =>
              onDateFromChange(event.target.value || null)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="needs-date-to">{t("needs.filters.dateTo")}</Label>
          <Input
            id="needs-date-to"
            type="date"
            value={dateTo ?? ""}
            min={dateFrom ?? undefined}
            onChange={(event) => onDateToChange(event.target.value || null)}
          />
        </div>
      </div>
    </div>
  )
}

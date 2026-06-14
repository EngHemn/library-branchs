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

export type LowStockAlertStatusFilter = "all" | "active" | "resolved"
export type LowStockAlertBranchFilter = "all" | string

type LowStockAlertsFiltersProps = {
  searchQuery: string
  branchFilter: LowStockAlertBranchFilter
  statusFilter: LowStockAlertStatusFilter
  branchOptions: Array<{ id: string; name: string }>
  showBranchFilter?: boolean
  onSearchQueryChange: (value: string) => void
  onBranchFilterChange: (value: LowStockAlertBranchFilter) => void
  onStatusFilterChange: (value: LowStockAlertStatusFilter) => void
}

export function LowStockAlertsFilters({
  searchQuery,
  branchFilter,
  statusFilter,
  branchOptions,
  showBranchFilter = true,
  onSearchQueryChange,
  onBranchFilterChange,
  onStatusFilterChange,
}: LowStockAlertsFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("alerts.searchPlaceholder")}
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {showBranchFilter ? (
          <div className="space-y-2">
            <Label>{t("alerts.branch")}</Label>
            <Select
              value={branchFilter}
              onValueChange={(value) =>
                onBranchFilterChange(value as LowStockAlertBranchFilter)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("alerts.allBranches")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("alerts.allBranches")}</SelectItem>
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
          <Label>{t("alerts.status")}</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as LowStockAlertStatusFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("alerts.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("alerts.allStatuses")}</SelectItem>
              <SelectItem value="active">{t("alerts.active")}</SelectItem>
              <SelectItem value="resolved">{t("alerts.resolved")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

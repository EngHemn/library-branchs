"use client"

import { RotateCcwIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BranchStatus } from "@/domain/entities/branch/Branch"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BranchStatusFilter = "all" | BranchStatus

type BranchFiltersProps = {
  searchQuery: string
  statusFilter: BranchStatusFilter
  canResetFilters: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onStatusFilterChange: (statusFilter: BranchStatusFilter) => void
  onResetFilters: () => void
}

function isBranchStatusFilter(value: string): value is BranchStatusFilter {
  return value === "all" || value === "active" || value === "inactive"
}

export function BranchFilters({
  searchQuery,
  statusFilter,
  canResetFilters,
  onSearchQueryChange,
  onStatusFilterChange,
  onResetFilters,
}: BranchFiltersProps) {
  const { t } = useTranslation()

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("branches.filters.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_160px_auto] lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="branch-search">{t("common.search")}</Label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="branch-search"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder={t("branches.filters.searchPlaceholder")}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-status-filter">{t("common.status")}</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                if (isBranchStatusFilter(value)) {
                  onStatusFilterChange(value)
                }
              }}
            >
              <SelectTrigger id="branch-status-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="active">{t("common.active")}</SelectItem>
                <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            disabled={!canResetFilters}
            className="w-full lg:w-auto"
          >
            <RotateCcwIcon />
            {t("branches.filters.resetFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

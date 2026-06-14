"use client"

import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Sale } from "@/domain/entities/sales/Sale"
import { GroupSalesHistoryFilters } from "@/presentation/components/groups/GroupSalesHistoryFilters"
import { SalesHistoryTable } from "@/presentation/components/sales/SalesHistoryTable"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  GroupBranchFilterOption,
  GroupSalesBranchFilter,
  GroupSalesFilterState,
} from "@/presentation/viewmodels/groups/GroupDetailViewModelState"

type GroupSalesHistoryTabProps = {
  sales: Sale[]
  totalSales: number
  filters: GroupSalesFilterState
  branchFilterOptions: GroupBranchFilterOption[]
  showBranchFilter: boolean
  showBranchColumn: boolean
  isLoading: boolean
  error: string | null
  onBranchFilterChange: (branchFilter: GroupSalesBranchFilter) => void
  onDateFromChange: (dateFrom: string | null) => void
  onDateToChange: (dateTo: string | null) => void
  onRetry: () => void
}

function LoadingState() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export function GroupSalesHistoryTab({
  sales,
  totalSales,
  filters,
  branchFilterOptions,
  showBranchFilter,
  showBranchColumn,
  isLoading,
  error,
  onBranchFilterChange,
  onDateFromChange,
  onDateToChange,
  onRetry,
}: GroupSalesHistoryTabProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <Card className="rounded-lg border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base">{t("groups.sales.loadError")}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" onClick={onRetry}>
            <RefreshCwIcon />
            {t("common.retry")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (totalSales === 0) {
    return (
      <Card className="rounded-lg">
        <CardContent className="flex min-h-48 items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            {t("groups.sales.empty")}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("groups.filters.filters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <GroupSalesHistoryFilters
            branchFilter={filters.branchFilter}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            branchFilterOptions={branchFilterOptions}
            showBranchFilter={showBranchFilter}
            onBranchFilterChange={onBranchFilterChange}
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
          />
        </CardContent>
      </Card>

      {sales.length === 0 ? (
        <Card className="rounded-lg">
          <CardContent className="flex min-h-48 items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              {t("groups.sales.noMatch")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <SalesHistoryTable sales={sales} showBranchColumn={showBranchColumn} />
      )}
    </div>
  )
}

"use client"

import Link from "next/link"
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"
import { SalesHistoryFilters } from "@/presentation/components/sales/SalesHistoryFilters"
import { SalesHistoryTable } from "@/presentation/components/sales/SalesHistoryTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useSalesHistoryViewModel } from "@/presentation/viewmodels/sales/useSalesHistoryViewModel"

type SalesHistoryScreenProps = {
  authUseCase: AuthUseCase
  salesUseCase: SalesUseCase
}

function LoadingSalesHistory() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function SalesHistoryScreen({
  authUseCase,
  salesUseCase,
}: SalesHistoryScreenProps) {
  const { t } = useTranslation()
  const viewModel = useSalesHistoryViewModel(authUseCase, salesUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.sales"), href: "/dashboard/sales" },
    { label: t("sales.history.breadcrumb") },
  ])

  if (state.status === "idle" || state.status === "loading") {
    return <LoadingSalesHistory />
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-lg">
          <CardHeader>
            <CardTitle>{t("sales.history.unavailable")}</CardTitle>
            <CardDescription>{state.error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => void viewModel.reload()}>
              <RefreshCwIcon />
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">{t("sales.history.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("sales.history.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/sales">
              <ArrowLeftIcon />
              {t("sales.history.backToSales")}
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => void viewModel.reload()}>
            <RefreshCwIcon />
            {t("common.refresh")}
          </Button>
        </div>
      </section>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>{t("sales.history.filtersTitle")}</CardTitle>
          <CardDescription>
            {t("sales.history.filtersDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesHistoryFilters
            searchQuery={state.filters.searchQuery}
            statusFilter={state.filters.statusFilter}
            branchFilter={state.filters.branchFilter}
            dateFrom={state.filters.dateFrom}
            dateTo={state.filters.dateTo}
            branchFilterOptions={state.branchFilterOptions}
            showBranchFilter={state.showBranchFilter}
            onSearchQueryChange={viewModel.setSearchQuery}
            onStatusFilterChange={viewModel.setStatusFilter}
            onBranchFilterChange={viewModel.setBranchFilter}
            onDateFromChange={viewModel.setDateFrom}
            onDateToChange={viewModel.setDateTo}
          />
        </CardContent>
      </Card>

      <SalesHistoryTable
        sales={state.filteredSales}
        showBranchColumn={state.showBranchColumn}
      />
    </div>
  )
}

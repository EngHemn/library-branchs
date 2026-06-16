"use client"

import { useRouter } from "next/navigation"
import { RefreshCwIcon, ScanSearchIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { LowStockAlertUseCase } from "@/domain/usecases/alerts/LowStockAlertUseCase"
import { LowStockAlertSummaryCards } from "@/presentation/components/alerts/LowStockAlertSummaryCards"
import { LowStockAlertsFilters } from "@/presentation/components/alerts/LowStockAlertsFilters"
import { LowStockAlertsTable } from "@/presentation/components/alerts/LowStockAlertsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useLowStockAlertsViewModel } from "@/presentation/viewmodels/alerts/useLowStockAlertsViewModel"

type LowStockAlertsScreenProps = {
  authUseCase: AuthUseCase
  lowStockAlertUseCase: LowStockAlertUseCase
}

function LoadingScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <Skeleton className="mt-4 h-8 w-56" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="min-h-80 rounded-lg" />
    </div>
  )
}

export function LowStockAlertsScreen({
  authUseCase,
  lowStockAlertUseCase,
}: LowStockAlertsScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useLowStockAlertsViewModel(
    authUseCase,
    lowStockAlertUseCase
  )
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("alerts.title") },
  ])

  if (state.isLoading) {
    return <LoadingScreen />
  }

  if (state.alertsStatus === "error") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg border-destructive/40">
          <CardHeader>
            <CardTitle>{t("alerts.unableToLoad")}</CardTitle>
            <CardDescription>
              {state.alertsError ?? t("common.somethingWentWrong")}
            </CardDescription>
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
      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("alerts.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("alerts.description")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={state.isSyncing}
            onClick={async () => {
              const success = await viewModel.syncFromInventory()
              if (success) {
                toast.success(t("alerts.syncSuccess"))
              } else {
                toast.error(t("alerts.syncError"))
              }
            }}
          >
            <ScanSearchIcon />
            {t("alerts.syncInventory")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void viewModel.reload()}
          >
            <RefreshCwIcon />
            {t("alerts.refresh")}
          </Button>
        </div>
      </div>

      <LowStockAlertSummaryCards
        summary={state.summary}
        isLoading={state.summaryStatus === "loading"}
      />

      <LowStockAlertsFilters
        searchQuery={state.searchQuery}
        branchFilter={state.branchFilter}
        statusFilter={state.statusFilter}
        branchOptions={state.branchOptions}
        showBranchFilter={state.showBranchFilter}
        onSearchQueryChange={viewModel.setSearchQuery}
        onBranchFilterChange={viewModel.setBranchFilter}
        onStatusFilterChange={viewModel.setStatusFilter}
      />

      <LowStockAlertsTable
        alerts={state.filteredAlerts}
        showBranchColumn={state.showBranchFilter}
        onViewBook={(alert) =>
          router.push(dashboardPaths.books.detail(alert.bookId))
        }
        onRestock={async (alert, quantity) => {
          const success = await viewModel.restock(alert.id, quantity)
          if (success) {
            toast.success(t("alerts.restockSuccess"))
            return true
          } else {
            toast.error(t("alerts.restockError"))
            return false
          }
        }}
        onMarkResolved={async (alert) => {
          const success = await viewModel.markResolved(alert.id)
          if (success) {
            toast.success(t("alerts.resolveSuccess"))
          } else {
            toast.error(t("alerts.resolveError"))
          }
        }}
      />
    </div>
  )
}

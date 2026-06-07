"use client"

import { useRouter } from "next/navigation"
import { RefreshCwIcon, ScanSearchIcon } from "lucide-react"

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
  const viewModel = useLowStockAlertsViewModel(
    authUseCase,
    lowStockAlertUseCase
  )
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Low Stock Alerts" },
  ])

  if (state.isLoading) {
    return <LoadingScreen />
  }

  if (state.alertsStatus === "error") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg border-destructive/40">
          <CardHeader>
            <CardTitle>Unable to load alerts</CardTitle>
            <CardDescription>
              {state.alertsError ?? "Something went wrong. Please try again."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => void viewModel.reload()}>
              <RefreshCwIcon />
              Retry
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
            Low Stock Alerts
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor book inventory levels and respond when stock falls below
            minimum thresholds.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={state.isSyncing}
            onClick={() => void viewModel.syncFromInventory()}
          >
            <ScanSearchIcon />
            Sync Inventory
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void viewModel.reload()}
          >
            <RefreshCwIcon />
            Refresh
          </Button>
        </div>
      </div>

      <LowStockAlertSummaryCards
        summary={state.summary}
        isLoading={state.summaryStatus === "loading"}
      />

      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <LowStockAlertsTable
        alerts={state.filteredAlerts}
        showBranchColumn={state.showBranchFilter}
        onViewBook={(alert) =>
          router.push(dashboardPaths.books.detail(alert.bookId))
        }
        onRestock={(alert, quantity) => viewModel.restock(alert.id, quantity)}
        onMarkResolved={(alert) => void viewModel.markResolved(alert.id)}
      />
    </div>
  )
}

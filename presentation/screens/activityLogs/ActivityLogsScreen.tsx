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
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetActivityLogsUseCase } from "@/domain/usecases/activityLogs/GetActivityLogsUseCase"
import { ActivityLogsFilters } from "@/presentation/components/activity-logs/ActivityLogsFilters"
import { ActivityLogsTable } from "@/presentation/components/activity-logs/ActivityLogsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useActivityLogsViewModel } from "@/presentation/viewmodels/activityLogs/useActivityLogsViewModel"

type ActivityLogsScreenProps = {
  authUseCase: AuthUseCase
  getActivityLogsUseCase: GetActivityLogsUseCase
}

function LoadingActivityLogsScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function ActivityLogsScreen({
  authUseCase,
  getActivityLogsUseCase,
}: ActivityLogsScreenProps) {
  const viewModel = useActivityLogsViewModel(authUseCase, getActivityLogsUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Activity Logs" },
  ])

  if (state.isLoading) {
    return <LoadingActivityLogsScreen />
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg border-destructive/40">
          <CardHeader>
            <CardTitle>Unable to load activity logs</CardTitle>
            <CardDescription>
              {state.error ?? "Something went wrong. Please try again."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" onClick={() => void viewModel.reload()}>
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
            Activity Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Review staff actions across branches. Filter by action, branch,
            or staff member and search by description or entity.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void viewModel.reload()}
        >
          <RefreshCwIcon />
          Refresh
        </Button>
      </div>

      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityLogsFilters
            searchQuery={state.searchQuery}
            onSearchQueryChange={viewModel.setSearchQuery}
            actionFilter={state.actionFilter}
            onActionFilterChange={viewModel.setActionFilter}
            branchFilter={state.branchFilter}
            onBranchFilterChange={viewModel.setBranchFilter}
            staffFilter={state.staffFilter}
            onStaffFilterChange={viewModel.setStaffFilter}
            branchFilterOptions={state.branchFilterOptions}
            showBranchFilter={state.showBranchFilter}
            staffOptions={state.staffOptions}
          />
        </CardContent>
      </Card>

      <ActivityLogsTable logs={state.filteredLogs} />
    </div>
  )
}

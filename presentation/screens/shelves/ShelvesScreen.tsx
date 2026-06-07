"use client"

import { useRouter } from "next/navigation"
import { PlusIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import { ShelfDeleteDialog } from "@/presentation/components/shelves/ShelfDeleteDialog"
import { ShelvesFilters } from "@/presentation/components/shelves/ShelvesFilters"
import { ShelvesSummaryCards } from "@/presentation/components/shelves/ShelvesSummaryCards"
import { ShelvesTable } from "@/presentation/components/shelves/ShelvesTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useShelvesViewModel } from "@/presentation/viewmodels/shelves/useShelvesViewModel"

type ShelvesScreenProps = {
  authUseCase: AuthUseCase
  shelfManagementUseCase: ShelfManagementUseCase
}

function LoadingShelvesScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[88px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="min-h-80 rounded-lg" />
    </div>
  )
}

export function ShelvesScreen({
  authUseCase,
  shelfManagementUseCase,
}: ShelvesScreenProps) {
  const router = useRouter()
  const viewModel = useShelvesViewModel(authUseCase, shelfManagementUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Shelf Management" },
  ])

  if (state.isLoading) {
    return <LoadingShelvesScreen />
  }

  if (state.shelvesStatus === "error") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg border-destructive/40">
          <CardHeader>
            <CardTitle>Unable to load shelves</CardTitle>
            <CardDescription>
              {state.shelvesError ?? "Something went wrong. Please try again."}
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
    <TooltipProvider>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Shelf Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage library shelves across main and sub branches by type,
              location, and capacity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void viewModel.reload()}
            >
              <RefreshCwIcon />
              Refresh
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => router.push(dashboardPaths.shelves.create)}
            >
              <PlusIcon />
              Add Shelf
            </Button>
          </div>
        </div>

        <ShelvesSummaryCards
          summary={state.summary}
          isLoading={state.summaryStatus === "loading"}
        />

        <Card className="rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <ShelvesFilters
              searchQuery={state.searchQuery}
              branchFilter={state.branchFilter}
              shelfTypeFilter={state.shelfTypeFilter}
              statusFilter={state.statusFilter}
              branchOptions={state.branchOptions}
              showBranchFilter={state.showBranchFilter}
              onSearchQueryChange={viewModel.setSearchQuery}
              onBranchFilterChange={viewModel.setBranchFilter}
              onShelfTypeFilterChange={viewModel.setShelfTypeFilter}
              onStatusFilterChange={viewModel.setStatusFilter}
            />
          </CardContent>
        </Card>

        <ShelvesTable
          shelves={state.filteredShelves}
          showBranchColumn={state.showBranchColumn}
          onView={(shelf) =>
            router.push(dashboardPaths.shelves.detail(shelf.id))
          }
          onEdit={(shelf) =>
            router.push(dashboardPaths.shelves.edit(shelf.id))
          }
          onDelete={(shelf) =>
            viewModel.openDeleteShelfDialog(shelf.id, shelf.name)
          }
        />

        <ShelfDeleteDialog
          open={state.deleteShelfDialog !== null}
          shelfName={state.deleteShelfDialog?.shelfName ?? ""}
          error={state.deleteShelfError}
          isDeleting={state.isDeleting}
          onClose={viewModel.closeDeleteShelfDialog}
          onConfirm={() => void viewModel.confirmDeleteShelf()}
        />
      </div>
    </TooltipProvider>
  )
}

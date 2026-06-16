"use client"

import { useRouter } from "next/navigation"
import { PlusIcon, RefreshCwIcon } from "lucide-react"
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
import type { NeedManagementUseCase } from "@/domain/usecases/needs/NeedManagementUseCase"
import { NeedDeleteDialog } from "@/presentation/components/needs/NeedDeleteDialog"
import { NeedRejectDialog } from "@/presentation/components/needs/NeedRejectDialog"
import { NeedsFilters } from "@/presentation/components/needs/NeedsFilters"
import { NeedsSummaryCards } from "@/presentation/components/needs/NeedsSummaryCards"
import { NeedsTable } from "@/presentation/components/needs/NeedsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useNeedsViewModel } from "@/presentation/viewmodels/needs/useNeedsViewModel"

type NeedsScreenProps = {
  authUseCase: AuthUseCase
  needManagementUseCase: NeedManagementUseCase
}

function LoadingNeedsScreen() {
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

export function NeedsScreen({
  authUseCase,
  needManagementUseCase,
}: NeedsScreenProps) {
  const router = useRouter()
  const viewModel = useNeedsViewModel(authUseCase, needManagementUseCase)
  const { t } = useTranslation()
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.needs") },
  ])

  if (state.isLoading) {
    return <LoadingNeedsScreen />
  }

  if (state.needsStatus === "error") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg border-destructive/40">
          <CardHeader>
            <CardTitle>{t("needs.loadError")}</CardTitle>
            <CardDescription>
              {state.needsError ?? t("common.somethingWentWrong")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" onClick={() => void viewModel.reload()}>
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
            {t("needs.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("needs.subtitle")}
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
            {t("needs.refresh")}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => router.push(dashboardPaths.needs.create)}
          >
            <PlusIcon />
            {t("needs.newRequest")}
          </Button>
        </div>
      </div>

      <NeedsSummaryCards
        summary={state.summary}
        isLoading={state.summaryStatus === "loading"}
      />

      <NeedsFilters
        searchQuery={state.searchQuery}
        categoryFilter={state.categoryFilter}
        branchFilter={state.branchFilter}
        priorityFilter={state.priorityFilter}
        statusFilter={state.statusFilter}
        dateFrom={state.dateFrom}
        dateTo={state.dateTo}
        branchOptions={state.branchOptions}
        showBranchFilter={state.showBranchFilter}
        onSearchQueryChange={viewModel.setSearchQuery}
        onCategoryFilterChange={viewModel.setCategoryFilter}
        onBranchFilterChange={viewModel.setBranchFilter}
        onPriorityFilterChange={viewModel.setPriorityFilter}
        onStatusFilterChange={viewModel.setStatusFilter}
        onDateFromChange={viewModel.setDateFrom}
        onDateToChange={viewModel.setDateTo}
        onClearFilters={viewModel.clearFilters}
      />

      <NeedsTable
        needs={state.filteredNeeds}
        showBranchColumn={state.showBranchFilter}
        onView={(need) => router.push(dashboardPaths.needs.detail(need.id))}
        onEdit={(need) => router.push(dashboardPaths.needs.edit(need.id))}
        onDelete={(need) =>
          viewModel.openDeleteNeedDialog(need.id, need.name)
        }
        onApprove={async (need) => {
          const success = await viewModel.approveNeed(need.id)
          if (success) {
            toast.success(t("needs.approveSuccess"))
          }
        }}
        onReject={(need) =>
          viewModel.openRejectNeedDialog(need.id, need.name)
        }
      />

      <NeedDeleteDialog
        open={state.deleteNeedDialog !== null}
        needName={state.deleteNeedDialog?.needName ?? ""}
        error={state.deleteNeedError}
        isDeleting={state.isDeletingNeed}
        onClose={viewModel.closeDeleteNeedDialog}
        onConfirm={async () => {
          const success = await viewModel.confirmDeleteNeed()
          if (success) {
            toast.success(t("needs.deleteSuccess"))
          }
        }}
      />

      <NeedRejectDialog
        open={state.rejectNeedDialog !== null}
        needName={state.rejectNeedDialog?.needName ?? ""}
        reason={state.rejectReason}
        error={state.rejectNeedError}
        isRejecting={state.isRejectingNeed}
        onReasonChange={viewModel.setRejectReason}
        onClose={viewModel.closeRejectNeedDialog}
        onConfirm={async () => {
          const success = await viewModel.confirmRejectNeed()
          if (success) {
            toast.success(t("needs.rejectSuccess"))
          }
        }}
      />
    </div>
  )
}

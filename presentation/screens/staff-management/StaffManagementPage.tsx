"use client"

import { useEffect } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { StaffDeleteDialog } from "@/presentation/components/staff-management/StaffDeleteDialog"
import { StaffFilters } from "@/presentation/components/staff-management/StaffFilters"
import { StaffTable } from "@/presentation/components/staff-management/StaffTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useStaffManagementViewModel } from "@/presentation/viewmodels/staff-management/useStaffManagementViewModel"

type StaffManagementPageProps = {
  authUseCase: AuthUseCase
  staffManagementUseCase: StaffManagementUseCase
}

function LoadingStaffManagementPage() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-10 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function StaffManagementPage({
  authUseCase,
  staffManagementUseCase,
}: StaffManagementPageProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useStaffManagementViewModel(
    authUseCase,
    staffManagementUseCase
  )
  const { state } = viewModel

  useEffect(() => {
    if (state.isUnauthenticated) {
      router.replace("/")
    }
  }, [router, state.isUnauthenticated])

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.staff") },
  ])

  const user = state.user

  return (
    <>
      {state.isLoading || state.isUnauthenticated ? (
        <LoadingStaffManagementPage />
      ) : null}

      {state.error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("staff.unavailable")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={viewModel.reload}>
                <RefreshCwIcon />
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isReady && user ? (
        <TooltipProvider>
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex items-center justify-between pt-4">
              <div>
                <h1 className="text-2xl font-bold tracking-normal">
                  {t("staff.title")}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("staff.subtitle")}
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard/staff/create")}>
                <PlusIcon />
                {t("staff.addStaff")}
              </Button>
            </section>

            <StaffFilters
              searchQuery={state.filters.searchQuery}
              roleFilter={state.filters.roleFilter}
              branchFilter={state.filters.branchFilter}
              statusFilter={state.filters.statusFilter}
              branchFilterOptions={state.branchFilterOptions}
              showBranchFilter={state.showBranchFilter}
              showBranchAdminRole={state.showBranchAdminRole}
              onSearchQueryChange={viewModel.setSearchQuery}
              onRoleFilterChange={viewModel.setRoleFilter}
              onBranchFilterChange={viewModel.setBranchFilter}
              onStatusFilterChange={viewModel.setStatusFilter}
            />

            <StaffTable
              staff={state.filteredStaff}
              showBranchColumn={state.showBranchColumn}
              onView={(member) => router.push(`/dashboard/staff/${member.id}`)}
              onEdit={(member) =>
                router.push(`/dashboard/staff/${member.id}/edit`)
              }
              onDelete={(member) =>
                viewModel.openDeleteStaffDialog(member.id, member.staffName)
              }
              onToggleStatus={(member) =>
                void viewModel.toggleStaffStatus(member.id)
              }
            />
          </div>
        </TooltipProvider>
      ) : null}

      <Dialog
        open={Boolean(state.dialog)}
        onOpenChange={(isOpen) => {
          if (!isOpen) viewModel.closeDialog()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{state.dialog?.title ?? ""}</DialogTitle>
            <DialogDescription>
              {state.dialog?.description ?? ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <StaffDeleteDialog
        open={state.deleteStaffDialog !== null}
        staffName={state.deleteStaffDialog?.staffName ?? ""}
        error={state.deleteStaffError}
        isDeleting={state.isDeletingStaff}
        onClose={viewModel.closeDeleteStaffDialog}
        onConfirm={() => {
          void viewModel.confirmDeleteStaff()
        }}
      />
    </>
  )
}

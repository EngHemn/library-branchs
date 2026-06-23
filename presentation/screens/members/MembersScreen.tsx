"use client"

import { useState } from "react"
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
import type { Member } from "@/domain/entities/member/Member"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { MembersFilters } from "@/presentation/components/members/MembersFilters"
import { MembersTable } from "@/presentation/components/members/MembersTable"
import { useBranchNameLookup } from "@/presentation/hooks/useBranchNameLookup"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useMembersViewModel } from "@/presentation/viewmodels/members/useMembersViewModel"

type MembersScreenProps = {
  authUseCase: AuthUseCase
  memberManagementUseCase: MemberManagementUseCase
  branchManagementUseCase: BranchManagementUseCase
}

function LoadingMembersScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-28 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function MembersScreen({
  authUseCase,
  memberManagementUseCase,
  branchManagementUseCase,
}: MembersScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useMembersViewModel(authUseCase, memberManagementUseCase)
  const branchNameToId = useBranchNameLookup(branchManagementUseCase)
  const { state } = viewModel
  const [deleteMember, setDeleteMember] = useState<Member | null>(null)

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.members") },
  ])

  const handleConfirmDelete = () => {
    if (!deleteMember) return
    void (async () => {
      await viewModel.deleteMember(deleteMember.id)
      setDeleteMember(null)
    })()
  }

  return (
    <>
      {state.isLoading ? <LoadingMembersScreen /> : null}

      {state.error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("members.unavailable")}</CardTitle>
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
      ) : null}

      {state.isReady ? (
        <TooltipProvider>
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-normal">
                  {t("members.title")}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("members.subtitle")}
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard/members/create")}>
                <PlusIcon />
                {t("members.addMember")}
              </Button>
            </section>

            <MembersFilters
              searchQuery={state.filters.searchQuery}
              statusFilter={state.filters.statusFilter}
              branchRegisteredFilter={state.filters.branchRegisteredFilter}
              branchUsedFilter={state.filters.branchUsedFilter}
              dateFrom={state.filters.dateFrom}
              dateTo={state.filters.dateTo}
              registeredBranches={state.registeredBranches}
              usedBranches={state.usedBranches}
              showRegisterBranchFilter={state.showRegisterBranchFilter}
              showBranchUsedFilter={state.showBranchUsedFilter}
              onSearchQueryChange={viewModel.setSearchQuery}
              onStatusFilterChange={viewModel.setStatusFilter}
              onBranchRegisteredFilterChange={
                viewModel.setBranchRegisteredFilter
              }
              onBranchUsedFilterChange={viewModel.setBranchUsedFilter}
              onDateFromChange={viewModel.setDateFrom}
              onDateToChange={viewModel.setDateTo}
            />

            <MembersTable
              members={state.filteredMembers}
              branchNameToId={branchNameToId}
              showRegisterBranchColumn={state.showRegisterBranchColumn}
              showBranchUsedColumn={state.showBranchUsedColumn}
              onView={(member) =>
                router.push(`/dashboard/members/${member.id}`)
              }
              onEdit={(member) =>
                router.push(`/dashboard/members/${member.id}/edit`)
              }
              onDelete={(member) => setDeleteMember(member)}
            />
          </div>
        </TooltipProvider>
      ) : null}

      <Dialog
        open={deleteMember !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteMember(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("members.deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("members.deleteDialog.description", {
                name: deleteMember?.memberName ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteMember(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={state.isDeleting}
            >
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

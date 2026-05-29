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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { ActiveFilters } from "@/presentation/components/branch-management/ActiveFilters"
import { BranchFilters } from "@/presentation/components/branch-management/BranchFilters"
import { BranchStatsCards } from "@/presentation/components/branch-management/BranchStatsCards"
import { BranchesTable } from "@/presentation/components/branch-management/BranchesTable"
import { MainBranchRequestsTable } from "@/presentation/components/branch-management/MainBranchRequestsTable"
import { SubBranchRequestsTable } from "@/presentation/components/branch-management/SubBranchRequestsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useBranchManagementViewModel } from "@/presentation/viewmodels/branch-management/useBranchManagementViewModel"

type BranchManagementPageProps = {
  authUseCase: AuthUseCase
  branchManagementUseCase: BranchManagementUseCase
}

function LoadingBranchManagementPage() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="rounded-lg">
            <CardHeader>
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-28 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function BranchManagementPage({
  authUseCase,
  branchManagementUseCase,
}: BranchManagementPageProps) {
  const router = useRouter()
  const viewModel = useBranchManagementViewModel(authUseCase, branchManagementUseCase)
  const { state } = viewModel

  useEffect(() => {
    if (state.isUnauthenticated) {
      router.replace("/")
    }
  }, [router, state.isUnauthenticated])

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Branch Management" },
  ])

  const user = state.user

  const handleDeleteBranch = (branch: Branch): void => {
    const confirmed = window.confirm(
      `Delete ${branch.branchName}? This removes the branch from the mock workspace state.`
    )
    if (confirmed) {
      void viewModel.deleteBranch(branch.id)
    }
  }

  return (
    <>
      {state.isLoading || state.isUnauthenticated ? <LoadingBranchManagementPage /> : null}

      {state.error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Branch management unavailable</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={viewModel.reload}>
                <RefreshCwIcon />
                Retry
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
                <h1 className="text-2xl font-semibold tracking-normal">
                  Branch Management
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage branches, main branch requests, and sub-branch requests.
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard/branches/create")}>
                <PlusIcon />
                Create Branch
              </Button>
            </section>

            <Tabs defaultValue="branches" className="gap-4">
              <TabsList className="grid w-full grid-cols-3 sm:w-fit">
                <TabsTrigger value="branches">Branches</TabsTrigger>
                <TabsTrigger value="main-requests">Main Branch Requests</TabsTrigger>
                <TabsTrigger value="sub-requests">Sub Branch Requests</TabsTrigger>
              </TabsList>

              <TabsContent value="branches" className="space-y-4">
                <BranchStatsCards stats={state.stats} />
                <BranchFilters
                  searchQuery={state.filters.searchQuery}
                  typeFilter={state.filters.typeFilter}
                  statusFilter={state.filters.statusFilter}
                  canResetFilters={state.canResetFilters}
                  onSearchQueryChange={viewModel.setSearchQuery}
                  onTypeFilterChange={viewModel.setTypeFilter}
                  onStatusFilterChange={viewModel.setStatusFilter}
                  onResetFilters={viewModel.resetFilters}
                />
                <ActiveFilters
                  filters={state.activeFilters}
                  onClearFilter={viewModel.clearFilter}
                />
                <BranchesTable
                  branches={state.filteredBranches}
                  onView={(branch) => router.push(`/dashboard/branches/${branch.id}`)}
                  onEdit={(branch) => router.push(`/dashboard/branches/${branch.id}/edit`)}
                  onDelete={handleDeleteBranch}
                  onToggleStatus={(branch) => void viewModel.toggleBranchStatus(branch.id)}
                />
              </TabsContent>

              <TabsContent value="main-requests" className="space-y-4">
                <MainBranchRequestsTable
                  requests={state.mainBranchRequests}
                  expandedRequestIds={state.expandedMainRequestIds}
                  onApprove={(request) => void viewModel.approveMainBranchRequest(request.id)}
                  onReject={(request) => void viewModel.rejectMainBranchRequest(request.id)}
                  onToggleNote={(request) => viewModel.toggleMainRequestNote(request.id)}
                />
              </TabsContent>

              <TabsContent value="sub-requests" className="space-y-4">
                <SubBranchRequestsTable
                  requests={state.subBranchRequests}
                  expandedRequestIds={state.expandedSubRequestIds}
                  onApprove={(request) => void viewModel.approveSubBranchRequest(request.id)}
                  onReject={(request) => void viewModel.rejectSubBranchRequest(request.id)}
                  onToggleNote={(request) => viewModel.toggleSubRequestNote(request.id)}
                />
              </TabsContent>
            </Tabs>
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
            <DialogDescription>{state.dialog?.description ?? ""}</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  )
}

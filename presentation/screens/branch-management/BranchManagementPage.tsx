"use client"

import { useEffect, useState } from "react"
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
import type {
  Branch,
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { ActiveFilters } from "@/presentation/components/branch-management/ActiveFilters"
import { BranchFilters } from "@/presentation/components/branch-management/BranchFilters"
import {
  BranchRequestApproveDialog,
  type BranchRequestApproveAction,
} from "@/presentation/components/branch-management/BranchRequestApproveDialog"
import {
  BranchRequestConfirmDialog,
  type BranchRequestConfirmAction,
} from "@/presentation/components/branch-management/BranchRequestConfirmDialog"
import {
  BranchRequestLocationDialog,
  type BranchRequestLocationView,
} from "@/presentation/components/branch-management/BranchRequestLocationDialog"
import {
  BranchRequestReplyDialog,
  type BranchRequestReplyAction,
} from "@/presentation/components/branch-management/BranchRequestReplyDialog"
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
  const [pendingRequestAction, setPendingRequestAction] =
    useState<BranchRequestConfirmAction | null>(null)
  const [pendingApproveAction, setPendingApproveAction] =
    useState<BranchRequestApproveAction | null>(null)
  const [pendingLocationView, setPendingLocationView] =
    useState<BranchRequestLocationView | null>(null)
  const [pendingReplyAction, setPendingReplyAction] =
    useState<BranchRequestReplyAction | null>(null)
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [isApprovingRequest, setIsApprovingRequest] = useState(false)

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

  const handleConfirmRequestAction = (message?: string): void => {
    if (!pendingRequestAction) {
      return
    }

    switch (pendingRequestAction.kind) {
      case "reject-main":
        void viewModel.rejectMainBranchRequest(
          pendingRequestAction.request.id,
          message
        )
        break
      case "reject-sub":
        void viewModel.rejectSubBranchRequest(
          pendingRequestAction.request.id,
          message
        )
        break
    }

    setPendingRequestAction(null)
  }

  const handleConfirmApprove = async (password: string): Promise<void> => {
    if (!pendingApproveAction) {
      return
    }

    setIsApprovingRequest(true)

    if (pendingApproveAction.kind === "main") {
      await viewModel.approveMainBranchRequest(
        pendingApproveAction.request.id,
        password
      )
    } else {
      await viewModel.approveSubBranchRequest(
        pendingApproveAction.request.id,
        password
      )
    }

    setIsApprovingRequest(false)
    setPendingApproveAction(null)
  }

  const handleConfirmReply = async (message: string): Promise<void> => {
    if (!pendingReplyAction) {
      return
    }

    setIsSendingReply(true)

    if (pendingReplyAction.kind === "main") {
      await viewModel.replyToMainBranchRequest(
        pendingReplyAction.request.id,
        message
      )
    } else {
      await viewModel.replyToSubBranchRequest(
        pendingReplyAction.request.id,
        message
      )
    }

    setIsSendingReply(false)
    setPendingReplyAction(null)
  }

  const openMainApproveConfirm = (request: MainBranchRequest): void => {
    setPendingApproveAction({ kind: "main", request })
  }

  const openMainRejectConfirm = (request: MainBranchRequest): void => {
    setPendingRequestAction({ kind: "reject-main", request })
  }

  const openSubApproveConfirm = (request: SubBranchRequest): void => {
    setPendingApproveAction({ kind: "sub", request })
  }

  const openSubRejectConfirm = (request: SubBranchRequest): void => {
    setPendingRequestAction({ kind: "reject-sub", request })
  }

  const openMainReply = (request: MainBranchRequest): void => {
    setPendingReplyAction({ kind: "main", request })
  }

  const openSubReply = (request: SubBranchRequest): void => {
    setPendingReplyAction({ kind: "sub", request })
  }

  const openRequestLocation = (request: {
    branchName: string
    address: string
    latitude: number | null
    longitude: number | null
  }): void => {
    setPendingLocationView(request)
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
                  onApprove={openMainApproveConfirm}
                  onReject={openMainRejectConfirm}
                  onReply={openMainReply}
                  onViewLocation={(request) =>
                    openRequestLocation({
                      branchName: request.branchName,
                      address: request.address,
                      latitude: request.latitude,
                      longitude: request.longitude,
                    })
                  }
                  onToggleNote={(request) => viewModel.toggleMainRequestNote(request.id)}
                />
              </TabsContent>

              <TabsContent value="sub-requests" className="space-y-4">
                <SubBranchRequestsTable
                  requests={state.subBranchRequests}
                  expandedRequestIds={state.expandedSubRequestIds}
                  onApprove={openSubApproveConfirm}
                  onReject={openSubRejectConfirm}
                  onReply={openSubReply}
                  onViewLocation={(request) =>
                    openRequestLocation({
                      branchName: request.branchName,
                      address: request.address,
                      latitude: request.latitude,
                      longitude: request.longitude,
                    })
                  }
                  onToggleNote={(request) => viewModel.toggleSubRequestNote(request.id)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </TooltipProvider>
      ) : null}

      <BranchRequestApproveDialog
        action={pendingApproveAction}
        isSubmitting={isApprovingRequest}
        onConfirm={(password) => void handleConfirmApprove(password)}
        onCancel={() => {
          if (!isApprovingRequest) {
            setPendingApproveAction(null)
          }
        }}
        onViewLocation={openRequestLocation}
      />

      <BranchRequestLocationDialog
        location={pendingLocationView}
        onClose={() => setPendingLocationView(null)}
      />

      <BranchRequestConfirmDialog
        action={pendingRequestAction}
        onConfirm={handleConfirmRequestAction}
        onCancel={() => setPendingRequestAction(null)}
      />

      <BranchRequestReplyDialog
        action={pendingReplyAction}
        isSending={isSendingReply}
        onConfirm={(message) => void handleConfirmReply(message)}
        onCancel={() => {
          if (!isSendingReply) {
            setPendingReplyAction(null)
          }
        }}
      />

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

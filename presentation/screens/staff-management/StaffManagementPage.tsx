"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, RefreshCwIcon } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { StaffFilters } from "@/presentation/components/staff-management/StaffFilters"
import { StaffTable } from "@/presentation/components/staff-management/StaffTable"
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

  const user = state.user

  const handleDeleteStaff = (member: StaffMember): void => {
    const confirmed = window.confirm(
      `Delete ${member.staffName}? This removes the staff member from the mock workspace state.`
    )

    if (confirmed) {
      void viewModel.deleteStaff(member.id)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={
          user
            ? {
                name: user.fullName,
                email: `${user.username}@liba.local`,
                avatar: "",
              }
            : undefined
        }
        onLogout={viewModel.logout}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Staff Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading || state.isUnauthenticated ? (
          <LoadingStaffManagementPage />
        ) : null}

        {state.error ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Staff management unavailable</CardTitle>
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
                  <h1 className="text-2xl font-bold tracking-normal">
                    Staff Management
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage users, roles and branch assignments.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/dashboard/staff/create")}
                >
                  <PlusIcon />
                  Add Staff
                </Button>
              </section>

              <StaffFilters
                searchQuery={state.filters.searchQuery}
                roleFilter={state.filters.roleFilter}
                branchFilter={state.filters.branchFilter}
                statusFilter={state.filters.statusFilter}
                branches={state.branches}
                onSearchQueryChange={viewModel.setSearchQuery}
                onRoleFilterChange={viewModel.setRoleFilter}
                onBranchFilterChange={viewModel.setBranchFilter}
                onStatusFilterChange={viewModel.setStatusFilter}
              />

              <StaffTable
                staff={state.filteredStaff}
                onView={(member) => {
                  router.push(`/dashboard/staff/${member.id}`)
                }}
                onEdit={(member) => {
                  router.push(`/dashboard/staff/${member.id}/edit`)
                }}
                onDelete={handleDeleteStaff}
                onToggleStatus={(member) => {
                  void viewModel.toggleStaffStatus(member.id)
                }}
              />
            </div>
          </TooltipProvider>
        ) : null}

        <Dialog
          open={Boolean(state.dialog)}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              viewModel.closeDialog()
            }
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
      </SidebarInset>
    </SidebarProvider>
  )
}

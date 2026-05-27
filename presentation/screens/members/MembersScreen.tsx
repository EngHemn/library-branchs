"use client"

import { useState } from "react"
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
import type { Member } from "@/domain/entities/member/Member"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { MembersFilters } from "@/presentation/components/members/MembersFilters"
import { MembersTable } from "@/presentation/components/members/MembersTable"
import { useMembersViewModel } from "@/presentation/viewmodels/members/useMembersViewModel"

type MembersScreenProps = {
  memberManagementUseCase: MemberManagementUseCase
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
  memberManagementUseCase,
}: MembersScreenProps) {
  const router = useRouter()
  const viewModel = useMembersViewModel(memberManagementUseCase)
  const { state } = viewModel
  const [deleteMember, setDeleteMember] = useState<Member | null>(null)

  const handleConfirmDelete = () => {
    if (!deleteMember) return
    void (async () => {
      await viewModel.deleteMember(deleteMember.id)
      setDeleteMember(null)
    })()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
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
                  <BreadcrumbPage>Members</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading ? <LoadingMembersScreen /> : null}

        {state.error ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Members unavailable</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => void viewModel.reload()}>
                  <RefreshCwIcon />
                  Retry
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
                  <h1 className="text-2xl font-bold tracking-normal">Members</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Members are global records and can borrow from any branch.
                  </p>
                </div>
                <Button onClick={() => router.push("/dashboard/members/create")}>
                  <PlusIcon />
                  Add Member
                </Button>
              </section>

              <MembersFilters
                appliedFilters={state.appliedFilters}
                activeFilters={state.activeFilters}
                registeredBranches={state.registeredBranches}
                usedBranches={state.usedBranches}
                onSearchQueryChange={viewModel.setSearchQuery}
                onApply={viewModel.applyFilters}
                onClearFilter={viewModel.clearFilter}
                onResetFilters={viewModel.resetFilters}
              />

              <MembersTable
                members={state.filteredMembers}
                onView={(member) => {
                  router.push(`/dashboard/members/${member.id}`)
                }}
                onEdit={(member) => {
                  router.push(`/dashboard/members/${member.id}/edit`)
                }}
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
              <DialogTitle>Delete Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;{deleteMember?.memberName}
                &rdquo;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteMember(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={state.isDeleting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}

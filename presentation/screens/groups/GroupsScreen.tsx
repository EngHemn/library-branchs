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
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"
import { GroupDeleteDialog } from "@/presentation/components/groups/GroupDeleteDialog"
import { GroupSummaryCards } from "@/presentation/components/groups/GroupSummaryCards"
import { GroupsFilters } from "@/presentation/components/groups/GroupsFilters"
import { GroupsTable } from "@/presentation/components/groups/GroupsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useGroupsViewModel } from "@/presentation/viewmodels/groups/useGroupsViewModel"

type GroupsScreenProps = {
  authUseCase: AuthUseCase
  groupManagementUseCase: GroupManagementUseCase
}

function LoadingGroupsScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="min-h-80 rounded-lg" />
    </div>
  )
}

export function GroupsScreen({
  authUseCase,
  groupManagementUseCase,
}: GroupsScreenProps) {
  const router = useRouter()
  const viewModel = useGroupsViewModel(authUseCase, groupManagementUseCase)
  const { state } = viewModel

  const summaryLoading =
    state.summaryStatus === "idle" || state.summaryStatus === "loading"

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Group Management" },
  ])

  if (state.isLoading) {
    return <LoadingGroupsScreen />
  }

  if (state.groupsStatus === "error") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg border-destructive/40">
          <CardHeader>
            <CardTitle>Unable to load groups</CardTitle>
            <CardDescription>
              {state.groupsError ?? "Something went wrong. Please try again."}
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
            Group Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize books and staff into groups for programs, collections, and
            collaborative management.
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
            onClick={() => router.push(dashboardPaths.groups.create)}
          >
            <PlusIcon />
            Add Group
          </Button>
        </div>
      </div>

      <GroupSummaryCards summary={state.summary} isLoading={summaryLoading} />

      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <GroupsFilters
            searchQuery={state.searchQuery}
            onSearchQueryChange={viewModel.setSearchQuery}
            statusFilter={state.statusFilter}
            onStatusFilterChange={viewModel.setStatusFilter}
          />
        </CardContent>
      </Card>

      <GroupsTable
        groups={state.filteredGroups}
        onView={(group) => router.push(dashboardPaths.groups.detail(group.id))}
        onEdit={(group) => router.push(dashboardPaths.groups.edit(group.id))}
        onDelete={(group) =>
          viewModel.openDeleteGroupDialog(group.id, group.name)
        }
      />

      <GroupDeleteDialog
        open={state.deleteGroupDialog !== null}
        groupName={state.deleteGroupDialog?.groupName ?? ""}
        error={state.deleteGroupError}
        isDeleting={state.isDeletingGroup}
        onClose={viewModel.closeDeleteGroupDialog}
        onConfirm={() => void viewModel.confirmDeleteGroup()}
      />
    </div>
  )
}

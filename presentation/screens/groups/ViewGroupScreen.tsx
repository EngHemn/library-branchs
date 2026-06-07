"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeftIcon, BookOpenIcon, LayersIcon, PencilIcon, RefreshCwIcon, UsersRoundIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EntityImage } from "@/components/ui/entity-image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { GroupStatus } from "@/domain/entities/group/Group"
import type { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { GroupBooksTab } from "@/presentation/components/groups/GroupBooksTab"
import { GroupDetailsTab } from "@/presentation/components/groups/GroupDetailsTab"
import { GroupReportHistoryTab } from "@/presentation/components/groups/GroupReportHistoryTab"
import { GroupSalesHistoryTab } from "@/presentation/components/groups/GroupSalesHistoryTab"
import { GroupStaffTab } from "@/presentation/components/groups/GroupStaffTab"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useGroupDetailViewModel } from "@/presentation/viewmodels/groups/useGroupDetailViewModel"

type ViewGroupScreenProps = {
  groupId: string
  authUseCase: AuthUseCase
  groupManagementUseCase: GroupManagementUseCase
}

const statusVariants: Record<
  GroupStatus,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  inactive: "outline",
}

const statusLabels: Record<GroupStatus, string> = {
  active: "Active",
  inactive: "Inactive",
}

const groupDetailTabs = [
  "details",
  "books",
  "staff",
  "sales",
  "reports",
] as const

type GroupDetailTab = (typeof groupDetailTabs)[number]

function parseGroupDetailTab(tab: string | null): GroupDetailTab {
  if (tab && groupDetailTabs.includes(tab as GroupDetailTab)) {
    return tab as GroupDetailTab
  }
  return "details"
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-10 w-full max-w-xl rounded-lg" />
      <Skeleton className="min-h-80 rounded-lg" />
    </div>
  )
}

export function ViewGroupScreen({
  groupId,
  authUseCase,
  groupManagementUseCase,
}: ViewGroupScreenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialBooksBranchFilter =
    searchParams.get("booksBranch") === "all" ? "all" : undefined
  const viewModel = useGroupDetailViewModel(
    groupId,
    authUseCase,
    groupManagementUseCase,
    { initialBooksBranchFilter }
  )
  const { state } = viewModel
  const [activeTab, setActiveTab] = useState<GroupDetailTab>(() =>
    parseGroupDetailTab(searchParams.get("tab"))
  )

  useEffect(() => {
    setActiveTab(parseGroupDetailTab(searchParams.get("tab")))
  }, [searchParams])

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Group Management", href: dashboardPaths.groups.list },
    { label: state.group?.name ?? "Group Details" },
  ])

  const goBack = () => router.push(dashboardPaths.groups.list)

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Group not found</CardTitle>
              <CardDescription>
                The group you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to groups
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Unable to load group</CardTitle>
              <CardDescription>
                {state.error ?? "Something went wrong. Please try again."}
              </CardDescription>
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

      {state.isReady && state.group ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <EntityImage
                src={state.group.imageUrl}
                alt={state.group.name}
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-lg"
                fallback={
                  <LayersIcon className="size-6 text-muted-foreground" />
                }
              />
              <div className="space-y-1">
                <p className="font-mono text-xs text-muted-foreground">
                  {state.group.id}
                </p>
                <h1 className="text-2xl font-bold tracking-normal">
                  {state.group.name}
                </h1>
                <Badge variant={statusVariants[state.group.status]}>
                  {statusLabels[state.group.status]}
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back
              </Button>
              <Button
                onClick={() =>
                  router.push(dashboardPaths.groups.edit(groupId))
                }
              >
                <PencilIcon />
                Edit Group
              </Button>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="rounded-lg">
              <CardContent className="flex items-center gap-4 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <BookOpenIcon className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Books</p>
                  <p className="text-xl font-semibold tabular-nums">
                    {state.group.totalBooks}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardContent className="flex items-center gap-4 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <UsersRoundIcon className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Staff</p>
                  <p className="text-xl font-semibold tabular-nums">
                    {state.group.totalAssignedStaff}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardContent className="flex items-center gap-4 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <LayersIcon className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-xl font-semibold">
                    {statusLabels[state.group.status]}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as GroupDetailTab)}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="books">
                Books ({state.group.totalBooks})
              </TabsTrigger>
              <TabsTrigger value="staff">
                Staff ({state.group.totalAssignedStaff})
              </TabsTrigger>
              <TabsTrigger value="sales">
                Sales History ({state.sales.length})
              </TabsTrigger>
              <TabsTrigger value="reports">Report History</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <GroupDetailsTab group={state.group} />
            </TabsContent>
            <TabsContent value="books" className="mt-4">
              <GroupBooksTab
                books={state.filteredBooks}
                totalBooks={state.group.totalBooks}
                filters={state.booksFilters}
                categories={state.bookCategories}
                authors={state.bookAuthors}
                branchFilterOptions={state.booksBranchFilterOptions}
                showBranchFilter={state.showBooksBranchFilter}
                onSearchQueryChange={viewModel.setBooksSearchQuery}
                onCategoryFilterChange={viewModel.setBooksCategoryFilter}
                onAuthorFilterChange={viewModel.setBooksAuthorFilter}
                onBranchFilterChange={viewModel.setBooksBranchFilter}
              />
            </TabsContent>
            <TabsContent value="staff" className="mt-4">
              <GroupStaffTab staff={state.group.staff} />
            </TabsContent>
            <TabsContent value="sales" className="mt-4">
              <GroupSalesHistoryTab
                sales={state.filteredSales}
                totalSales={state.sales.length}
                filters={state.salesFilters}
                branchFilterOptions={state.salesBranchFilterOptions}
                showBranchFilter={state.showSalesBranchFilter}
                showBranchColumn={state.showSalesBranchColumn}
                isLoading={state.isSalesLoading}
                error={state.salesError}
                onBranchFilterChange={viewModel.setSalesBranchFilter}
                onDateFromChange={viewModel.setSalesDateFrom}
                onDateToChange={viewModel.setSalesDateTo}
                onRetry={() => void viewModel.reload()}
              />
            </TabsContent>
            <TabsContent value="reports" className="mt-4">
              <GroupReportHistoryTab
                report={state.salesReport}
                totalSales={state.sales.length}
                filters={state.salesFilters}
                branchFilterOptions={state.salesBranchFilterOptions}
                showBranchFilter={state.showSalesBranchFilter}
                isLoading={state.isSalesLoading}
                error={state.salesError}
                onBranchFilterChange={viewModel.setSalesBranchFilter}
                onDateFromChange={viewModel.setSalesDateFrom}
                onDateToChange={viewModel.setSalesDateTo}
                onRetry={() => void viewModel.reload()}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </>
  )
}

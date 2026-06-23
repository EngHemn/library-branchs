"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangleIcon, BookOpenIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetDashboardSummaryUseCase } from "@/domain/usecases/dashboard/GetDashboardSummaryUseCase"
import { DashboardActivityFeed } from "@/presentation/components/dashboard/DashboardActivityFeed"
import { DashboardBookCharts } from "@/presentation/components/dashboard/DashboardBookCharts"
import { DashboardBookingCharts } from "@/presentation/components/dashboard/DashboardBookingCharts"
import { DashboardFilters } from "@/presentation/components/dashboard/DashboardFilters"
import { DashboardGroupStats } from "@/presentation/components/dashboard/DashboardGroupStats"
import {
  DashboardNeedsAlertsStats,
  DashboardAlertsSection,
} from "@/presentation/components/dashboard/DashboardNeedsAlertsStats"
import { DashboardMetricsGrid } from "@/presentation/components/dashboard/DashboardMetricsGrid"
import { DashboardOverviewCharts } from "@/presentation/components/dashboard/DashboardOverviewCharts"
import { DashboardRecentBookingsTable } from "@/presentation/components/dashboard/DashboardRecentBookingsTable"
import { DashboardRecentBooksTable } from "@/presentation/components/dashboard/DashboardRecentBooksTable"
import { DashboardRecentMembersTable } from "@/presentation/components/dashboard/DashboardRecentMembersTable"
import { DashboardRecentSalesTable } from "@/presentation/components/dashboard/DashboardRecentSalesTable"
import { DashboardStaffCharts } from "@/presentation/components/dashboard/DashboardStaffCharts"
import { DashboardStaffTable } from "@/presentation/components/dashboard/DashboardStaffTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useDashboardViewModel } from "@/presentation/viewmodels/dashboard/useDashboardViewModel"

type DashboardScreenProps = {
  authUseCase: AuthUseCase
  getDashboardSummaryUseCase: GetDashboardSummaryUseCase
}

function LoadingDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-md" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="rounded-xl">
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-20" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    </div>
  )
}

function EmptyTabContent({
  labelKey,
}: {
  labelKey: "bookings" | "books" | "members" | "sales" | "staff"
}) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed">
      <p className="text-sm text-muted-foreground">
        {t("dashboard.emptyTab", {
          label: t(`dashboard.emptyLabels.${labelKey}`),
        })}
      </p>
    </div>
  )
}

export function DashboardScreen({
  authUseCase,
  getDashboardSummaryUseCase,
}: DashboardScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useDashboardViewModel(
    authUseCase,
    getDashboardSummaryUseCase
  )
  const { state } = viewModel

  useEffect(() => {
    if (state.isUnauthenticated) {
      router.replace("/")
    }
  }, [router, state.isUnauthenticated])

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("dashboard.title") },
  ])

  const user = state.user
  const summary = state.summary
  const showBranchColumn = state.branchScope?.showBranchFilter ?? false

  return (
    <>
      {state.isLoading || state.isUnauthenticated ? <LoadingDashboard /> : null}

      {state.error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-xl">
            <CardHeader>
              <CardTitle>{t("dashboard.unavailable")}</CardTitle>
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

      {state.isReady && user && summary ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex flex-col gap-2 pt-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t("dashboard.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dashboard.subtitle", { name: user.fullName })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={viewModel.reload}
              className="shrink-0"
            >
              <RefreshCwIcon />
              {t("common.refresh")}
            </Button>
          </section>

          <DashboardFilters
            branches={state.branchScope?.branches ?? summary.branches}
            selectedBranchId={state.filterState.branchId}
            dateFrom={state.filterState.dateFrom}
            dateTo={state.filterState.dateTo}
            allowAllBranches={state.branchScope?.allowAllBranches ?? true}
            showBranchFilter={state.branchScope?.showBranchFilter ?? false}
            onBranchChange={viewModel.setBranchId}
            onDateFromChange={viewModel.setDateFrom}
            onDateToChange={viewModel.setDateTo}
          />

          <Tabs defaultValue="overview">
            <TabsList className="h-auto flex-wrap gap-1">
              <TabsTrigger value="overview">
                {t("dashboard.tabs.overview")}
              </TabsTrigger>
              <TabsTrigger value="bookings">
                {t("dashboard.tabs.bookings")}
                {state.filteredBookings.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {state.filteredBookings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="books">
                {t("dashboard.tabs.books")}
                {state.filteredBooks.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {state.filteredBooks.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="members">
                {t("dashboard.tabs.members")}
                {state.filteredMembers.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {state.filteredMembers.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="sales">
                {t("dashboard.tabs.sales")}
                {state.filteredSales.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {state.filteredSales.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="staff">
                {t("dashboard.tabs.staff")}
                {state.filteredStaff.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {state.filteredStaff.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-5 flex flex-col gap-5">
              <DashboardMetricsGrid metrics={summary.metrics} />

              <DashboardNeedsAlertsStats needStats={summary.needStats} />

              <DashboardOverviewCharts
                bookingsByStatus={summary.bookingsByStatus}
                salesTrend={summary.salesTrend}
              />

              <DashboardGroupStats groupStats={summary.groupStats} />

              <DashboardAlertsSection
                criticalNeedRequests={summary.criticalNeedRequests}
                lowStockBooksPreview={summary.lowStockBooksPreview}
              />

              <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {t("dashboard.overview.recentActivity")}
                    </CardTitle>
                    <CardDescription>
                      {t("dashboard.overview.recentActivityDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DashboardActivityFeed activities={summary.activities} />
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                  <Card className="rounded-xl">
                    <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                        <AlertTriangleIcon className="size-4 text-amber-600 dark:text-amber-400" />
                      </span>
                      <div className="min-w-0">
                        <CardTitle className="text-sm">
                          {t("dashboard.overview.stockAlerts")}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {t("dashboard.overview.stockAlertsDescription")}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {summary.stockAlerts}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("dashboard.overview.stockAlertsHelper")}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl">
                    <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/40">
                        <BookOpenIcon className="size-4 text-rose-600 dark:text-rose-400" />
                      </span>
                      <div className="min-w-0">
                        <CardTitle className="text-sm">
                          {t("dashboard.overview.overdueReturns")}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {t("dashboard.overview.overdueReturnsDescription")}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {summary.overdueBookings}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("dashboard.overview.overdueReturnsHelper")}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="mt-5 flex flex-col gap-5">
              <DashboardBookingCharts
                bookingsByStatus={summary.bookingsByStatus}
                bookingsByType={summary.bookingsByType}
              />
              {state.filteredBookings.length === 0 ? (
                <EmptyTabContent labelKey="bookings" />
              ) : (
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {t("dashboard.sections.recentBookings")}
                    </CardTitle>
                    <CardDescription>
                      {t("dashboard.sections.recentBookingsDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DashboardRecentBookingsTable
                      bookings={state.filteredBookings}
                      showBranchColumn={showBranchColumn}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="books" className="mt-5 flex flex-col gap-5">
              <DashboardBookCharts
                booksByStatus={summary.booksByStatus}
                booksByCategory={summary.booksByCategory}
              />
              {state.filteredBooks.length === 0 ? (
                <EmptyTabContent labelKey="books" />
              ) : (
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {t("dashboard.sections.recentBooks")}
                    </CardTitle>
                    <CardDescription>
                      {t("dashboard.sections.recentBooksDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DashboardRecentBooksTable
                      books={state.filteredBooks}
                      showBranchColumn={showBranchColumn}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="members" className="mt-5">
              {state.filteredMembers.length === 0 ? (
                <EmptyTabContent labelKey="members" />
              ) : (
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {t("dashboard.sections.members")}
                    </CardTitle>
                    <CardDescription>
                      {t("dashboard.sections.membersDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DashboardRecentMembersTable
                      members={state.filteredMembers}
                      showBranchColumn={showBranchColumn}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="sales" className="mt-5">
              {state.filteredSales.length === 0 ? (
                <EmptyTabContent labelKey="sales" />
              ) : (
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {t("dashboard.sections.sales")}
                    </CardTitle>
                    <CardDescription>
                      {t("dashboard.sections.salesDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DashboardRecentSalesTable
                      sales={state.filteredSales}
                      showBranchColumn={showBranchColumn}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="staff" className="mt-5 flex flex-col gap-5">
              <DashboardStaffCharts
                staffByRole={summary.staffByRole}
                staffByBranch={summary.staffByBranch}
                showBranchChart={showBranchColumn}
              />
              {state.filteredStaff.length === 0 ? (
                <EmptyTabContent labelKey="staff" />
              ) : (
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {t("dashboard.sections.staffMembers")}
                    </CardTitle>
                    <CardDescription>
                      {t("dashboard.sections.staffMembersDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DashboardStaffTable
                      staff={state.filteredStaff}
                      showBranchColumn={showBranchColumn}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </>
  )
}

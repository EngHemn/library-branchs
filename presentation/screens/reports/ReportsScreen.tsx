"use client"

import {
  BarChart3Icon,
  BookOpenIcon,
  BookMarkedIcon,
  BoxesIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  LanguagesIcon,
  PenLineIcon,
  RefreshCwIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react"

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
import type {
  ReportCategory,
  ReportChart,
  ReportKpi,
  ReportTable,
} from "@/domain/entities/reports/Reports"
import { REPORT_CHARTS_PER_TAB } from "@/domain/entities/reports/Reports"
import type { GetReportsUseCase } from "@/domain/usecases/reports/GetReportsUseCase"
import { ReportDataTable } from "@/presentation/components/reports/ReportDataTable"
import { ReportRechart } from "@/presentation/components/reports/ReportRechart"
import { ReportsFilters } from "@/presentation/components/reports/ReportsFilters"
import { ReportsSummaryCards } from "@/presentation/components/reports/ReportsSummaryCards"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useReportsViewModel } from "@/presentation/viewmodels/reports/useReportsViewModel"

type ReportsScreenProps = {
  getReportsUseCase: GetReportsUseCase
}

const reportTabs: {
  value: ReportCategory
  label: string
  icon: typeof BarChart3Icon
}[] = [
  { value: "overview", label: "Overview", icon: BarChart3Icon },
  { value: "sales", label: "Sales", icon: ShoppingCartIcon },
  { value: "inventory", label: "Inventory", icon: BoxesIcon },
  { value: "events", label: "Events", icon: CalendarDaysIcon },
  { value: "members", label: "Members", icon: UsersIcon },
  { value: "authors", label: "Authors", icon: PenLineIcon },
  { value: "translators", label: "Translators", icon: LanguagesIcon },
  { value: "bookings", label: "Bookings", icon: CalendarCheckIcon },
  { value: "books", label: "Books", icon: BookOpenIcon },
]

function chartsForTab(charts: ReportChart[], category: ReportCategory): ReportChart[] {
  return charts
    .filter((chart) => chart.category === category)
    .slice(0, REPORT_CHARTS_PER_TAB)
}

function kpisForTab(kpis: ReportKpi[], category: ReportCategory): ReportKpi[] {
  return kpis.filter((kpi) => kpi.category === category)
}

function tablesForTab(tables: ReportTable[], category: ReportCategory): ReportTable[] {
  if (category !== "overview") {
    return []
  }
  return tables.filter((table) => table.category === "overview")
}

function LoadingReportsScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-28 rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-80 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function ReportsScreen({ getReportsUseCase }: ReportsScreenProps) {
  const viewModel = useReportsViewModel(getReportsUseCase)
  const { state } = viewModel
  const reports = state.isReady ? state.reports : null

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Reports" },
  ])

  return (
    <>
      {state.isLoading ? <LoadingReportsScreen /> : null}

      {state.error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Reports unavailable</CardTitle>
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

      {reports ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                Reports & Analytics
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Recharts dashboards with branch and date filters across all
                library modules.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={viewModel.reload}>
              <RefreshCwIcon />
              Refresh
            </Button>
          </section>

          <Card className="rounded-lg">
            <CardContent className="pt-6">
              <ReportsFilters
                period={state.period}
                onPeriodChange={viewModel.setPeriod}
                branchId={state.branchId}
                onBranchChange={viewModel.setBranchId}
                branches={state.branches}
                dateFrom={state.dateFrom}
                dateTo={state.dateTo}
                onDateFromChange={viewModel.setDateFrom}
                onDateToChange={viewModel.setDateTo}
                periodLabel={reports.periodLabel}
                branchName={reports.branchName}
                generatedAt={reports.generatedAt}
              />
            </CardContent>
          </Card>

          <Tabs
            value={state.category}
            onValueChange={(value) =>
              viewModel.setCategory(value as ReportCategory)
            }
          >
            <div className="overflow-x-auto pb-1">
              <TabsList variant="line" className="w-max min-w-full justify-start">
                {reportTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    <tab.icon className="size-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {reportTabs.map((tab) => {
              const tabCharts = chartsForTab(reports.charts, tab.value)
              const tabKpis = kpisForTab(reports.kpis, tab.value)
              const tabTables = tablesForTab(reports.tables, tab.value)

              return (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="mt-4 space-y-5"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookMarkedIcon className="size-4" />
                    <span>
                      {tabCharts.length} charts · {reports.branchName} ·{" "}
                      {state.dateFrom} → {state.dateTo}
                    </span>
                  </div>

                  <ReportsSummaryCards kpis={tabKpis} />

                  {tabCharts.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {tabCharts.map((chart) => (
                        <ReportRechart key={chart.id} chart={chart} />
                      ))}
                    </div>
                  ) : (
                    <Card className="rounded-lg">
                      <CardHeader>
                        <CardTitle>No charts for this tab</CardTitle>
                        <CardDescription>
                          Adjust branch or date filters and refresh.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}

                  {tabTables.length > 0 ? (
                    <div className="space-y-4">
                      {tabTables.map((table) => (
                        <ReportDataTable key={table.id} table={table} />
                      ))}
                    </div>
                  ) : null}
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      ) : null}
    </>
  )
}

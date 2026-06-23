"use client"

import {
  BarChart3Icon,
  BookOpenIcon,
  BookMarkedIcon,
  BoxesIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
  LayersIcon,
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
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { ReportDataTable } from "@/presentation/components/reports/ReportDataTable"
import { ReportRechart } from "@/presentation/components/reports/ReportRechart"
import { ReportsFilters } from "@/presentation/components/reports/ReportsFilters"
import { ReportsSummaryCards } from "@/presentation/components/reports/ReportsSummaryCards"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useReportsViewModel } from "@/presentation/viewmodels/reports/useReportsViewModel"

type ReportsScreenProps = {
  authUseCase: AuthUseCase
  getReportsUseCase: GetReportsUseCase
}

const reportTabs: {
  value: ReportCategory
  labelKey: TranslationKey
  icon: typeof BarChart3Icon
}[] = [
  { value: "overview", labelKey: "reports.tabs.overview", icon: BarChart3Icon },
  { value: "sales", labelKey: "reports.tabs.sales", icon: ShoppingCartIcon },
  { value: "inventory", labelKey: "reports.tabs.inventory", icon: BoxesIcon },
  { value: "groups", labelKey: "reports.tabs.groups", icon: LayersIcon },
  { value: "members", labelKey: "reports.tabs.members", icon: UsersIcon },
  { value: "authors", labelKey: "reports.tabs.authors", icon: PenLineIcon },
  {
    value: "translators",
    labelKey: "reports.tabs.translators",
    icon: LanguagesIcon,
  },
  {
    value: "bookings",
    labelKey: "reports.tabs.bookings",
    icon: CalendarCheckIcon,
  },
  { value: "books", labelKey: "reports.tabs.books", icon: BookOpenIcon },
  { value: "orders", labelKey: "reports.tabs.orders", icon: ClipboardListIcon },
]

function chartsForTab(
  charts: ReportChart[],
  category: ReportCategory
): ReportChart[] {
  return charts
    .filter((chart) => chart.category === category)
    .slice(0, REPORT_CHARTS_PER_TAB)
}

function kpisForTab(kpis: ReportKpi[], category: ReportCategory): ReportKpi[] {
  return kpis.filter((kpi) => kpi.category === category)
}

function tablesForTab(
  tables: ReportTable[],
  category: ReportCategory
): ReportTable[] {
  if (category === "overview" || category === "orders") {
    return tables.filter((table) => table.category === category)
  }
  return []
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

export function ReportsScreen({
  authUseCase,
  getReportsUseCase,
}: ReportsScreenProps) {
  const { t } = useTranslation()
  const viewModel = useReportsViewModel(authUseCase, getReportsUseCase)
  const { state } = viewModel
  const reports = state.isReady ? state.reports : null

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.reports") },
  ])

  return (
    <>
      {state.isLoading ? <LoadingReportsScreen /> : null}

      {state.error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("reports.unableToLoad")}</CardTitle>
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

      {reports ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                {t("reports.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("reports.subtitle")}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={viewModel.reload}>
              <RefreshCwIcon />
              {t("common.refresh")}
            </Button>
          </section>

          <Card className="rounded-lg">
            <CardContent className="pt-6">
              <ReportsFilters
                period={state.period}
                onPeriodChange={viewModel.setPeriod}
                branchId={state.branchId}
                onBranchChange={viewModel.setBranchId}
                branchFilterOptions={state.branchFilterOptions}
                showBranchFilter={state.showBranchFilter}
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
              <TabsList
                variant="line"
                className="w-max min-w-full justify-start"
              >
                {reportTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    <tab.icon className="size-4" />
                    {t(tab.labelKey)}
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
                      {tabCharts.length === 1
                        ? t("reports.chartsCountOne", {
                            count: tabCharts.length,
                          })
                        : t("reports.chartsCountOther", {
                            count: tabCharts.length,
                          })}{" "}
                      · {reports.branchName} · {state.dateFrom} → {state.dateTo}
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
                        <CardTitle>{t("reports.noCharts")}</CardTitle>
                        <CardDescription>
                          {t("reports.adjustFilters")}
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

"use client"

import {
  BookOpenIcon,
  LayersIcon,
  PenLineIcon,
  RefreshCwIcon,
  ShoppingCartIcon,
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
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GroupSalesReport } from "@/domain/entities/group/GroupSalesReport"
import { GroupSalesHistoryFilters } from "@/presentation/components/groups/GroupSalesHistoryFilters"
import { formatGroupBookPrice } from "@/presentation/components/groups/groupDisplay"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  GroupBranchFilterOption,
  GroupSalesBranchFilter,
  GroupSalesFilterState,
} from "@/presentation/viewmodels/groups/GroupDetailViewModelState"

type GroupReportHistoryTabProps = {
  report: GroupSalesReport
  totalSales: number
  filters: GroupSalesFilterState
  branchFilterOptions: GroupBranchFilterOption[]
  showBranchFilter: boolean
  isLoading: boolean
  error: string | null
  onBranchFilterChange: (branchFilter: GroupSalesBranchFilter) => void
  onDateFromChange: (dateFrom: string | null) => void
  onDateToChange: (dateTo: string | null) => void
  onRetry: () => void
}

type BookReportColumnKey =
  | "title"
  | "author"
  | "translator"
  | "category"
  | "unitsSold"
  | "totalRevenue"
  | "saleCount"

type NamedReportColumnKey =
  | "name"
  | "bookCount"
  | "unitsSold"
  | "totalRevenue"
  | "saleCount"

function LoadingState() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export function GroupReportHistoryTab({
  report,
  totalSales,
  filters,
  branchFilterOptions,
  showBranchFilter,
  isLoading,
  error,
  onBranchFilterChange,
  onDateFromChange,
  onDateToChange,
  onRetry,
}: GroupReportHistoryTabProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <Card className="rounded-lg border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base">
            {t("groups.reports.loadError")}
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" onClick={onRetry}>
            <RefreshCwIcon />
            {t("common.retry")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (totalSales === 0) {
    return (
      <Card className="rounded-lg">
        <CardContent className="flex min-h-48 items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            {t("groups.reports.empty")}
          </p>
        </CardContent>
      </Card>
    )
  }

  const bookColumns: DataTableColumn<
    GroupSalesReport["books"][number],
    BookReportColumnKey
  >[] = [
    {
      key: "title",
      header: t("groups.reports.columns.book"),
      sortable: true,
      sortValue: (row) => row.title,
      cell: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      key: "author",
      header: t("groups.reports.columns.author"),
      sortable: true,
      sortValue: (row) => row.author,
      cell: (row) => row.author,
    },
    {
      key: "translator",
      header: t("groups.reports.columns.translator"),
      sortable: true,
      sortValue: (row) => row.translator ?? "",
      cell: (row) => row.translator ?? "—",
    },
    {
      key: "category",
      header: t("groups.reports.columns.category"),
      sortable: true,
      sortValue: (row) => row.category,
      cell: (row) => row.category,
    },
    {
      key: "unitsSold",
      header: t("groups.reports.columns.unitsSold"),
      sortable: true,
      sortValue: (row) => row.unitsSold,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.unitsSold.toLocaleString(locale),
    },
    {
      key: "totalRevenue",
      header: t("groups.reports.columns.revenue"),
      sortable: true,
      sortValue: (row) => row.totalRevenue,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => formatGroupBookPrice(row.totalRevenue, locale),
    },
    {
      key: "saleCount",
      header: t("groups.reports.columns.sales"),
      sortable: true,
      sortValue: (row) => row.saleCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.saleCount.toLocaleString(locale),
    },
  ]

  const authorColumns: DataTableColumn<
    GroupSalesReport["authors"][number],
    NamedReportColumnKey
  >[] = [
    {
      key: "name",
      header: t("groups.reports.columns.author"),
      sortable: true,
      sortValue: (row) => row.author,
      cell: (row) => <span className="font-medium">{row.author}</span>,
    },
    {
      key: "bookCount",
      header: t("groups.reports.columns.books"),
      sortable: true,
      sortValue: (row) => row.bookCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.bookCount.toLocaleString(locale),
    },
    {
      key: "unitsSold",
      header: t("groups.reports.columns.unitsSold"),
      sortable: true,
      sortValue: (row) => row.unitsSold,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.unitsSold.toLocaleString(locale),
    },
    {
      key: "totalRevenue",
      header: t("groups.reports.columns.revenue"),
      sortable: true,
      sortValue: (row) => row.totalRevenue,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => formatGroupBookPrice(row.totalRevenue, locale),
    },
    {
      key: "saleCount",
      header: t("groups.reports.columns.sales"),
      sortable: true,
      sortValue: (row) => row.saleCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.saleCount.toLocaleString(locale),
    },
  ]

  const translatorColumns: DataTableColumn<
    GroupSalesReport["translators"][number],
    NamedReportColumnKey
  >[] = [
    {
      key: "name",
      header: t("groups.reports.columns.translator"),
      sortable: true,
      sortValue: (row) => row.translator,
      cell: (row) => <span className="font-medium">{row.translator}</span>,
    },
    {
      key: "bookCount",
      header: t("groups.reports.columns.books"),
      sortable: true,
      sortValue: (row) => row.bookCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.bookCount.toLocaleString(locale),
    },
    {
      key: "unitsSold",
      header: t("groups.reports.columns.unitsSold"),
      sortable: true,
      sortValue: (row) => row.unitsSold,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.unitsSold.toLocaleString(locale),
    },
    {
      key: "totalRevenue",
      header: t("groups.reports.columns.revenue"),
      sortable: true,
      sortValue: (row) => row.totalRevenue,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => formatGroupBookPrice(row.totalRevenue, locale),
    },
    {
      key: "saleCount",
      header: t("groups.reports.columns.sales"),
      sortable: true,
      sortValue: (row) => row.saleCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.saleCount.toLocaleString(locale),
    },
  ]

  const categoryColumns: DataTableColumn<
    GroupSalesReport["categories"][number],
    NamedReportColumnKey
  >[] = [
    {
      key: "name",
      header: t("groups.reports.columns.category"),
      sortable: true,
      sortValue: (row) => row.category,
      cell: (row) => <span className="font-medium">{row.category}</span>,
    },
    {
      key: "bookCount",
      header: t("groups.reports.columns.books"),
      sortable: true,
      sortValue: (row) => row.bookCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.bookCount.toLocaleString(locale),
    },
    {
      key: "unitsSold",
      header: t("groups.reports.columns.unitsSold"),
      sortable: true,
      sortValue: (row) => row.unitsSold,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.unitsSold.toLocaleString(locale),
    },
    {
      key: "totalRevenue",
      header: t("groups.reports.columns.revenue"),
      sortable: true,
      sortValue: (row) => row.totalRevenue,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => formatGroupBookPrice(row.totalRevenue, locale),
    },
    {
      key: "saleCount",
      header: t("groups.reports.columns.sales"),
      sortable: true,
      sortValue: (row) => row.saleCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.saleCount.toLocaleString(locale),
    },
  ]

  const hasReportData = report.completedSaleCount > 0

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t("groups.filters.filters")}
          </CardTitle>
          <CardDescription>
            {t("groups.reports.filtersDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GroupSalesHistoryFilters
            branchFilter={filters.branchFilter}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            branchFilterOptions={branchFilterOptions}
            showBranchFilter={showBranchFilter}
            onBranchFilterChange={onBranchFilterChange}
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-lg">
          <CardContent className="flex items-center gap-4 py-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <ShoppingCartIcon className="size-4 text-muted-foreground" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("groups.reports.completedSales")}
              </p>
              <p className="text-xl font-semibold tabular-nums">
                {report.completedSaleCount.toLocaleString(locale)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="flex items-center gap-4 py-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <BookOpenIcon className="size-4 text-muted-foreground" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("groups.reports.unitsSold")}
              </p>
              <p className="text-xl font-semibold tabular-nums">
                {report.totalUnitsSold.toLocaleString(locale)}
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
              <p className="text-xs text-muted-foreground">
                {t("groups.reports.totalRevenue")}
              </p>
              <p className="text-xl font-semibold tabular-nums">
                {formatGroupBookPrice(report.totalRevenue, locale)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasReportData ? (
        <Card className="rounded-lg">
          <CardContent className="flex min-h-48 items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              {t("groups.reports.noCompletedSales")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="books">
              <BookOpenIcon className="size-4" />
              {t("groups.reports.tabs.books")} ({report.books.length})
            </TabsTrigger>
            <TabsTrigger value="authors">
              <PenLineIcon className="size-4" />
              {t("groups.reports.tabs.authors")} ({report.authors.length})
            </TabsTrigger>
            <TabsTrigger value="translators">
              {t("groups.reports.tabs.translators")} (
              {report.translators.length})
            </TabsTrigger>
            <TabsTrigger value="categories">
              {t("groups.reports.tabs.categories")} ({report.categories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {t("groups.reports.sections.books.title")}
                </CardTitle>
                <CardDescription>
                  {t("groups.reports.sections.books.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={report.books}
                  columns={bookColumns}
                  getRowId={(row) => row.bookId}
                  emptyTitle={t("groups.reports.sections.books.emptyTitle")}
                  emptyDescription={t(
                    "groups.reports.sections.books.emptyDescription"
                  )}
                  initialSort={{ key: "totalRevenue", direction: "desc" }}
                  initialPageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authors" className="mt-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {t("groups.reports.sections.authors.title")}
                </CardTitle>
                <CardDescription>
                  {t("groups.reports.sections.authors.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={report.authors}
                  columns={authorColumns}
                  getRowId={(row) => row.author}
                  emptyTitle={t("groups.reports.sections.authors.emptyTitle")}
                  emptyDescription={t(
                    "groups.reports.sections.authors.emptyDescription"
                  )}
                  initialSort={{ key: "totalRevenue", direction: "desc" }}
                  initialPageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="translators" className="mt-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {t("groups.reports.sections.translators.title")}
                </CardTitle>
                <CardDescription>
                  {t("groups.reports.sections.translators.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={report.translators}
                  columns={translatorColumns}
                  getRowId={(row) => row.translator}
                  emptyTitle={t(
                    "groups.reports.sections.translators.emptyTitle"
                  )}
                  emptyDescription={t(
                    "groups.reports.sections.translators.emptyDescription"
                  )}
                  initialSort={{ key: "totalRevenue", direction: "desc" }}
                  initialPageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {t("groups.reports.sections.categories.title")}
                </CardTitle>
                <CardDescription>
                  {t("groups.reports.sections.categories.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={report.categories}
                  columns={categoryColumns}
                  getRowId={(row) => row.category}
                  emptyTitle={t(
                    "groups.reports.sections.categories.emptyTitle"
                  )}
                  emptyDescription={t(
                    "groups.reports.sections.categories.emptyDescription"
                  )}
                  initialSort={{ key: "totalRevenue", direction: "desc" }}
                  initialPageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

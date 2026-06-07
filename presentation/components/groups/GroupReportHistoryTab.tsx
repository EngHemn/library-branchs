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
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GroupSalesReport } from "@/domain/entities/group/GroupSalesReport"
import { GroupSalesHistoryFilters } from "@/presentation/components/groups/GroupSalesHistoryFilters"
import { formatGroupBookPrice } from "@/presentation/components/groups/groupDisplay"
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
  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <Card className="rounded-lg border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base">Unable to load report history</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" onClick={onRetry}>
            <RefreshCwIcon />
            Retry
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
            No sales recorded for this group yet.
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
      header: "Book",
      sortable: true,
      sortValue: (row) => row.title,
      cell: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      sortValue: (row) => row.author,
      cell: (row) => row.author,
    },
    {
      key: "translator",
      header: "Translator",
      sortable: true,
      sortValue: (row) => row.translator ?? "",
      cell: (row) => row.translator ?? "—",
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      sortValue: (row) => row.category,
      cell: (row) => row.category,
    },
    {
      key: "unitsSold",
      header: "Units Sold",
      sortable: true,
      sortValue: (row) => row.unitsSold,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.unitsSold.toLocaleString(),
    },
    {
      key: "totalRevenue",
      header: "Revenue",
      sortable: true,
      sortValue: (row) => row.totalRevenue,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => formatGroupBookPrice(row.totalRevenue),
    },
    {
      key: "saleCount",
      header: "Sales",
      sortable: true,
      sortValue: (row) => row.saleCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.saleCount.toLocaleString(),
    },
  ]

  const authorColumns: DataTableColumn<
    GroupSalesReport["authors"][number],
    NamedReportColumnKey
  >[] = [
    {
      key: "name",
      header: "Author",
      sortable: true,
      sortValue: (row) => row.author,
      cell: (row) => <span className="font-medium">{row.author}</span>,
    },
    {
      key: "bookCount",
      header: "Books",
      sortable: true,
      sortValue: (row) => row.bookCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.bookCount.toLocaleString(),
    },
    {
      key: "unitsSold",
      header: "Units Sold",
      sortable: true,
      sortValue: (row) => row.unitsSold,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.unitsSold.toLocaleString(),
    },
    {
      key: "totalRevenue",
      header: "Revenue",
      sortable: true,
      sortValue: (row) => row.totalRevenue,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => formatGroupBookPrice(row.totalRevenue),
    },
    {
      key: "saleCount",
      header: "Sales",
      sortable: true,
      sortValue: (row) => row.saleCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.saleCount.toLocaleString(),
    },
  ]

  const translatorColumns: DataTableColumn<
    GroupSalesReport["translators"][number],
    NamedReportColumnKey
  >[] = [
    {
      key: "name",
      header: "Translator",
      sortable: true,
      sortValue: (row) => row.translator,
      cell: (row) => <span className="font-medium">{row.translator}</span>,
    },
    {
      key: "bookCount",
      header: "Books",
      sortable: true,
      sortValue: (row) => row.bookCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.bookCount.toLocaleString(),
    },
    {
      key: "unitsSold",
      header: "Units Sold",
      sortable: true,
      sortValue: (row) => row.unitsSold,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.unitsSold.toLocaleString(),
    },
    {
      key: "totalRevenue",
      header: "Revenue",
      sortable: true,
      sortValue: (row) => row.totalRevenue,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => formatGroupBookPrice(row.totalRevenue),
    },
    {
      key: "saleCount",
      header: "Sales",
      sortable: true,
      sortValue: (row) => row.saleCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.saleCount.toLocaleString(),
    },
  ]

  const categoryColumns: DataTableColumn<
    GroupSalesReport["categories"][number],
    NamedReportColumnKey
  >[] = [
    {
      key: "name",
      header: "Category",
      sortable: true,
      sortValue: (row) => row.category,
      cell: (row) => <span className="font-medium">{row.category}</span>,
    },
    {
      key: "bookCount",
      header: "Books",
      sortable: true,
      sortValue: (row) => row.bookCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.bookCount.toLocaleString(),
    },
    {
      key: "unitsSold",
      header: "Units Sold",
      sortable: true,
      sortValue: (row) => row.unitsSold,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.unitsSold.toLocaleString(),
    },
    {
      key: "totalRevenue",
      header: "Revenue",
      sortable: true,
      sortValue: (row) => row.totalRevenue,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => formatGroupBookPrice(row.totalRevenue),
    },
    {
      key: "saleCount",
      header: "Sales",
      sortable: true,
      sortValue: (row) => row.saleCount,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.saleCount.toLocaleString(),
    },
  ]

  const hasReportData = report.completedSaleCount > 0

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>
            Branch and date filters apply to all report sections.
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
              <p className="text-xs text-muted-foreground">Completed Sales</p>
              <p className="text-xl font-semibold tabular-nums">
                {report.completedSaleCount.toLocaleString()}
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
              <p className="text-xs text-muted-foreground">Units Sold</p>
              <p className="text-xl font-semibold tabular-nums">
                {report.totalUnitsSold.toLocaleString()}
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
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-semibold tabular-nums">
                {formatGroupBookPrice(report.totalRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasReportData ? (
        <Card className="rounded-lg">
          <CardContent className="flex min-h-48 items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              No completed sales match the current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="books">
              <BookOpenIcon className="size-4" />
              Books ({report.books.length})
            </TabsTrigger>
            <TabsTrigger value="authors">
              <PenLineIcon className="size-4" />
              Authors ({report.authors.length})
            </TabsTrigger>
            <TabsTrigger value="translators">
              Translators ({report.translators.length})
            </TabsTrigger>
            <TabsTrigger value="categories">
              Categories ({report.categories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Books</CardTitle>
                <CardDescription>
                  Selling performance grouped by book title.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={report.books}
                  columns={bookColumns}
                  getRowId={(row) => row.bookId}
                  emptyTitle="No book sales"
                  emptyDescription="No book sales match the current filters."
                  initialSort={{ key: "totalRevenue", direction: "desc" }}
                  initialPageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authors" className="mt-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Authors</CardTitle>
                <CardDescription>
                  Selling performance grouped by author.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={report.authors}
                  columns={authorColumns}
                  getRowId={(row) => row.author}
                  emptyTitle="No author sales"
                  emptyDescription="No author sales match the current filters."
                  initialSort={{ key: "totalRevenue", direction: "desc" }}
                  initialPageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="translators" className="mt-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Translators</CardTitle>
                <CardDescription>
                  Selling performance grouped by translator.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={report.translators}
                  columns={translatorColumns}
                  getRowId={(row) => row.translator}
                  emptyTitle="No translator sales"
                  emptyDescription="No translator sales match the current filters."
                  initialSort={{ key: "totalRevenue", direction: "desc" }}
                  initialPageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Categories</CardTitle>
                <CardDescription>
                  Selling performance grouped by category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={report.categories}
                  columns={categoryColumns}
                  getRowId={(row) => row.category}
                  emptyTitle="No category sales"
                  emptyDescription="No category sales match the current filters."
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

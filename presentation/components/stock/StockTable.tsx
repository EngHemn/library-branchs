"use client"

import {
  BookOpenIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PackageIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { StockRow } from "@/domain/entities/stock/Stock"
import { BookLink } from "@/presentation/components/shared/DashboardEntityLink"
import {
  StockRowActionsMenu,
  StockSubBranchesPanel,
} from "@/presentation/components/stock/StockSubBranchesPanel"
import { StockStatusBadge } from "@/presentation/components/stock/StockStatusBadge"
import {
  getParentStockRow,
  groupStockRows,
  hasSubBranches,
  type StockTableGroup,
} from "@/presentation/components/stock/stockTableGrouping"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type StockTableProps = {
  rows: StockRow[]
  isLoading: boolean
  expandedGroupIds: string[]
  onToggleGroupExpanded: (groupId: string) => void
  onAddStock: (row: StockRow) => void
  onReduceStock: (row: StockRow) => void
  onTransfer: (row: StockRow) => void
  onEditStock: (row: StockRow) => void
  showSubBranchColumn: boolean
  showStockGroupAccordion: boolean
}

type StockColumnKey =
  | "expand"
  | "book"
  | "category"
  | "subBranch"
  | "currentStock"
  | "reservedStock"
  | "availableStock"
  | "minStock"
  | "status"
  | "actions"

function StockTableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full rounded-lg" />
      ))}
    </div>
  )
}

function SubBranchCell({ group }: { group: StockTableGroup }) {
  const { t } = useTranslation()

  if (!hasSubBranches(group)) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const count = group.subBranchRows.length
  const labelKey =
    count === 1
      ? "stock.table.subBranchCount"
      : "stock.table.subBranchCountPlural"

  return <Badge variant="secondary">{t(labelKey, { count })}</Badge>
}

export function StockTable({
  rows,
  isLoading,
  expandedGroupIds,
  onToggleGroupExpanded,
  onAddStock,
  onReduceStock,
  onTransfer,
  onEditStock,
  showSubBranchColumn,
  showStockGroupAccordion,
}: StockTableProps) {
  const { t } = useTranslation()
  const groups = groupStockRows(rows)

  const allColumns: DataTableColumn<StockTableGroup, StockColumnKey>[] = [
    {
      key: "expand",
      header: "",
      className: "w-10",
      headerClassName: "w-10",
      cell: (group) => {
        const expandable = showStockGroupAccordion && hasSubBranches(group)
        const isExpanded = expandedGroupIds.includes(group.id)

        if (!expandable) {
          return <span className="inline-block w-8" aria-hidden />
        }

        return (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onToggleGroupExpanded(group.id)}
            aria-label={
              isExpanded
                ? t("stock.table.collapseSubBranches", {
                    title: group.bookTitle,
                  })
                : t("stock.table.expandSubBranches", { title: group.bookTitle })
            }
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </Button>
        )
      },
    },
    {
      key: "book",
      header: t("stock.table.book"),
      sortable: true,
      sortValue: (group) => group.bookTitle,
      cell: (group) => {
        const display = getParentStockRow(group)

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
              {display.bookCoverUrl ? (
                <img
                  src={display.bookCoverUrl}
                  alt={display.bookTitle}
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <BookLink
                bookId={group.bookId}
                title={group.bookTitle}
                className="block max-w-[160px] truncate text-sm"
              />
              <p className="text-xs text-muted-foreground">{group.isbn}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "category",
      header: t("stock.table.category"),
      sortable: true,
      sortValue: (group) => group.category,
      cell: (group) => (
        <Badge variant="secondary" className="text-xs">
          {group.category}
        </Badge>
      ),
    },
    {
      key: "subBranch",
      header: t("stock.table.subBranch"),
      cell: (group) => <SubBranchCell group={group} />,
    },
    {
      key: "currentStock",
      header: t("stock.table.current"),
      sortable: true,
      sortValue: (group) => getParentStockRow(group).currentStock,
      headerClassName: "text-right",
      className: "text-right tabular-nums font-semibold",
      cell: (group) => getParentStockRow(group).currentStock.toLocaleString(),
    },
    {
      key: "reservedStock",
      header: t("stock.table.reserved"),
      sortable: true,
      sortValue: (group) => getParentStockRow(group).reservedStock,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (group) => getParentStockRow(group).reservedStock.toLocaleString(),
    },
    {
      key: "availableStock",
      header: t("stock.table.available"),
      sortable: true,
      sortValue: (group) => getParentStockRow(group).availableStock,
      headerClassName: "text-right",
      className: "text-right tabular-nums font-bold",
      cell: (group) => getParentStockRow(group).availableStock.toLocaleString(),
    },
    {
      key: "minStock",
      header: t("stock.table.minAlert"),
      sortable: true,
      sortValue: (group) => getParentStockRow(group).minStock,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (group) => getParentStockRow(group).minStock.toLocaleString(),
    },
    {
      key: "status",
      header: t("stock.table.status"),
      sortable: true,
      sortValue: (group) => getParentStockRow(group).status,
      cell: (group) => (
        <StockStatusBadge status={getParentStockRow(group).status} />
      ),
    },
    {
      key: "actions",
      header: t("stock.table.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (group) => {
        const actionRow = group.mainRow ?? group.subBranchRows[0]

        if (!actionRow) {
          return null
        }

        return (
          <StockRowActionsMenu
            row={actionRow}
            onAddStock={onAddStock}
            onReduceStock={onReduceStock}
            onTransfer={onTransfer}
            onEditStock={onEditStock}
          />
        )
      },
    },
  ]

  const hiddenColumnKeys = new Set<StockColumnKey>()
  if (!showStockGroupAccordion) {
    hiddenColumnKeys.add("expand")
  }
  if (!showSubBranchColumn) {
    hiddenColumnKeys.add("subBranch")
  }

  const columns = allColumns.filter(
    (column) => !hiddenColumnKeys.has(column.key)
  )

  if (isLoading) {
    return (
      <Card className="rounded-lg">
        <StockTableSkeleton />
      </Card>
    )
  }

  if (!isLoading && rows.length === 0) {
    return (
      <Card className="rounded-lg">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-3 rounded-full bg-muted p-4">
            <PackageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold">
            {t("stock.table.emptyTitle")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("stock.table.emptyDescription")}
          </p>
        </div>
      </Card>
    )
  }

  const cardDescription = showStockGroupAccordion
    ? t(
        groups.length === 1
          ? "stock.table.recordCountLocations"
          : "stock.table.recordCountLocationsPlural",
        { count: groups.length.toLocaleString() }
      )
    : t(
        groups.length === 1
          ? "stock.table.recordCount"
          : "stock.table.recordCountPlural",
        { count: groups.length.toLocaleString() }
      )

  return (
    <TooltipProvider>
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>{t("stock.table.title")}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={groups}
            columns={columns}
            getRowId={(group) => group.id}
            emptyTitle={t("stock.table.emptyTitle")}
            emptyDescription={t("stock.table.emptyDescription")}
            initialSort={{ key: "book", direction: "asc" }}
            initialPageSize={10}
            pageSizeOptions={[10, 20, 50]}
            tableClassName="min-w-[900px]"
            isRowExpanded={
              showStockGroupAccordion
                ? (group) =>
                    hasSubBranches(group) && expandedGroupIds.includes(group.id)
                : undefined
            }
            renderExpandedRow={
              showStockGroupAccordion
                ? (group) => (
                    <StockSubBranchesPanel
                      bookTitle={group.bookTitle}
                      branchName={group.branchName}
                      subBranchRows={group.subBranchRows}
                      onAddStock={onAddStock}
                      onReduceStock={onReduceStock}
                      onTransfer={onTransfer}
                      onEditStock={onEditStock}
                    />
                  )
                : undefined
            }
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

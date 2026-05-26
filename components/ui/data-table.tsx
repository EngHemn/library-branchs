"use client"

import * as React from "react"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type DataTableSortDirection = "asc" | "desc"

export type DataTableSortValue = string | number | null

export type DataTableColumn<TItem, TColumnKey extends string> = {
  key: TColumnKey
  header: string
  cell: (item: TItem) => React.ReactNode
  sortable?: boolean
  sortValue?: (item: TItem) => DataTableSortValue
  className?: string
  headerClassName?: string
}

type DataTableInitialSort<TColumnKey extends string> = {
  key: TColumnKey
  direction: DataTableSortDirection
}

type DataTableProps<TItem, TColumnKey extends string> = {
  data: TItem[]
  columns: DataTableColumn<TItem, TColumnKey>[]
  getRowId: (item: TItem) => string
  emptyTitle: string
  emptyDescription: string
  initialSort?: DataTableInitialSort<TColumnKey>
  initialPageSize?: number
  pageSizeOptions?: number[]
  tableClassName?: string
  isRowExpanded?: (item: TItem) => boolean
  renderExpandedRow?: (item: TItem) => React.ReactNode
}

const defaultPageSizeOptions = [5, 10, 20]
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
})

function compareSortValues(
  firstValue: DataTableSortValue,
  secondValue: DataTableSortValue
): number {
  if (typeof firstValue === "number" && typeof secondValue === "number") {
    return firstValue - secondValue
  }

  return collator.compare(String(firstValue ?? ""), String(secondValue ?? ""))
}

function SortIcon({
  isActive,
  direction,
}: {
  isActive: boolean
  direction: DataTableSortDirection
}) {
  if (!isActive) {
    return <ArrowUpDownIcon className="text-muted-foreground" />
  }

  if (direction === "asc") {
    return <ArrowUpIcon />
  }

  return <ArrowDownIcon />
}

function isPageSizeOption(value: string, options: number[]): number | null {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue)) {
    return null
  }

  return options.includes(parsedValue) ? parsedValue : null
}

export function DataTable<TItem, TColumnKey extends string>({
  data,
  columns,
  getRowId,
  emptyTitle,
  emptyDescription,
  initialSort,
  initialPageSize = 10,
  pageSizeOptions = defaultPageSizeOptions,
  tableClassName,
  isRowExpanded,
  renderExpandedRow,
}: DataTableProps<TItem, TColumnKey>) {
  const [sortKey, setSortKey] = React.useState<TColumnKey | null>(
    initialSort?.key ?? null
  )
  const [sortDirection, setSortDirection] =
    React.useState<DataTableSortDirection>(initialSort?.direction ?? "asc")
  const [pageSize, setPageSize] = React.useState<number>(initialPageSize)
  const [pageIndex, setPageIndex] = React.useState<number>(0)

  const sortedData = React.useMemo(() => {
    if (!sortKey) {
      return data
    }

    const sortedColumn = columns.find((column) => column.key === sortKey)

    if (!sortedColumn?.sortable || !sortedColumn.sortValue) {
      return data
    }

    const sortValue = sortedColumn.sortValue

    return [...data].sort((firstItem, secondItem) => {
      const comparison = compareSortValues(
        sortValue(firstItem),
        sortValue(secondItem)
      )

      return sortDirection === "asc" ? comparison : comparison * -1
    })
  }, [columns, data, sortDirection, sortKey])

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const currentPageIndex = Math.min(pageIndex, pageCount - 1)
  const startIndex = currentPageIndex * pageSize
  const endIndex = Math.min(startIndex + pageSize, sortedData.length)
  const visibleData = sortedData.slice(startIndex, endIndex)
  const firstVisibleRecord = sortedData.length === 0 ? 0 : startIndex + 1

  const handleSort = (column: DataTableColumn<TItem, TColumnKey>): void => {
    if (!column.sortable || !column.sortValue) {
      return
    }

    if (sortKey === column.key) {
      setSortDirection((currentDirection) =>
        currentDirection === "asc" ? "desc" : "asc"
      )
      setPageIndex(0)
      return
    }

    setSortKey(column.key)
    setSortDirection("asc")
    setPageIndex(0)
  }

  const handlePageSizeChange = (value: string): void => {
    const nextPageSize = isPageSizeOption(value, pageSizeOptions)

    if (nextPageSize) {
      setPageSize(nextPageSize)
      setPageIndex(0)
    }
  }

  if (data.length === 0) {
    return (
      <Empty className="min-h-64 rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-3">
      <Table className={cn("min-w-full", tableClassName)}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const isActiveSort = sortKey === column.key

              return (
                <TableHead
                  key={column.key}
                  className={column.headerClassName}
                  aria-sort={
                    isActiveSort
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  {column.sortable && column.sortValue ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-2 h-7 px-2 font-medium"
                      onClick={() => handleSort(column)}
                      aria-label={`Sort by ${column.header}`}
                    >
                      {column.header}
                      <SortIcon
                        isActive={isActiveSort}
                        direction={sortDirection}
                      />
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleData.map((item) => {
            const rowId = getRowId(item)
            const isExpanded = isRowExpanded?.(item) ?? false

            return (
              <React.Fragment key={rowId}>
                <TableRow aria-expanded={isExpanded}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
                {isExpanded && renderExpandedRow ? (
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableCell
                      colSpan={columns.length}
                      className="whitespace-normal p-3"
                    >
                      {renderExpandedRow(item)}
                    </TableCell>
                  </TableRow>
                ) : null}
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {firstVisibleRecord}-{endIndex} of {sortedData.length}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger
              size="sm"
              className="w-[120px]"
              aria-label="Rows per page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
              Previous
            </Button>
            <span className="px-2 text-sm text-muted-foreground">
              Page {currentPageIndex + 1} of {pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setPageIndex(Math.min(pageCount - 1, currentPageIndex + 1))
              }
              disabled={currentPageIndex >= pageCount - 1}
              aria-label="Next page"
            >
              Next
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

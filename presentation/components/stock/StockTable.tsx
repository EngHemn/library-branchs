"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ArrowRightLeft,
  BookOpenIcon,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  HistoryIcon,
  MinusIcon,
  MoreHorizontal,
  PackageIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StockStatusBadge } from "./StockStatusBadge"
import type { StockRow } from "@/domain/entities/stock/Stock"

type StockTableProps = {
  rows: StockRow[]
  isLoading: boolean
  onAddStock: (row: StockRow) => void
  onReduceStock: (row: StockRow) => void
  onTransfer: (row: StockRow) => void
  onViewHistory: (row: StockRow) => void
  onEditStock: (row: StockRow) => void
}

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc") return <ChevronUp className="ml-1 h-3.5 w-3.5" />
  if (direction === "desc") return <ChevronDown className="ml-1 h-3.5 w-3.5" />
  return <ChevronsUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
}

function StockTableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function StockTable({
  rows,
  isLoading,
  onAddStock,
  onReduceStock,
  onTransfer,
  onViewHistory,
  onEditStock,
}: StockTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const columns = useMemo<ColumnDef<StockRow>[]>(
    () => [
      {
        accessorKey: "bookTitle",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-medium hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Book
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
              {row.original.bookCoverUrl ? (
                <img
                  src={row.original.bookCoverUrl}
                  alt={row.original.bookTitle}
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="max-w-[160px] truncate text-sm font-medium text-slate-900">
                {row.original.bookTitle}
              </p>
              <p className="text-xs text-slate-400">{row.original.isbn}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-xs">
            {row.original.category}
          </Badge>
        ),
      },
      {
        accessorKey: "branchName",
        header: "Main Branch",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.branchName}</span>
        ),
      },
      {
        accessorKey: "subBranchName",
        header: "Sub Branch",
        cell: ({ row }) =>
          row.original.subBranchName ? (
            <span className="text-sm">{row.original.subBranchName}</span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "currentStock",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-medium hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Current
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.currentStock}</span>
        ),
      },
      {
        accessorKey: "reservedStock",
        header: "Reserved",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.reservedStock}</span>
        ),
      },
      {
        accessorKey: "availableStock",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-medium hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Available
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-bold">{row.original.availableStock}</span>
        ),
      },
      {
        accessorKey: "minStock",
        header: "Min Alert",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.minStock}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StockStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Stock Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAddStock(row.original)}>
                <PlusIcon className="mr-2 h-4 w-4 text-emerald-600" />
                Add Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReduceStock(row.original)}>
                <MinusIcon className="mr-2 h-4 w-4 text-orange-500" />
                Reduce Stock
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onTransfer(row.original)}>
                <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600" />
                Transfer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewHistory(row.original)}>
                <HistoryIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                View History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditStock(row.original)}>
                <PencilIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                Edit Stock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onAddStock, onReduceStock, onTransfer, onViewHistory, onEditStock]
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

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
          <p className="text-base font-semibold">No inventory found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting the filters or add new stock.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="rounded-lg overflow-hidden">
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          –
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} records
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  )
}

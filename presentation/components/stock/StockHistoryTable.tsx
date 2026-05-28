"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EyeIcon,
  History,
  ListFilterIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { MovementBadge } from "./MovementBadge"
import type { StockMovement, MovementType } from "@/domain/entities/stock/StockMovement"

const MOVEMENT_TYPES: { value: MovementType; label: string }[] = [
  { value: "stock_added", label: "Stock Added" },
  { value: "stock_reduced", label: "Stock Reduced" },
  { value: "transfer", label: "Transfer" },
  { value: "sale", label: "Sale" },
  { value: "return", label: "Return" },
  { value: "damage", label: "Damage" },
  { value: "manual_adjustment", label: "Manual Adjustment" },
]

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc") return <ChevronUp className="ml-1 h-3.5 w-3.5" />
  if (direction === "desc") return <ChevronDown className="ml-1 h-3.5 w-3.5" />
  return <ChevronsUpDown className="ml-1 h-3.5 w-3.5 opacity-100" />
}

type StockHistoryTableProps = {
  movements: StockMovement[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (q: string) => void
  typeFilter: MovementType | null
  onTypeFilterChange: (t: MovementType | null) => void
  branchFilter: string | null
  onBranchFilterChange: (id: string | null) => void
  dateFrom: string | null
  onDateFromChange: (d: string | null) => void
  dateTo: string | null
  onDateToChange: (d: string | null) => void
  userFilter: string | null
  onUserFilterChange: (u: string | null) => void
  availableBranches: { id: string; name: string }[]
  availableUsers: string[]
}

function HistoryTableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function StockHistoryTable({
  movements,
  isLoading,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  branchFilter,
  onBranchFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  userFilter,
  onUserFilterChange,
  availableBranches,
  availableUsers,
}: StockHistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState("")
  const [selectedNoteBookTitle, setSelectedNoteBookTitle] = useState("")
  const [draftTypeFilter, setDraftTypeFilter] = useState<MovementType | null>(
    typeFilter
  )
  const [draftBranchFilter, setDraftBranchFilter] = useState<string | null>(
    branchFilter
  )
  const [draftDateFrom, setDraftDateFrom] = useState<string | null>(dateFrom)
  const [draftDateTo, setDraftDateTo] = useState<string | null>(dateTo)
  const [draftUserFilter, setDraftUserFilter] = useState<string | null>(userFilter)

  const activeFilterCount = [
    typeFilter,
    branchFilter,
    dateFrom,
    dateTo,
    userFilter,
  ].filter(Boolean).length
  const selectedMovementType = MOVEMENT_TYPES.find((item) => item.value === typeFilter)
  const selectedBranch = availableBranches.find((branch) => branch.id === branchFilter)
  const activeFilterChips: Array<{
    key: string
    label: string
    onRemove: () => void
  }> = []
  if (selectedMovementType) {
    activeFilterChips.push({
      key: `type-${selectedMovementType.value}`,
      label: `Type: ${selectedMovementType.label}`,
      onRemove: () => onTypeFilterChange(null),
    })
  }
  if (selectedBranch) {
    activeFilterChips.push({
      key: `branch-${selectedBranch.id}`,
      label: `Branch: ${selectedBranch.name}`,
      onRemove: () => onBranchFilterChange(null),
    })
  }
  if (userFilter) {
    activeFilterChips.push({
      key: `user-${userFilter}`,
      label: `User: ${userFilter}`,
      onRemove: () => onUserFilterChange(null),
    })
  }
  if (dateFrom) {
    activeFilterChips.push({
      key: `from-${dateFrom}`,
      label: `From: ${dateFrom}`,
      onRemove: () => onDateFromChange(null),
    })
  }
  if (dateTo) {
    activeFilterChips.push({
      key: `to-${dateTo}`,
      label: `To: ${dateTo}`,
      onRemove: () => onDateToChange(null),
    })
  }

  useEffect(() => {
    if (isFilterDialogOpen) {
      setDraftTypeFilter(typeFilter)
      setDraftBranchFilter(branchFilter)
      setDraftDateFrom(dateFrom)
      setDraftDateTo(dateTo)
      setDraftUserFilter(userFilter)
    }
  }, [
    isFilterDialogOpen,
    typeFilter,
    branchFilter,
    dateFrom,
    dateTo,
    userFilter,
  ])

  function applyFilters() {
    onTypeFilterChange(draftTypeFilter)
    onBranchFilterChange(draftBranchFilter)
    onDateFromChange(draftDateFrom)
    onDateToChange(draftDateTo)
    onUserFilterChange(draftUserFilter)
    setIsFilterDialogOpen(false)
  }

  function clearDraftFilters() {
    setDraftTypeFilter(null)
    setDraftBranchFilter(null)
    setDraftDateFrom(null)
    setDraftDateTo(null)
    setDraftUserFilter(null)
  }

  function clearFilters() {
    onSearchChange("")
    onTypeFilterChange(null)
    onBranchFilterChange(null)
    onDateFromChange(null)
    onDateToChange(null)
    onUserFilterChange(null)
  }

  function openNoteDialog(bookTitle: string, notes: string | null) {
    setSelectedNoteBookTitle(bookTitle)
    setSelectedNote(notes?.trim() ? notes : "No notes available for this movement.")
    setIsNoteDialogOpen(true)
  }

  const columns = useMemo<ColumnDef<StockMovement>[]>(
    () => [
      {
        accessorKey: "movementType",
        header: "Type",
        cell: ({ row }) => <MovementBadge type={row.original.movementType} />,
      },
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
          <span className="text-sm font-medium">{row.original.bookTitle}</span>
        ),
      },
      {
        accessorKey: "fromBranchName",
        header: "From Branch",
        cell: ({ row }) =>
          row.original.fromBranchName ? (
            <span className="text-sm">{row.original.fromBranchName}</span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "toBranchName",
        header: "To Branch",
        cell: ({ row }) =>
          row.original.toBranchName ? (
            <span className="text-sm">{row.original.toBranchName}</span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-medium hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Qty
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.quantity}</span>
        ),
      },
      {
        accessorKey: "previousStock",
        header: "Prev Stock",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.previousStock}</span>
        ),
      },
      {
        accessorKey: "newStock",
        header: "New Stock",
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.newStock}</span>
        ),
      },
      {
        accessorKey: "userName",
        header: "User",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.userName}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-medium hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date & Time
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-sm">
            <p>
              {new Date(row.original.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(row.original.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => openNoteDialog(row.original.bookTitle, row.original.notes)}
            aria-label={`View note for ${row.original.bookTitle}`}
            title="View note"
          >
            <EyeIcon className="size-4" />
          </Button>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: movements,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="space-y-4">
      <Card className="rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative sm:w-full sm:max-w-md">
                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="history-search"
                  placeholder="Search by title..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
                  <ListFilterIcon />
                  Filters
                  {activeFilterCount > 0 ? (
                    <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  disabled={activeFilterCount === 0 && searchQuery === ""}
                >
                  <RotateCcwIcon />
                  Reset
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.length > 0 ? (
                activeFilterChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {chip.label}
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="rounded-full p-0.5 hover:bg-primary/20"
                      aria-label={`Remove ${chip.label} filter`}
                    >
                      <XIcon className="size-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  All
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:min-w-[600px]">
          <DialogHeader>
            <DialogTitle>Filter Movement History</DialogTitle>
            <DialogDescription>
              Select filters and click Apply to update the movement table.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="movement-type-filter">Movement Type</Label>
                <Select
                  value={draftTypeFilter ?? "all"}
                  onValueChange={(value) =>
                    setDraftTypeFilter(
                      value === "all" ? null : (value as MovementType)
                    )
                  }
                >
                  <SelectTrigger id="movement-type-filter" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {MOVEMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="history-branch-filter">Branch</Label>
                <Select
                  value={draftBranchFilter ?? "all"}
                  onValueChange={(value) =>
                    setDraftBranchFilter(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger id="history-branch-filter" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {availableBranches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="history-user-filter">User</Label>
                <Select
                  value={draftUserFilter ?? "all"}
                  onValueChange={(value) =>
                    setDraftUserFilter(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger id="history-user-filter" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {availableUsers.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-from">From Date</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={draftDateFrom ?? ""}
                  onChange={(e) => setDraftDateFrom(e.target.value || null)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-to">To Date</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={draftDateTo ?? ""}
                  onChange={(e) => setDraftDateTo(e.target.value || null)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={clearDraftFilters}>
              Clear
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsFilterDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={applyFilters}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Movement Note</DialogTitle>
            <DialogDescription>{selectedNoteBookTitle}</DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap">
            {selectedNote}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsNoteDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="rounded-lg overflow-hidden">
        {isLoading ? (
          <HistoryTableSkeleton />
        ) : movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-3 rounded-full bg-muted p-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold">No stock movements yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Stock operations will appear here.
            </p>
          </div>
        ) : (
          <>
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Separator />
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
                  movements.length
                )}{" "}
                of {movements.length} records
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
          </>
        )}
      </Card>
    </div>
  )
}

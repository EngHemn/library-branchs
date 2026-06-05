"use client"

import {
  ArrowRightLeft,
  MinusIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react"
import { IoSettingsOutline } from "react-icons/io5"

import { Button } from "@/components/ui/button"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { StockRow } from "@/domain/entities/stock/Stock"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import { StockStatusBadge } from "@/presentation/components/stock/StockStatusBadge"

type StockSubBranchesPanelProps = {
  bookTitle: string
  branchName: string
  subBranchRows: StockRow[]
  onAddStock: (row: StockRow) => void
  onReduceStock: (row: StockRow) => void
  onTransfer: (row: StockRow) => void
  onEditStock: (row: StockRow) => void
}

type SubBranchColumnKey =
  | "subBranchName"
  | "currentStock"
  | "reservedStock"
  | "availableStock"
  | "minStock"
  | "status"
  | "actions"

export function StockRowActionsMenu({
  row,
  onAddStock,
  onReduceStock,
  onTransfer,
  onEditStock,
}: {
  row: StockRow
  onAddStock: (row: StockRow) => void
  onReduceStock: (row: StockRow) => void
  onTransfer: (row: StockRow) => void
  onEditStock: (row: StockRow) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Stock actions"
        >
          <IoSettingsOutline className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Stock Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddStock(row)}>
          <PlusIcon className="mr-2 h-4 w-4 text-emerald-600" />
          Add Stock
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReduceStock(row)}>
          <MinusIcon className="mr-2 h-4 w-4 text-orange-500" />
          Reduce Stock
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onTransfer(row)}>
          <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600" />
          Transfer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEditStock(row)}>
          <PencilIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          Edit Stock
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function StockSubBranchesPanel({
  bookTitle,
  branchName,
  subBranchRows,
  onAddStock,
  onReduceStock,
  onTransfer,
  onEditStock,
}: StockSubBranchesPanelProps) {
  const columns: DataTableColumn<StockRow, SubBranchColumnKey>[] = [
    {
      key: "subBranchName",
      header: "Sub Branch",
      sortable: true,
      sortValue: (row) => row.subBranchName ?? "",
      cell: (row) =>
        row.subBranchId && row.subBranchName ? (
          <BranchLink
            branchId={row.subBranchId}
            branchName={row.subBranchName}
            className="block max-w-[160px] truncate text-sm"
          />
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      key: "currentStock",
      header: "Current",
      sortable: true,
      sortValue: (row) => row.currentStock,
      headerClassName: "text-right",
      className: "text-right tabular-nums font-semibold",
      cell: (row) => row.currentStock.toLocaleString(),
    },
    {
      key: "reservedStock",
      header: "Reserved",
      sortable: true,
      sortValue: (row) => row.reservedStock,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.reservedStock.toLocaleString(),
    },
    {
      key: "availableStock",
      header: "Available",
      sortable: true,
      sortValue: (row) => row.availableStock,
      headerClassName: "text-right",
      className: "text-right tabular-nums font-bold",
      cell: (row) => row.availableStock.toLocaleString(),
    },
    {
      key: "minStock",
      header: "Min Alert",
      sortable: true,
      sortValue: (row) => row.minStock,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (row) => row.minStock.toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      cell: (row) => <StockStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => (
        <StockRowActionsMenu
          row={row}
          onAddStock={onAddStock}
          onReduceStock={onReduceStock}
          onTransfer={onTransfer}
          onEditStock={onEditStock}
        />
      ),
    },
  ]

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-background p-3">
        <div className="mb-3 text-xs font-medium tracking-normal text-muted-foreground uppercase">
          Sub branches for {bookTitle} at {branchName} ({subBranchRows.length})
        </div>
        <DataTable
          data={subBranchRows}
          columns={columns}
          getRowId={(row) => row.id}
          emptyTitle="No sub branch stock"
          emptyDescription="This location has no sub branch inventory yet."
          initialSort={{ key: "subBranchName", direction: "asc" }}
          initialPageSize={5}
          pageSizeOptions={[5, 10, 20]}
          tableClassName="min-w-[720px]"
        />
      </div>
    </TooltipProvider>
  )
}

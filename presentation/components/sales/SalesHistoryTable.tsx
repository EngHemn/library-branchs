"use client"

import { useMemo, useState } from "react"
import { EyeIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { SaleStatus } from "@/domain/entities/sales/SaleStatus"

type SalesHistoryTableProps = {
  sales: Sale[]
  showBranchColumn?: boolean
}

type SalesHistoryColumnKey =
  | "id"
  | "createdAt"
  | "branchName"
  | "books"
  | "subtotal"
  | "discountAmount"
  | "total"
  | "status"
  | "actions"

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`
}

function formatSaleDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatSaleTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function saleDateSortValue(value: string): number {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

function countBooks(sale: Sale): number {
  return sale.items.reduce((sum, item) => sum + item.quantity, 0)
}

function getStatusBadgeVariant(
  status: SaleStatus
): "default" | "secondary" | "destructive" {
  if (status === "voided") {
    return "destructive"
  }

  return "secondary"
}

function getStatusLabel(status: SaleStatus): string {
  return status === "voided" ? "Voided" : "Completed"
}

export function SalesHistoryTable({
  sales,
  showBranchColumn = true,
}: SalesHistoryTableProps) {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  const columns = useMemo(() => {
    const allColumns: DataTableColumn<Sale, SalesHistoryColumnKey>[] = [
      {
        key: "id",
        header: "Sale ID",
        sortable: true,
        sortValue: (sale) => sale.id,
        cell: (sale) => <span className="font-mono text-xs">{sale.id}</span>,
      },
      {
        key: "createdAt",
        header: "Date & Time",
        sortable: true,
        sortValue: (sale) => saleDateSortValue(sale.createdAt),
        cell: (sale) => (
          <div className="text-sm">
            <p className="font-medium">{formatSaleDate(sale.createdAt)}</p>
            <p className="text-xs text-muted-foreground">
              {formatSaleTime(sale.createdAt)}
            </p>
          </div>
        ),
      },
      {
        key: "branchName",
        header: "Branch",
        sortable: true,
        sortValue: (sale) => sale.branchName,
        cell: (sale) => sale.branchName,
      },
      {
        key: "books",
        header: "Books",
        sortable: true,
        sortValue: (sale) => countBooks(sale),
        cell: (sale) => <span className="text-right">{countBooks(sale)}</span>,
        headerClassName: "text-right",
        className: "text-right",
      },
      {
        key: "subtotal",
        header: "Subtotal",
        sortable: true,
        sortValue: (sale) => sale.subtotal,
        cell: (sale) => formatCurrency(sale.subtotal),
        headerClassName: "text-right",
        className: "text-right",
      },
      {
        key: "discountAmount",
        header: "Discount",
        sortable: true,
        sortValue: (sale) => sale.discountAmount,
        cell: (sale) => formatCurrency(sale.discountAmount),
        headerClassName: "text-right",
        className: "text-right",
      },
      {
        key: "total",
        header: "Total",
        sortable: true,
        sortValue: (sale) => sale.total,
        cell: (sale) => (
          <span className="font-semibold">{formatCurrency(sale.total)}</span>
        ),
        headerClassName: "text-right",
        className: "text-right",
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        sortValue: (sale) => sale.status,
        cell: (sale) => (
          <Badge variant={getStatusBadgeVariant(sale.status)}>
            {getStatusLabel(sale.status)}
          </Badge>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        headerClassName: "text-right",
        className: "text-right",
        cell: (sale) => (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setSelectedSale(sale)}
          >
            <EyeIcon className="size-4" />
            View
          </Button>
        ),
      },
    ]

    return showBranchColumn
      ? allColumns
      : allColumns.filter((column) => column.key !== "branchName")
  }, [showBranchColumn])

  return (
    <>
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>{sales.length.toLocaleString()} sale records</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={sales}
            columns={columns}
            getRowId={(sale) => sale.id}
            emptyTitle="No sales found"
            emptyDescription="No sales match the current filters."
            initialSort={{ key: "createdAt", direction: "desc" }}
            initialPageSize={10}
          />
        </CardContent>
      </Card>

      <Sheet
        open={selectedSale !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedSale(null)
          }
        }}
      >
        <SheetContent className="w-full p-0 sm:min-w-2/5">
          <SheetHeader className="border-b">
            <SheetTitle>{selectedSale?.id ?? "Sale Details"}</SheetTitle>
            <SheetDescription>
              {selectedSale
                ? `${selectedSale.branchName} · ${formatSaleDate(selectedSale.createdAt)} at ${formatSaleTime(selectedSale.createdAt)}`
                : "Sale details"}
            </SheetDescription>
          </SheetHeader>

          {selectedSale ? (
            <div className="space-y-4 p-4">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(selectedSale.status)}>
                  {getStatusLabel(selectedSale.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Card className="rounded-lg">
                  <CardContent className="space-y-1 p-3">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedSale.subtotal)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-lg">
                  <CardContent className="space-y-1 p-3">
                    <p className="text-muted-foreground">Discount</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedSale.discountAmount)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="col-span-2 rounded-lg">
                  <CardContent className="space-y-1 p-3">
                    <p className="text-muted-foreground">Total</p>
                    <p className="text-base font-semibold">
                      {formatCurrency(selectedSale.total)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSale.items.map((item) => (
                    <TableRow key={`${selectedSale.id}-${item.book.id}`}>
                      <TableCell className="max-w-[220px] truncate">
                        {item.book.title}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.book.price)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.book.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  )
}

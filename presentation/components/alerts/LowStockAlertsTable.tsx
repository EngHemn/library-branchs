"use client"

import { useState } from "react"
import { BookOpenIcon, CheckIcon, EyeIcon, PackagePlusIcon } from "lucide-react"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EntityImage } from "@/components/ui/entity-image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { LowStockAlert } from "@/domain/entities/alert/LowStockAlert"
import { LowStockAlertStatusBadge } from "@/presentation/components/alerts/LowStockAlertStatusBadge"
import { NeedActionButton } from "@/presentation/components/needs/NeedActionButton"

type LowStockAlertsTableProps = {
  alerts: LowStockAlert[]
  showBranchColumn?: boolean
  onViewBook: (alert: LowStockAlert) => void
  onRestock: (alert: LowStockAlert, quantity: number) => Promise<void>
  onMarkResolved: (alert: LowStockAlert) => void
}

type AlertColumnKey =
  | "bookCover"
  | "bookTitle"
  | "isbn"
  | "branchName"
  | "currentStock"
  | "minimumStock"
  | "shortageQuantity"
  | "status"
  | "actions"

export function LowStockAlertsTable({
  alerts,
  showBranchColumn = true,
  onViewBook,
  onRestock,
  onMarkResolved,
}: LowStockAlertsTableProps) {
  const [restockAlert, setRestockAlert] = useState<LowStockAlert | null>(null)
  const [restockQuantity, setRestockQuantity] = useState("10")
  const [isRestocking, setIsRestocking] = useState(false)

  async function handleRestockConfirm(): Promise<void> {
    if (!restockAlert) return
    const quantity = Number.parseInt(restockQuantity, 10)
    if (!Number.isFinite(quantity) || quantity <= 0) return

    setIsRestocking(true)
    try {
      await onRestock(restockAlert, quantity)
      setRestockAlert(null)
      setRestockQuantity("10")
    } finally {
      setIsRestocking(false)
    }
  }

  const columns: DataTableColumn<LowStockAlert, AlertColumnKey>[] = [
    {
      key: "bookCover",
      header: "Cover",
      cell: (alert) => (
        <EntityImage
          src={alert.bookCoverUrl}
          alt={alert.bookTitle}
          width={36}
          height={48}
          className="size-9 shrink-0 rounded object-cover"
          fallback={<BookOpenIcon className="size-4 text-muted-foreground" />}
        />
      ),
    },
    {
      key: "bookTitle",
      header: "Book Title",
      sortable: true,
      sortValue: (alert) => alert.bookTitle,
      cell: (alert) => (
        <span className="font-semibold">{alert.bookTitle}</span>
      ),
    },
    {
      key: "isbn",
      header: "ISBN",
      sortable: true,
      sortValue: (alert) => alert.isbn,
      cell: (alert) => (
        <span className="font-mono text-xs">{alert.isbn}</span>
      ),
    },
    ...(showBranchColumn
      ? [
          {
            key: "branchName" as const,
            header: "Branch",
            sortable: true,
            sortValue: (alert: LowStockAlert) => alert.branchName,
            cell: (alert: LowStockAlert) => alert.branchName,
          },
        ]
      : []),
    {
      key: "currentStock",
      header: "Current Stock",
      sortable: true,
      sortValue: (alert) => alert.currentStock,
      cell: (alert) => (
        <span
          className={
            alert.currentStock === 0
              ? "font-semibold text-red-600 dark:text-red-400"
              : "tabular-nums"
          }
        >
          {alert.currentStock.toLocaleString()}
        </span>
      ),
    },
    {
      key: "minimumStock",
      header: "Minimum Stock",
      sortable: true,
      sortValue: (alert) => alert.minimumStock,
      cell: (alert) => (
        <span className="tabular-nums">
          {alert.minimumStock.toLocaleString()}
        </span>
      ),
    },
    {
      key: "shortageQuantity",
      header: "Shortage",
      sortable: true,
      sortValue: (alert) => alert.shortageQuantity,
      cell: (alert) => (
        <span className="tabular-nums font-medium text-amber-600 dark:text-amber-400">
          {alert.shortageQuantity.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (alert) => alert.status,
      cell: (alert) => <LowStockAlertStatusBadge status={alert.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (alert) => (
        <div className="flex items-center justify-end gap-1">
          <NeedActionButton
            icon={EyeIcon}
            label="View book"
            onClick={() => onViewBook(alert)}
          />
          {alert.status === "active" ? (
            <>
              <NeedActionButton
                icon={PackagePlusIcon}
                label="Restock"
                variant="outline"
                onClick={() => {
                  setRestockAlert(alert)
                  setRestockQuantity(
                    String(Math.max(alert.shortageQuantity, 1))
                  )
                }}
              />
              <NeedActionButton
                icon={CheckIcon}
                label="Mark resolved"
                variant="outline"
                onClick={() => onMarkResolved(alert)}
              />
            </>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <TooltipProvider>
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Low Stock Alerts</CardTitle>
          <CardDescription>
            {alerts.length === 0
              ? "No alerts match the current filters."
              : `${alerts.length} alert${alerts.length === 1 ? "" : "s"} shown`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={alerts}
            columns={columns}
            getRowId={(alert) => alert.id}
            emptyTitle="No low stock alerts"
            emptyDescription="All book inventory levels are above minimum thresholds."
            initialSort={{ key: "shortageQuantity", direction: "desc" }}
            initialPageSize={10}
          />
        </CardContent>
      </Card>

      <Dialog
        open={restockAlert !== null}
        onOpenChange={(open) => !open && setRestockAlert(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock Book</DialogTitle>
            <DialogDescription>
              Add stock for &ldquo;{restockAlert?.bookTitle}&rdquo; at{" "}
              {restockAlert?.branchName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="restock-quantity">Quantity to add</Label>
            <Input
              id="restock-quantity"
              type="number"
              min={1}
              value={restockQuantity}
              onChange={(event) => setRestockQuantity(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRestockAlert(null)}
              disabled={isRestocking}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleRestockConfirm()}
              disabled={isRestocking}
            >
              {isRestocking ? "Restocking..." : "Confirm Restock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

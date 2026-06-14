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
import { LowStockAlertActionButton } from "@/presentation/components/alerts/LowStockAlertActionButton"

import { useTranslation } from "@/presentation/i18n/useTranslation"

type LowStockAlertsTableProps = {
  alerts: LowStockAlert[]
  showBranchColumn?: boolean
  onViewBook: (alert: LowStockAlert) => void
  onRestock: (alert: LowStockAlert, quantity: number) => Promise<boolean>
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
  const { t } = useTranslation()
  const [restockAlert, setRestockAlert] = useState<LowStockAlert | null>(null)
  const [restockQuantity, setRestockQuantity] = useState("10")
  const [isRestocking, setIsRestocking] = useState(false)

  async function handleRestockConfirm(): Promise<void> {
    if (!restockAlert) return
    const quantity = Number.parseInt(restockQuantity, 10)
    if (!Number.isFinite(quantity) || quantity <= 0) return

    setIsRestocking(true)
    try {
      const success = await onRestock(restockAlert, quantity)
      if (success) {
        setRestockAlert(null)
        setRestockQuantity("10")
      }
    } finally {
      setIsRestocking(false)
    }
  }

  const columns: DataTableColumn<LowStockAlert, AlertColumnKey>[] = [
    {
      key: "bookCover",
      header: t("alerts.columnCover"),
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
      header: t("alerts.columnBookTitle"),
      sortable: true,
      sortValue: (alert) => alert.bookTitle,
      cell: (alert) => (
        <span className="font-semibold">{alert.bookTitle}</span>
      ),
    },
    {
      key: "isbn",
      header: t("alerts.columnIsbn"),
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
            header: t("alerts.columnBranch"),
            sortable: true,
            sortValue: (alert: LowStockAlert) => alert.branchName,
            cell: (alert: LowStockAlert) => alert.branchName,
          },
        ]
      : []),
    {
      key: "currentStock",
      header: t("alerts.columnCurrentStock"),
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
      header: t("alerts.columnMinimumStock"),
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
      header: t("alerts.columnShortage"),
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
      header: t("alerts.columnStatus"),
      sortable: true,
      sortValue: (alert) => alert.status,
      cell: (alert) => <LowStockAlertStatusBadge status={alert.status} />,
    },
    {
      key: "actions",
      header: t("alerts.columnActions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (alert) => (
        <div className="table-action-content">
          <LowStockAlertActionButton
            icon={EyeIcon}
            label={t("alerts.actionViewBook")}
            onClick={() => onViewBook(alert)}
          />
          {alert.status === "active" ? (
            <>
              <LowStockAlertActionButton
                icon={PackagePlusIcon}
                label={t("alerts.actionRestock")}
                variant="outline"
                onClick={() => {
                  setRestockAlert(alert)
                  setRestockQuantity(
                    String(Math.max(alert.shortageQuantity, 1))
                  )
                }}
              />
              <LowStockAlertActionButton
                icon={CheckIcon}
                label={t("alerts.actionMarkResolved")}
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
          <CardTitle className="text-base">{t("alerts.tableTitle")}</CardTitle>
          <CardDescription>
            {alerts.length === 0
              ? t("alerts.noAlertsMatch")
              : alerts.length === 1
                ? t("alerts.alertsCountOne", { count: 1 })
                : t("alerts.alertsCountOther", { count: alerts.length })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={alerts}
            columns={columns}
            getRowId={(alert) => alert.id}
            emptyTitle={t("alerts.emptyTitle")}
            emptyDescription={t("alerts.emptyDescription")}
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
            <DialogTitle>{t("alerts.restockBook")}</DialogTitle>
            <DialogDescription>
              {t("alerts.addStockFor", {
                title: restockAlert?.bookTitle ?? "",
                branch: restockAlert?.branchName ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="restock-quantity">{t("alerts.quantityToAdd")}</Label>
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
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => void handleRestockConfirm()}
              disabled={isRestocking}
            >
              {isRestocking ? t("alerts.restocking") : t("alerts.confirmRestock")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

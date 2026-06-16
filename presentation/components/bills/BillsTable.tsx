"use client"

import { useMemo } from "react"
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import type { Bill } from "@/domain/entities/bill/Bill"
import { BillActionButton } from "@/presentation/components/bills/BillActionButton"
import {
  billDateSortValue,
  formatBillDate,
  formatBillPrice,
  formatBillTime,
} from "@/presentation/components/bills/billDisplay"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BillsTableProps = {
  bills: Bill[]
  showBranchColumn?: boolean
  onView: (bill: Bill) => void
  onEdit: (bill: Bill) => void
  onDelete: (bill: Bill) => void
}

type BillColumnKey =
  | "id"
  | "companyName"
  | "branchName"
  | "billDate"
  | "phoneNumber"
  | "price"
  | "productCount"
  | "addedBy"
  | "actions"

export function BillsTable({
  bills,
  showBranchColumn = true,
  onView,
  onEdit,
  onDelete,
}: BillsTableProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const columns = useMemo(() => {
    const allColumns: DataTableColumn<Bill, BillColumnKey>[] = [
      {
        key: "id",
        header: t("bills.table.id"),
        sortable: true,
        sortValue: (bill) => bill.id,
        cell: (bill) => (
          <span className="font-mono text-xs text-muted-foreground">{bill.id}</span>
        ),
      },
      {
        key: "companyName",
        header: t("bills.table.company"),
        sortable: true,
        sortValue: (bill) => bill.companyName,
        cell: (bill) => <span className="font-semibold">{bill.companyName}</span>,
      },
      {
        key: "branchName",
        header: t("bills.table.branch"),
        sortable: true,
        sortValue: (bill) => bill.branchName,
        cell: (bill) => bill.branchName,
      },
      {
        key: "billDate",
        header: t("bills.table.dateTime"),
        sortable: true,
        sortValue: (bill) => billDateSortValue(bill.billDate),
        cell: (bill) => (
          <div className="text-sm">
            <p className="font-medium">{formatBillDate(bill.billDate, locale)}</p>
            <p className="text-xs text-muted-foreground">
              {formatBillTime(bill.billDate, locale)}
            </p>
          </div>
        ),
      },
      {
        key: "phoneNumber",
        header: t("bills.table.phone"),
        sortable: true,
        sortValue: (bill) => bill.phoneNumber,
        cell: (bill) => bill.phoneNumber,
      },
      {
        key: "price",
        header: t("bills.table.price"),
        sortable: true,
        sortValue: (bill) => bill.price,
        cell: (bill) => (
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
            {formatBillPrice(bill.price, locale)}
          </span>
        ),
      },
      {
        key: "productCount",
        header: t("bills.table.products"),
        sortable: true,
        sortValue: (bill) => bill.productCount,
        cell: (bill) => (
          <Badge
            variant="secondary"
            className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
          >
            {t("bills.table.productCount", { count: bill.productCount })}
          </Badge>
        ),
      },
      {
        key: "addedBy",
        header: t("bills.table.addedBy"),
        sortable: true,
        sortValue: (bill) => bill.addedBy.staffName,
        cell: (bill) => <span className="text-sm">{bill.addedBy.staffName}</span>,
      },
      {
        key: "actions",
        header: t("bills.table.actions"),
        headerClassName: "text-right",
        className: "text-right",
        cell: (bill) => (
          <div className="table-action-content">
            <BillActionButton
              icon={EyeIcon}
              label={t("bills.table.view")}
              variant="outline"
              onClick={() => onView(bill)}
            />
            <BillActionButton
              icon={PencilIcon}
              label={t("bills.table.edit")}
              variant="outline"
              onClick={() => onEdit(bill)}
            />
            <BillActionButton
              icon={Trash2Icon}
              label={t("bills.table.delete")}
              variant="destructive"
              onClick={() => onDelete(bill)}
            />
          </div>
        ),
      },
    ]

    return showBranchColumn
      ? allColumns
      : allColumns.filter((column) => column.key !== "branchName")
  }, [locale, onDelete, onEdit, onView, showBranchColumn, t])

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("bills.table.title")}</CardTitle>
        <CardDescription>
          {t("bills.table.recordCount", { count: bills.length.toLocaleString(locale) })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={bills}
          columns={columns}
          getRowId={(bill) => bill.id}
          emptyTitle={t("bills.table.emptyTitle")}
          emptyDescription={t("bills.table.emptyDescription")}
          initialSort={{ key: "billDate", direction: "desc" }}
          initialPageSize={10}
          tableClassName="min-w-[1120px]"
        />
      </CardContent>
    </Card>
  )
}

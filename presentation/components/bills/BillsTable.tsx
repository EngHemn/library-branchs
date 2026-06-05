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
  | "actions"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function BillsTable({
  bills,
  showBranchColumn = true,
  onView,
  onEdit,
  onDelete,
}: BillsTableProps) {
  const columns = useMemo(() => {
    const allColumns: DataTableColumn<Bill, BillColumnKey>[] = [
      {
        key: "id",
        header: "ID",
        sortable: true,
        sortValue: (bill) => bill.id,
        cell: (bill) => (
          <span className="font-mono text-xs text-muted-foreground">{bill.id}</span>
        ),
      },
      {
        key: "companyName",
        header: "Company",
        sortable: true,
        sortValue: (bill) => bill.companyName,
        cell: (bill) => <span className="font-semibold">{bill.companyName}</span>,
      },
      {
        key: "branchName",
        header: "Branch",
        sortable: true,
        sortValue: (bill) => bill.branchName,
        cell: (bill) => bill.branchName,
      },
      {
        key: "billDate",
        header: "Date",
        sortable: true,
        sortValue: (bill) => bill.billDate,
        cell: (bill) => bill.billDate,
      },
      {
        key: "phoneNumber",
        header: "Phone",
        sortable: true,
        sortValue: (bill) => bill.phoneNumber,
        cell: (bill) => bill.phoneNumber,
      },
      {
        key: "price",
        header: "Price",
        sortable: true,
        sortValue: (bill) => bill.price,
        cell: (bill) => (
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
            {formatPrice(bill.price)}
          </span>
        ),
      },
      {
        key: "productCount",
        header: "Products",
        sortable: true,
        sortValue: (bill) => bill.productCount,
        cell: (bill) => (
          <Badge
            variant="secondary"
            className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
          >
            {bill.productCount} books
          </Badge>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        headerClassName: "text-right",
        className: "text-right",
        cell: (bill) => (
          <div className="flex justify-end gap-1">
            <BillActionButton
              icon={EyeIcon}
              label="View"
              variant="outline"
              onClick={() => onView(bill)}
            />
            <BillActionButton
              icon={PencilIcon}
              label="Edit"
              variant="outline"
              onClick={() => onEdit(bill)}
            />
            <BillActionButton
              icon={Trash2Icon}
              label="Delete"
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
  }, [showBranchColumn, onView, onEdit, onDelete])

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>All Bills</CardTitle>
        <CardDescription>
          {bills.length.toLocaleString()} purchase bills for branch stock imports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={bills}
          columns={columns}
          getRowId={(bill) => bill.id}
          emptyTitle="No bills found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "billDate", direction: "desc" }}
          initialPageSize={10}
          tableClassName="min-w-[1000px]"
        />
      </CardContent>
    </Card>
  )
}

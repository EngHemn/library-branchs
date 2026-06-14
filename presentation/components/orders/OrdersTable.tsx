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
import type { Order } from "@/domain/entities/order/Order"
import { OrderActionButton } from "@/presentation/components/orders/OrderActionButton"
import { OrderStatusBadge } from "@/presentation/components/orders/OrderStatusBadge"
import {
  formatBookQuantity,
  formatOrderDate,
  formatOrderPriceInDinar,
  formatOrderTime,
  orderDateSortValue,
} from "@/presentation/components/orders/orderDisplay"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type OrdersTableProps = {
  orders: Order[]
  showBranchColumn?: boolean
  onView: (order: Order) => void
  onEdit: (order: Order) => void
  onDelete: (order: Order) => void
}

type OrderColumnKey =
  | "supplierName"
  | "branchName"
  | "branchLocation"
  | "orderDate"
  | "expectedDeliveryDate"
  | "status"
  | "totalAmount"
  | "itemCount"
  | "actions"

export function OrdersTable({
  orders,
  showBranchColumn = true,
  onView,
  onEdit,
  onDelete,
}: OrdersTableProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const columns = useMemo(() => {
    const allColumns: DataTableColumn<Order, OrderColumnKey>[] = [
      {
        key: "supplierName",
        header: t("orders.table.supplier"),
        sortable: true,
        sortValue: (order) => order.supplierName,
        cell: (order) => (
          <span className="font-semibold">{order.supplierName}</span>
        ),
      },
      {
        key: "branchName",
        header: t("orders.table.branch"),
        sortable: true,
        sortValue: (order) => order.branchName,
        cell: (order) => order.branchName,
      },
      {
        key: "branchLocation",
        header: t("orders.table.location"),
        sortable: true,
        sortValue: (order) => order.branchLocation,
        cell: (order) => (
          <span className="max-w-[200px] truncate text-sm" title={order.branchLocation}>
            {order.branchLocation}
          </span>
        ),
      },
      {
        key: "orderDate",
        header: t("orders.table.orderDate"),
        sortable: true,
        sortValue: (order) => orderDateSortValue(order.orderDate),
        cell: (order) => (
          <div className="text-sm">
            <p className="font-medium">{formatOrderDate(order.orderDate, locale)}</p>
            <p className="text-xs text-muted-foreground">
              {formatOrderTime(order.orderDate, locale)}
            </p>
          </div>
        ),
      },
      {
        key: "expectedDeliveryDate",
        header: t("orders.table.expectedDelivery"),
        sortable: true,
        sortValue: (order) => orderDateSortValue(order.expectedDeliveryDate),
        cell: (order) => (
          <div className="text-sm">
            <p className="font-medium">{formatOrderDate(order.expectedDeliveryDate, locale)}</p>
            <p className="text-xs text-muted-foreground">
              {formatOrderTime(order.expectedDeliveryDate, locale)}
            </p>
          </div>
        ),
      },
      {
        key: "status",
        header: t("orders.table.status"),
        sortable: true,
        sortValue: (order) => order.status,
        cell: (order) => <OrderStatusBadge status={order.status} />,
      },
      {
        key: "itemCount",
        header: t("orders.table.bookQuantity"),
        sortable: true,
        sortValue: (order) => order.itemCount,
        cell: (order) => (
          <Badge
            variant="secondary"
            className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
          >
            {t("orders.table.bookQuantityCount", {
              count: formatBookQuantity(order.itemCount, locale),
            })}
          </Badge>
        ),
      },
      {
        key: "totalAmount",
        header: t("orders.table.total"),
        sortable: true,
        sortValue: (order) => order.totalAmount,
        cell: (order) => (
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
            {formatOrderPriceInDinar(order.totalAmount, locale)}
          </span>
        ),
      },
      {
        key: "actions",
        header: t("orders.table.actions"),
        headerClassName: "text-right",
        className: "text-right",
        cell: (order) => (
          <div className="table-action-content">
            <OrderActionButton
              icon={EyeIcon}
              label={t("orders.table.view")}
              variant="outline"
              onClick={() => onView(order)}
            />
            <OrderActionButton
              icon={PencilIcon}
              label={t("orders.table.edit")}
              variant="outline"
              onClick={() => onEdit(order)}
            />
            <OrderActionButton
              icon={Trash2Icon}
              label={t("orders.table.delete")}
              variant="destructive"
              onClick={() => onDelete(order)}
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
        <CardTitle>{t("orders.table.title")}</CardTitle>
        <CardDescription>
          {t("orders.table.recordCount", { count: orders.length.toLocaleString(locale) })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={orders}
          columns={columns}
          getRowId={(order) => order.id}
          emptyTitle={t("orders.table.emptyTitle")}
          emptyDescription={t("orders.table.emptyDescription")}
          initialSort={{ key: "orderDate", direction: "desc" }}
          initialPageSize={10}
          tableClassName="min-w-[1100px]"
        />
      </CardContent>
    </Card>
  )
}

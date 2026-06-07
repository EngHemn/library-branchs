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
  const columns = useMemo(() => {
    const allColumns: DataTableColumn<Order, OrderColumnKey>[] = [
      {
        key: "supplierName",
        header: "Supplier",
        sortable: true,
        sortValue: (order) => order.supplierName,
        cell: (order) => (
          <span className="font-semibold">{order.supplierName}</span>
        ),
      },
      {
        key: "branchName",
        header: "Branch",
        sortable: true,
        sortValue: (order) => order.branchName,
        cell: (order) => order.branchName,
      },
      {
        key: "branchLocation",
        header: "Location",
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
        header: "Order Date",
        sortable: true,
        sortValue: (order) => orderDateSortValue(order.orderDate),
        cell: (order) => (
          <div className="text-sm">
            <p className="font-medium">{formatOrderDate(order.orderDate)}</p>
            <p className="text-xs text-muted-foreground">
              {formatOrderTime(order.orderDate)}
            </p>
          </div>
        ),
      },
      {
        key: "expectedDeliveryDate",
        header: "Expected Delivery",
        sortable: true,
        sortValue: (order) => orderDateSortValue(order.expectedDeliveryDate),
        cell: (order) => (
          <div className="text-sm">
            <p className="font-medium">{formatOrderDate(order.expectedDeliveryDate)}</p>
            <p className="text-xs text-muted-foreground">
              {formatOrderTime(order.expectedDeliveryDate)}
            </p>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        sortValue: (order) => order.status,
        cell: (order) => <OrderStatusBadge status={order.status} />,
      },
      {
        key: "itemCount",
        header: "Book Quantity",
        sortable: true,
        sortValue: (order) => order.itemCount,
        cell: (order) => (
          <Badge
            variant="secondary"
            className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
          >
            {formatBookQuantity(order.itemCount)}
          </Badge>
        ),
      },
      {
        key: "totalAmount",
        header: "Total (IQD)",
        sortable: true,
        sortValue: (order) => order.totalAmount,
        cell: (order) => (
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
            {formatOrderPriceInDinar(order.totalAmount)}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        headerClassName: "text-right",
        className: "text-right",
        cell: (order) => (
          <div className="flex justify-end gap-1">
            <OrderActionButton
              icon={EyeIcon}
              label="View"
              variant="outline"
              onClick={() => onView(order)}
            />
            <OrderActionButton
              icon={PencilIcon}
              label="Edit"
              variant="outline"
              onClick={() => onEdit(order)}
            />
            <OrderActionButton
              icon={Trash2Icon}
              label="Delete"
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
  }, [showBranchColumn, onView, onEdit, onDelete])

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
        <CardDescription>
          {orders.length.toLocaleString()} purchase orders with location, quantity, and IQD totals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={orders}
          columns={columns}
          getRowId={(order) => order.id}
          emptyTitle="No orders found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "orderDate", direction: "desc" }}
          initialPageSize={10}
          tableClassName="min-w-[1100px]"
        />
      </CardContent>
    </Card>
  )
}

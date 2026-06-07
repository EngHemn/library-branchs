"use client"

import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { OrderDetail } from "@/domain/entities/order/OrderDetail"
import { OrderStatusBadge } from "@/presentation/components/orders/OrderStatusBadge"
import {
  formatBookQuantity,
  formatOrderDate,
  formatOrderPriceInDinar,
  formatOrderTime,
} from "@/presentation/components/orders/orderDisplay"

type OrderDetailHeaderProps = {
  order: OrderDetail
  onEdit: () => void
}

export function OrderDetailHeader({ order, onEdit }: OrderDetailHeaderProps) {
  return (
    <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
        <h1 className="text-2xl font-bold tracking-normal">{order.supplierName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Purchase order for {order.branchName} · {formatOrderDate(order.orderDate)} at{" "}
          {formatOrderTime(order.orderDate)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Location: {order.branchLocation}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <span className="text-sm font-medium text-muted-foreground">
            {formatBookQuantity(order.itemCount)}
          </span>
          <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
            {formatOrderPriceInDinar(order.totalAmount)}
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={onEdit}>
        <PencilIcon />
        Edit Order
      </Button>
    </section>
  )
}

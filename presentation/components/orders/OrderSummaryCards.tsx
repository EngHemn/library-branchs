"use client"

import {
  BookOpenIcon,
  Building2Icon,
  CalendarIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type { OrderDetail } from "@/domain/entities/order/OrderDetail"
import {
  formatBookQuantity,
  formatOrderDate,
  formatOrderPriceInDinar,
  formatOrderTime,
} from "@/presentation/components/orders/orderDisplay"

type OrderSummaryCardsProps = {
  order: OrderDetail
}

export function OrderSummaryCards({ order }: OrderSummaryCardsProps) {
  const items = [
    {
      icon: Building2Icon,
      label: "Branch",
      value: order.branchName,
    },
    {
      icon: MapPinIcon,
      label: "Location",
      value: order.branchLocation,
    },
    {
      icon: BookOpenIcon,
      label: "Book Quantity",
      value: formatBookQuantity(order.itemCount),
    },
    {
      icon: CalendarIcon,
      label: "Order Date",
      value: formatOrderDate(order.orderDate),
      subValue: formatOrderTime(order.orderDate),
    },
    {
      icon: TruckIcon,
      label: "Expected Delivery",
      value: formatOrderDate(order.expectedDeliveryDate),
      subValue: formatOrderTime(order.expectedDeliveryDate),
    },
    {
      icon: PhoneIcon,
      label: "Phone",
      value: order.phoneNumber,
    },
    {
      icon: MailIcon,
      label: "Email",
      value: order.supplierEmail ?? "—",
    },
    {
      icon: BookOpenIcon,
      label: "Total (IQD)",
      value: formatOrderPriceInDinar(order.totalAmount),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="rounded-lg">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <item.icon className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
              {"subValue" in item && item.subValue ? (
                <p className="text-xs text-muted-foreground">{item.subValue}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

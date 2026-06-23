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

import { Card, CardContent } from "@/components/ui/card"
import type { OrderDetail } from "@/domain/entities/order/OrderDetail"
import {
  formatBookQuantity,
  formatOrderDate,
  formatOrderPriceInDinar,
  formatOrderTime,
} from "@/presentation/components/orders/orderDisplay"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type OrderSummaryCardsProps = {
  order: OrderDetail
}

export function OrderSummaryCards({ order }: OrderSummaryCardsProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const items = [
    {
      icon: Building2Icon,
      label: t("orders.summary.branch"),
      value: order.branchName,
    },
    {
      icon: MapPinIcon,
      label: t("orders.summary.location"),
      value: order.branchLocation,
    },
    {
      icon: BookOpenIcon,
      label: t("orders.summary.bookQuantity"),
      value: t("orders.table.bookQuantityCount", {
        count: formatBookQuantity(order.itemCount, locale),
      }),
    },
    {
      icon: CalendarIcon,
      label: t("orders.summary.orderDate"),
      value: formatOrderDate(order.orderDate, locale),
      subValue: formatOrderTime(order.orderDate, locale),
    },
    {
      icon: TruckIcon,
      label: t("orders.summary.expectedDelivery"),
      value: formatOrderDate(order.expectedDeliveryDate, locale),
      subValue: formatOrderTime(order.expectedDeliveryDate, locale),
    },
    {
      icon: PhoneIcon,
      label: t("orders.summary.phone"),
      value: order.phoneNumber,
    },
    {
      icon: MailIcon,
      label: t("orders.summary.email"),
      value: order.supplierEmail ?? "—",
    },
    {
      icon: BookOpenIcon,
      label: t("orders.summary.total"),
      value: formatOrderPriceInDinar(order.totalAmount, locale),
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

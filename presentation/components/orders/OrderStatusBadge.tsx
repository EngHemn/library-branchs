"use client"

import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/domain/entities/order/OrderStatus"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type OrderStatusBadgeProps = {
  status: OrderStatus
}

const statusStyles: Record<OrderStatus, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  confirmed:
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  shipped:
    "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  delivered:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useTranslation()

  return (
    <Badge variant="secondary" className={statusStyles[status]}>
      {t(`orders.status.${status}`)}
    </Badge>
  )
}

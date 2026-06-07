"use client"

import { Badge } from "@/components/ui/badge"
import type { LowStockAlertStatus } from "@/domain/entities/alert/LowStockAlert"

type LowStockAlertStatusBadgeProps = {
  status: LowStockAlertStatus
}

const statusStyles: Record<LowStockAlertStatus, string> = {
  active:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  resolved:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
}

const statusLabels: Record<LowStockAlertStatus, string> = {
  active: "Active",
  resolved: "Resolved",
}

export function LowStockAlertStatusBadge({
  status,
}: LowStockAlertStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import type { LowStockAlertStatus } from "@/domain/entities/alert/LowStockAlert"

import { useTranslation } from "@/presentation/i18n/useTranslation"

type LowStockAlertStatusBadgeProps = {
  status: LowStockAlertStatus
}

const statusStyles: Record<LowStockAlertStatus, string> = {
  active:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  resolved:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
}

export function LowStockAlertStatusBadge({
  status,
}: LowStockAlertStatusBadgeProps) {
  const { t } = useTranslation()

  const statusLabels: Record<LowStockAlertStatus, string> = {
    active: t("alerts.active"),
    resolved: t("alerts.resolved"),
  }

  return (
    <Badge variant="secondary" className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  )
}

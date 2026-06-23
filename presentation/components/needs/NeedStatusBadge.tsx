"use client"

import { Badge } from "@/components/ui/badge"
import type { NeedStatus } from "@/domain/entities/need/NeedStatus"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type NeedStatusBadgeProps = {
  status: NeedStatus
}

const statusStyles: Record<NeedStatus, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  approved:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  ordered: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  received:
    "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  completed: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
}

export function NeedStatusBadge({ status }: NeedStatusBadgeProps) {
  const { t } = useTranslation()

  return (
    <Badge variant="secondary" className={statusStyles[status]}>
      {t(`needs.statuses.${status}` as any)}
    </Badge>
  )
}

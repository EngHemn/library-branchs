"use client"

import { Badge } from "@/components/ui/badge"
import type { NeedPriority } from "@/domain/entities/need/NeedPriority"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type NeedPriorityBadgeProps = {
  priority: NeedPriority
}

const priorityStyles: Record<NeedPriority, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  medium: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
}

export function NeedPriorityBadge({ priority }: NeedPriorityBadgeProps) {
  const { t } = useTranslation()

  return (
    <Badge variant="secondary" className={priorityStyles[priority]}>
      {t(`needs.priorities.${priority}` as any)}
    </Badge>
  )
}

"use client"

import {
  CheckCircleIcon,
  ClockIcon,
  FileEditIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "lucide-react"

import type { NeedActivityEntry } from "@/domain/entities/need/Need"
import { formatNeedDateTime } from "@/presentation/components/needs/needDisplay"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type NeedActivityLogTabProps = {
  activityLog: NeedActivityEntry[]
}

const actionIcons = {
  created: PlusCircleIcon,
  updated: FileEditIcon,
  approved: CheckCircleIcon,
  rejected: XCircleIcon,
  completed: CheckCircleIcon,
} as const

export function NeedActivityLogTab({ activityLog }: NeedActivityLogTabProps) {
  const { t } = useTranslation()

  if (activityLog.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("needs.activityLogTab.empty")}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {[...activityLog]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((entry) => {
          const Icon = actionIcons[entry.action] ?? ClockIcon
          return (
            <div key={entry.id} className="flex gap-3 rounded-lg border p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">
                    {t(`needs.activityLogTab.actions.${entry.action}` as any)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatNeedDateTime(entry.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {entry.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("needs.activityLogTab.byUser", {
                    user: entry.performedBy,
                  })}
                </p>
              </div>
            </div>
          )
        })}
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import type {
  DashboardActivity,
  DashboardActivityTone,
} from "@/domain/entities/dashboard/DashboardSummary"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardActivityFeedProps = {
  activities: DashboardActivity[]
}

const toneDotClass: Record<DashboardActivityTone, string> = {
  default: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
}

const ACTIVITY_KEYS: Record<string, { title: TranslationKey; description: TranslationKey; time: TranslationKey }> = {
  "act-001": {
    title: "dashboard.activities.act-001.title",
    description: "dashboard.activities.act-001.description",
    time: "dashboard.activities.act-001.time",
  },
  "act-002": {
    title: "dashboard.activities.act-002.title",
    description: "dashboard.activities.act-002.description",
    time: "dashboard.activities.act-002.time",
  },
  "act-003": {
    title: "dashboard.activities.act-003.title",
    description: "dashboard.activities.act-003.description",
    time: "dashboard.activities.act-003.time",
  },
  "act-004": {
    title: "dashboard.activities.act-004.title",
    description: "dashboard.activities.act-004.description",
    time: "dashboard.activities.act-004.time",
  },
  "act-005": {
    title: "dashboard.activities.act-005.title",
    description: "dashboard.activities.act-005.description",
    time: "dashboard.activities.act-005.time",
  },
  "act-006": {
    title: "dashboard.activities.act-006.title",
    description: "dashboard.activities.act-006.description",
    time: "dashboard.activities.act-006.time",
  },
}

export function DashboardActivityFeed({ activities }: DashboardActivityFeedProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const keys = ACTIVITY_KEYS[activity.id]

        return (
          <div key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  toneDotClass[activity.tone]
                )}
              />
              <span className="mt-1 w-px flex-1 bg-border" />
            </div>
            <div className="min-w-0 flex-1 pb-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-5">
                  {keys ? t(keys.title) : activity.title}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {keys ? t(keys.time) : activity.time}
                </span>
              </div>
              <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                {keys ? t(keys.description) : activity.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

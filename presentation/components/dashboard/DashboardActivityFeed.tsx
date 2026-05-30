"use client"

import { cn } from "@/lib/utils"
import type {
  DashboardActivity,
  DashboardActivityTone,
} from "@/domain/entities/dashboard/DashboardSummary"

type DashboardActivityFeedProps = {
  activities: DashboardActivity[]
}

const toneDotClass: Record<DashboardActivityTone, string> = {
  default: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
}

export function DashboardActivityFeed({ activities }: DashboardActivityFeedProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
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
              <p className="text-sm font-medium leading-5">{activity.title}</p>
              <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
            </div>
            <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
              {activity.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

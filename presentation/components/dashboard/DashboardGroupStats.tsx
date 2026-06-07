"use client"

import {
  BookOpenIcon,
  LayersIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DashboardSummary } from "@/domain/entities/dashboard/DashboardSummary"

type DashboardGroupStatsProps = {
  groupStats: DashboardSummary["groupStats"]
}

const cards = [
  {
    key: "totalGroups",
    title: "Total Groups",
    description: "Active groups in the system",
    icon: LayersIcon,
    color: "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400",
    getValue: (stats: DashboardSummary["groupStats"]) => stats.totalGroups,
  },
  {
    key: "activeGroups",
    title: "Active Groups",
    description: "Currently active",
    icon: UserCheckIcon,
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
    getValue: (stats: DashboardSummary["groupStats"]) => stats.activeGroups,
  },
  {
    key: "totalAssignedBooks",
    title: "Assigned Books",
    description: "Books across all groups",
    icon: BookOpenIcon,
    color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400",
    getValue: (stats: DashboardSummary["groupStats"]) => stats.totalAssignedBooks,
  },
  {
    key: "totalAssignedStaff",
    title: "Assigned Staff",
    description: "Staff across all groups",
    icon: UsersIcon,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
    getValue: (stats: DashboardSummary["groupStats"]) => stats.totalAssignedStaff,
  },
] as const

export function DashboardGroupStats({ groupStats }: DashboardGroupStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.key} className="rounded-xl">
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${card.color}`}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-sm">{card.title}</CardTitle>
                <CardDescription className="text-xs">
                  {card.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums">
                {card.getValue(groupStats).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

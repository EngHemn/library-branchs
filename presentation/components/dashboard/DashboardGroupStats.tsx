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
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardGroupStatsProps = {
  groupStats: DashboardSummary["groupStats"]
}

const cards: Array<{
  key: keyof DashboardSummary["groupStats"]
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  icon: typeof LayersIcon
  color: string
}> = [
  {
    key: "totalGroups",
    titleKey: "dashboard.groups.totalGroups",
    descriptionKey: "dashboard.groups.totalGroupsDescription",
    icon: LayersIcon,
    color: "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400",
  },
  {
    key: "activeGroups",
    titleKey: "dashboard.groups.activeGroups",
    descriptionKey: "dashboard.groups.activeGroupsDescription",
    icon: UserCheckIcon,
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "totalAssignedBooks",
    titleKey: "dashboard.groups.assignedBooks",
    descriptionKey: "dashboard.groups.assignedBooksDescription",
    icon: BookOpenIcon,
    color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400",
  },
  {
    key: "totalAssignedStaff",
    titleKey: "dashboard.groups.assignedStaff",
    descriptionKey: "dashboard.groups.assignedStaffDescription",
    icon: UsersIcon,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
  },
]

export function DashboardGroupStats({ groupStats }: DashboardGroupStatsProps) {
  const { t } = useTranslation()

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
                <CardTitle className="text-sm">{t(card.titleKey)}</CardTitle>
                <CardDescription className="text-xs">
                  {t(card.descriptionKey)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums">
                {groupStats[card.key].toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

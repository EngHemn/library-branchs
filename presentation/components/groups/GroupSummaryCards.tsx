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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { GroupSummary } from "@/domain/entities/group/Group"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type GroupSummaryCardsProps = {
  summary: GroupSummary | null
  isLoading: boolean
}

export function GroupSummaryCards({
  summary,
  isLoading,
}: GroupSummaryCardsProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const cards = [
    {
      key: "totalGroups",
      title: t("groups.summary.totalGroups"),
      icon: LayersIcon,
      getValue: (groupSummary: GroupSummary) => groupSummary.totalGroups,
    },
    {
      key: "activeGroups",
      title: t("groups.summary.activeGroups"),
      icon: UserCheckIcon,
      getValue: (groupSummary: GroupSummary) => groupSummary.activeGroups,
    },
    {
      key: "totalAssignedBooks",
      title: t("groups.summary.assignedBooks"),
      icon: BookOpenIcon,
      getValue: (groupSummary: GroupSummary) => groupSummary.totalAssignedBooks,
    },
    {
      key: "totalAssignedStaff",
      title: t("groups.summary.staff"),
      icon: UsersIcon,
      getValue: (groupSummary: GroupSummary) => groupSummary.totalAssignedStaff,
    },
  ] as const

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.key} className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading || !summary ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <div className="text-2xl font-semibold tabular-nums">
                  {card.getValue(summary).toLocaleString(locale)}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

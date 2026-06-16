"use client"

import {
  BookOpenIcon,
  LayersIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { GroupSummary } from "@/domain/entities/group/Group"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type GroupSummaryCardsProps = {
  summary: GroupSummary | null
  isLoading: boolean
}

type CardItem = {
  key: string
  label: string
  value: number
  icon: React.ElementType
  className: string
}

function SummaryCardSkeleton() {
  return (
    <Card className="flex flex-row items-center gap-4 rounded-lg p-4 shadow-sm">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-12" />
      </div>
    </Card>
  )
}

export function GroupSummaryCards({
  summary,
  isLoading,
}: GroupSummaryCardsProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const cards: CardItem[] = [
    {
      key: "totalGroups",
      label: t("groups.summary.totalGroups"),
      value: summary?.totalGroups ?? 0,
      icon: LayersIcon,
      className: "bg-violet-100 text-violet-600",
    },
    {
      key: "activeGroups",
      label: t("groups.summary.activeGroups"),
      value: summary?.activeGroups ?? 0,
      icon: UserCheckIcon,
      className: "bg-emerald-100 text-emerald-600",
    },
    {
      key: "totalAssignedBooks",
      label: t("groups.summary.assignedBooks"),
      value: summary?.totalAssignedBooks ?? 0,
      icon: BookOpenIcon,
      className: "bg-blue-100 text-blue-600",
    },
    {
      key: "totalAssignedStaff",
      label: t("groups.summary.staff"),
      value: summary?.totalAssignedStaff ?? 0,
      icon: UsersIcon,
      className: "bg-amber-100 text-amber-600",
    },
  ]

  if (isLoading) {
    return (
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </section>
    )
  }

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.key}
            className="flex w-full flex-row items-center gap-4 rounded-lg p-4 shadow-sm"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${card.className}`}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <span className="text-lg font-semibold tabular-nums">
                {card.value.toLocaleString(locale)}
              </span>
            </div>
          </Card>
        )
      })}
    </section>
  )
}

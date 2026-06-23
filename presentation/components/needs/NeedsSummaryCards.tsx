"use client"

import type { ElementType } from "react"
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  ClockIcon,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { NeedSummary } from "@/domain/entities/need/Need"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type NeedsSummaryCardsProps = {
  summary: NeedSummary | null
  isLoading?: boolean
}

type SummaryCardConfig = {
  key: keyof NeedSummary
  translationKey: string
  translationHintKey: string
  icon: ElementType
  iconClassName: string
  accentClassName: string
}

const cards: SummaryCardConfig[] = [
  {
    key: "totalRequests",
    translationKey: "needs.summary.totalRequests",
    translationHintKey: "needs.summary.totalRequestsHint",
    icon: ClipboardListIcon,
    iconClassName: "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
    accentClassName: "border-l-sky-500",
  },
  {
    key: "pendingRequests",
    translationKey: "needs.summary.pending",
    translationHintKey: "needs.summary.pendingHint",
    icon: ClockIcon,
    iconClassName:
      "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    accentClassName: "border-l-amber-500",
  },
  {
    key: "approvedRequests",
    translationKey: "needs.summary.approved",
    translationHintKey: "needs.summary.approvedHint",
    icon: CheckCircleIcon,
    iconClassName:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    accentClassName: "border-l-emerald-500",
  },
  {
    key: "criticalRequests",
    translationKey: "needs.summary.critical",
    translationHintKey: "needs.summary.criticalHint",
    icon: AlertTriangleIcon,
    iconClassName: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    accentClassName: "border-l-red-500",
  },
]

function SummaryCardSkeleton() {
  return (
    <Card className="flex flex-row items-center gap-4 rounded-xl border-l-4 border-l-muted p-4 shadow-sm">
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-7 w-10" />
        <Skeleton className="h-3 w-32" />
      </div>
    </Card>
  )
}

export function NeedsSummaryCards({
  summary,
  isLoading = false,
}: NeedsSummaryCardsProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </section>
    )
  }

  if (!summary) return null

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        const value = summary[card.key]

        return (
          <Card
            key={card.key}
            className={cn(
              "flex flex-row items-center gap-4 rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md",
              card.accentClassName
            )}
          >
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full",
                card.iconClassName
              )}
            >
              <Icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t(card.translationKey as any)}
              </p>
              <p className="text-2xl font-bold tracking-tight tabular-nums">
                {value.toLocaleString()}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {t(card.translationHintKey as any)}
              </p>
            </div>
          </Card>
        )
      })}
    </section>
  )
}

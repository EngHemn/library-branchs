"use client"

import {
  AlertTriangleIcon,
  BookOpenIcon,
  PackageXIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { LowStockAlertSummary } from "@/domain/entities/alert/LowStockAlert"

import { useTranslation } from "@/presentation/i18n/useTranslation"

type LowStockAlertSummaryCardsProps = {
  summary: LowStockAlertSummary | null
  isLoading?: boolean
}

const cards = [
  {
    key: "activeAlerts",
    titleKey: "alerts.activeAlerts" as const,
    descriptionKey: "alerts.activeAlertsDesc" as const,
    icon: AlertTriangleIcon,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
    getValue: (summary: LowStockAlertSummary) => summary.activeAlerts,
  },
  {
    key: "lowStockBooks",
    titleKey: "alerts.lowStockBooks" as const,
    descriptionKey: "alerts.lowStockBooksDesc" as const,
    icon: BookOpenIcon,
    color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
    getValue: (summary: LowStockAlertSummary) => summary.lowStockBooks,
  },
  {
    key: "outOfStockBooks",
    titleKey: "alerts.outOfStock" as const,
    descriptionKey: "alerts.outOfStockDesc" as const,
    icon: PackageXIcon,
    color: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
    getValue: (summary: LowStockAlertSummary) => summary.outOfStockBooks,
  },
] as const

export function LowStockAlertSummaryCards({
  summary,
  isLoading = false,
}: LowStockAlertSummaryCardsProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.key} className="rounded-lg flex flex-row">
            <CardHeader className="flex-row items-center  flex-1 gap-3 space-y-0 pb-2">
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
                {card.getValue(summary).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

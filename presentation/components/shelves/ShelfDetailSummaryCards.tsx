"use client"

import { BookOpenIcon, LayersIcon, PercentIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { Shelf } from "@/domain/entities/shelf/Shelf"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelfDetailSummaryCardsProps = {
  shelf: Shelf
}

function getUtilizationPercent(shelf: Shelf): number {
  if (shelf.capacity <= 0) return 0
  return Math.round((shelf.bookCount / shelf.capacity) * 100)
}

export function ShelfDetailSummaryCards({
  shelf,
}: ShelfDetailSummaryCardsProps) {
  const { t } = useTranslation()
  const availableSpace = Math.max(shelf.capacity - shelf.bookCount, 0)
  const utilization = getUtilizationPercent(shelf)

  const items: Array<{
    icon: typeof LayersIcon
    labelKey: TranslationKey
    value: string
    subValue: string
  }> = [
    {
      icon: LayersIcon,
      labelKey: "shelves.detail.capacity",
      value: shelf.capacity.toLocaleString(),
      subValue: t("shelves.detail.maximumBooks"),
    },
    {
      icon: BookOpenIcon,
      labelKey: "shelves.detail.booksOnShelf",
      value: shelf.bookCount.toLocaleString(),
      subValue: t("shelves.detail.spacesAvailable", {
        count: availableSpace.toLocaleString(),
      }),
    },
    {
      icon: PercentIcon,
      labelKey: "shelves.detail.utilization",
      value: `${utilization}%`,
      subValue: t("shelves.detail.ofShelfCapacity"),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.labelKey} className="rounded-lg">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <item.icon className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t(item.labelKey)}
              </p>
              <p className="font-semibold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.subValue}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

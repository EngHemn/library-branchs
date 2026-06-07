"use client"

import { BookOpenIcon, LayersIcon, PercentIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { Shelf } from "@/domain/entities/shelf/Shelf"

type ShelfDetailSummaryCardsProps = {
  shelf: Shelf
}

function getUtilizationPercent(shelf: Shelf): number {
  if (shelf.capacity <= 0) return 0
  return Math.round((shelf.bookCount / shelf.capacity) * 100)
}

export function ShelfDetailSummaryCards({ shelf }: ShelfDetailSummaryCardsProps) {
  const availableSpace = Math.max(shelf.capacity - shelf.bookCount, 0)
  const utilization = getUtilizationPercent(shelf)

  const items = [
    {
      icon: LayersIcon,
      label: "Capacity",
      value: shelf.capacity.toLocaleString(),
      subValue: "Maximum books",
    },
    {
      icon: BookOpenIcon,
      label: "Books on Shelf",
      value: shelf.bookCount.toLocaleString(),
      subValue: `${availableSpace.toLocaleString()} spaces available`,
    },
    {
      icon: PercentIcon,
      label: "Utilization",
      value: `${utilization}%`,
      subValue: "Of shelf capacity",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="rounded-lg">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <item.icon className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.subValue}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

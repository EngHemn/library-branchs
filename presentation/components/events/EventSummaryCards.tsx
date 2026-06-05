"use client"

import {
  CalendarDaysIcon,
  CalendarRangeIcon,
  GitBranchPlusIcon,
  SparklesIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { EventSummary } from "@/domain/entities/event/Event"

type EventSummaryCardsProps = {
  summary: EventSummary | null
  isLoading: boolean
}

const cards = [
  {
    key: "totalEvents",
    title: "Total events",
    icon: CalendarDaysIcon,
    getValue: (summary: EventSummary) => summary.totalEvents,
  },
  {
    key: "upcomingEvents",
    title: "Upcoming",
    icon: CalendarRangeIcon,
    getValue: (summary: EventSummary) => summary.upcomingEvents,
  },
  {
    key: "activeEvents",
    title: "Active now",
    icon: SparklesIcon,
    getValue: (summary: EventSummary) => summary.activeEvents,
  },
  {
    key: "multiBranchEvents",
    title: "Multi-branch",
    icon: GitBranchPlusIcon,
    getValue: (summary: EventSummary) => summary.multiBranchEvents,
  },
] as const

export function EventSummaryCards({
  summary,
  isLoading,
}: EventSummaryCardsProps) {
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
                  {card.getValue(summary).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

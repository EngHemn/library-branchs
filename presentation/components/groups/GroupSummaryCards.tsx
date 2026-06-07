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

type GroupSummaryCardsProps = {
  summary: GroupSummary | null
  isLoading: boolean
}

const cards = [
  {
    key: "totalGroups",
    title: "Total Groups",
    icon: LayersIcon,
    getValue: (summary: GroupSummary) => summary.totalGroups,
  },
  {
    key: "activeGroups",
    title: "Active Groups",
    icon: UserCheckIcon,
    getValue: (summary: GroupSummary) => summary.activeGroups,
  },
  {
    key: "totalAssignedBooks",
    title: "Assigned Books",
    icon: BookOpenIcon,
    getValue: (summary: GroupSummary) => summary.totalAssignedBooks,
  },
  {
    key: "totalAssignedStaff",
    title: "Staff",
    icon: UsersIcon,
    getValue: (summary: GroupSummary) => summary.totalAssignedStaff,
  },
] as const

export function GroupSummaryCards({
  summary,
  isLoading,
}: GroupSummaryCardsProps) {
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

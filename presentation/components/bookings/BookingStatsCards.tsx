import {
  BookmarkIcon,
  BookOpenIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  LogInIcon,
  LogOutIcon,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import type { BookingStats } from "@/domain/entities/booking/Booking"

type BookingStatsCardsProps = {
  stats: BookingStats
}

export function BookingStatsCards({ stats }: BookingStatsCardsProps) {
  const cards = [
    {
      label: "Reserved",
      value: stats.reserved,
      icon: BookmarkIcon,
      className: "bg-amber-100 text-amber-600",
    },
    {
      label: "Borrowed",
      value: stats.borrowed,
      icon: BookOpenIcon,
      className: "bg-sky-100 text-sky-600",
    },
    {
      label: "Returned",
      value: stats.returned,
      icon: CircleCheckIcon,
      className: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: ClockIcon,
      className: "bg-rose-100 text-rose-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: CircleXIcon,
      className: "bg-slate-100 text-slate-600",
    },
    {
      label: "Inside",
      value: stats.inside,
      icon: LogInIcon,
      className: "bg-lime-100 text-lime-600",
    },
    {
      label: "Outside",
      value: stats.outside,
      icon: LogOutIcon,
      className: "bg-teal-100 text-teal-600",
    },
  ]

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-7">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card
            key={card.label}
            className="flex flex-row items-center gap-3 rounded-lg p-4 shadow-sm"
          >
            <div
              className={`flex xl:size-10 size-6 shrink-0 items-center justify-center rounded-full ${card.className}`}
            >
              <Icon className=" xl:size-4 size-2" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {card.label}
              </span>
              <span className="text-lg font-semibold">
                {card.value.toLocaleString()}
              </span>
            </div>
          </Card>
        )
      })}
    </section>
  )
}

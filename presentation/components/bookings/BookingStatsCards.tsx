"use client"

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
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BookingStatsCardsProps = {
  stats: BookingStats
}

type StatCardConfig = {
  labelKey: TranslationKey
  value: number
  icon: typeof BookmarkIcon
  className: string
}

export function BookingStatsCards({ stats }: BookingStatsCardsProps) {
  const { t } = useTranslation()

  const cards: StatCardConfig[] = [
    {
      labelKey: "bookings.stats.reserved",
      value: stats.reserved,
      icon: BookmarkIcon,
      className: "bg-amber-100 text-amber-600",
    },
    {
      labelKey: "bookings.stats.borrowed",
      value: stats.borrowed,
      icon: BookOpenIcon,
      className: "bg-sky-100 text-sky-600",
    },
    {
      labelKey: "bookings.stats.returned",
      value: stats.returned,
      icon: CircleCheckIcon,
      className: "bg-emerald-100 text-emerald-600",
    },
    {
      labelKey: "bookings.stats.overdue",
      value: stats.overdue,
      icon: ClockIcon,
      className: "bg-rose-100 text-rose-600",
    },
    {
      labelKey: "bookings.stats.cancelled",
      value: stats.cancelled,
      icon: CircleXIcon,
      className: "bg-slate-100 text-slate-600",
    },
    {
      labelKey: "bookings.stats.inside",
      value: stats.inside,
      icon: LogInIcon,
      className: "bg-lime-100 text-lime-600",
    },
    {
      labelKey: "bookings.stats.outside",
      value: stats.outside,
      icon: LogOutIcon,
      className: "bg-teal-100 text-teal-600",
    },
  ]

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-7">
      {cards.map((card) => {
        const Icon = card.icon
        const label = t(card.labelKey)

        return (
          <Card
            key={card.labelKey}
            className="flex flex-row items-center gap-3 rounded-lg p-4 shadow-sm"
          >
            <div
              className={`flex size-6 shrink-0 items-center justify-center rounded-full xl:size-10 ${card.className}`}
            >
              <Icon className="size-2 xl:size-4" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {label}
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

"use client"

import {
  BookOpenIcon,
  Building2Icon,
  PackageIcon,
  ShoppingCartIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { BookDetail } from "@/domain/entities/book/BookDetail"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BookSummaryCardsProps = {
  book: BookDetail
}

export function BookSummaryCards({ book }: BookSummaryCardsProps) {
  const { t } = useTranslation()

  const cards = [
    {
      label: t("books.summary.branchesCarrying"),
      value: book.branchCount,
      icon: Building2Icon,
    },
    {
      label: t("books.summary.totalAvailable"),
      value: book.available,
      icon: PackageIcon,
    },
    {
      label: t("books.summary.activeBookings"),
      value: book.activeBookings,
      icon: BookOpenIcon,
    },
    {
      label: t("books.summary.totalSold"),
      value: book.totalSold,
      icon: ShoppingCartIcon,
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="rounded-lg">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <card.icon className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {card.label}
              </span>
              <span className="text-xl font-bold">
                {card.value.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

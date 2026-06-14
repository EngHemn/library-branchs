"use client"

import { BookOpenIcon, LanguagesIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type AuthorSummaryCardsProps = {
  author: AuthorDetail
}

export function AuthorSummaryCards({ author }: AuthorSummaryCardsProps) {
  const { t } = useTranslation()

  const cards = [
    {
      label: t("authors.summary.booksAuthored"),
      value: author.totalBooks,
      icon: BookOpenIcon,
    },
    ...(author.totalBooksTranslated > 0
      ? [
          {
            label: t("authors.summary.booksTranslated"),
            value: author.totalBooksTranslated,
            icon: LanguagesIcon,
          },
        ]
      : []),
  ]

  return (
    <section
      className={
        cards.length > 1
          ? "grid gap-4 sm:grid-cols-2"
          : "grid gap-4 sm:grid-cols-1 max-w-sm"
      }
    >
      {cards.map((card) => (
        <Card key={card.label} className="rounded-lg">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <card.icon className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{card.label}</span>
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

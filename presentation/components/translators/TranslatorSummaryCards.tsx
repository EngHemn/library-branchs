"use client"

import { LanguagesIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type TranslatorSummaryCardsProps = {
  translator: TranslatorDetail
}

export function TranslatorSummaryCards({ translator }: TranslatorSummaryCardsProps) {
  const { t } = useTranslation()

  return (
    <section className="grid gap-4 sm:grid-cols-1 max-w-sm">
      <Card className="rounded-lg">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <LanguagesIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {t("translators.summary.booksTranslated")}
            </span>
            <span className="text-xl font-bold">
              {translator.totalBooks.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

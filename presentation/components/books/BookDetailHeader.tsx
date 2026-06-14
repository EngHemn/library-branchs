"use client"

import {
  ArrowLeftIcon,
  BookIcon,
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { EntityImage } from "@/components/ui/entity-image"
import type { BookDetail } from "@/domain/entities/book/BookDetail"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BookDetailHeaderProps = {
  book: BookDetail
  onBack: () => void
  onCreateBooking: () => void
  onEdit: () => void
}

export function BookDetailHeader({
  book,
  onBack,
  onCreateBooking,
  onEdit,
}: BookDetailHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <EntityImage
        src={book.coverUrl}
        alt={book.title}
        fill
        sizes="96px"
        className="size-20 rounded-lg sm:size-24"
        imageClassName="rounded-lg"
        fallback={<BookIcon className="size-10 text-muted-foreground" />}
      />
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">{book.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {book.description}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" />
            <span>
              {book.shelfHint.trim().length > 0
                ? book.shelfHint
                : t("books.view.noLocationSet")}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon />
            {t("books.view.backToBooksButton")}
          </Button>
          <Button variant="outline" onClick={onCreateBooking}>
            <CalendarIcon />
            {t("books.view.createBooking")}
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <PencilIcon />
            {t("books.view.editBook")}
          </Button>
        </div>
      </div>
    </header>
  )
}

"use client"

import {
  ArrowLeftIcon,
  BookIcon,
  CalendarIcon,
  PencilIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { EntityImage } from "@/components/ui/entity-image"
import type { BookDetail } from "@/domain/entities/book/BookDetail"

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
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon />
            Back to Books
          </Button>
          <Button variant="outline" onClick={onCreateBooking}>
            <CalendarIcon />
            Create Booking
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <PencilIcon />
            Edit Book
          </Button>
        </div>
      </div>
    </header>
  )
}

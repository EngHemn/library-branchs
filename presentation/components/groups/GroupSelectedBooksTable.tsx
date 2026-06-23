"use client"

import { Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { BookStatus } from "@/domain/entities/book/Book"
import type { GroupBookOption } from "@/domain/repositories/GroupRepository"
import {
  formatGroupBookPrice,
  groupBookStatusVariants,
} from "@/presentation/components/groups/groupDisplay"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type GroupSelectedBooksTableProps = {
  bookOptions: GroupBookOption[]
  selectedBookIds: string[]
  onRemoveBook: (bookId: string) => void
  disabled?: boolean
}

export function GroupSelectedBooksTable({
  bookOptions,
  selectedBookIds,
  onRemoveBook,
  disabled = false,
}: GroupSelectedBooksTableProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const bookStatusLabel = (status: BookStatus) =>
    t(`groups.bookStatus.${status}` as TranslationKey)

  const selectedBooks = selectedBookIds
    .map((bookId) => bookOptions.find((book) => book.id === bookId))
    .filter((book): book is GroupBookOption => book !== undefined)

  if (selectedBooks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
        {t("groups.selectedBooks.empty")}
      </p>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("groups.books.title")}</TableHead>
            <TableHead>{t("groups.books.author")}</TableHead>
            <TableHead>{t("groups.books.isbn")}</TableHead>
            <TableHead className="text-center">
              {t("groups.books.stock")}
            </TableHead>
            <TableHead className="text-center">
              {t("groups.books.available")}
            </TableHead>
            <TableHead className="text-center">
              {t("groups.books.price")}
            </TableHead>
            <TableHead>{t("groups.books.availability")}</TableHead>
            <TableHead className="w-16 text-right">
              {t("groups.selectedBooks.remove")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
              <TableCell className="text-center tabular-nums">
                {book.stock.toLocaleString(locale)}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {book.available.toLocaleString(locale)}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {formatGroupBookPrice(book.price, locale)}
              </TableCell>
              <TableCell>
                <Badge variant={groupBookStatusVariants[book.status]}>
                  {bookStatusLabel(book.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  aria-label={t("groups.selectedBooks.removeAria", {
                    title: book.title,
                  })}
                  onClick={() => onRemoveBook(book.id)}
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

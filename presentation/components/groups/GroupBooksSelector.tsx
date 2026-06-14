"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { BookStatus } from "@/domain/entities/book/Book"
import type { GroupBookOption } from "@/domain/repositories/GroupRepository"
import { formatGroupBookPrice } from "@/presentation/components/groups/groupDisplay"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type GroupBooksSelectorProps = {
  bookOptions: GroupBookOption[]
  selectedBookIds: string[]
  onSelectedBookIdsChange: (bookIds: string[]) => void
  disabled?: boolean
}

function matchesBook(book: GroupBookOption, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return (
    book.title.toLowerCase().includes(normalized) ||
    book.isbn.toLowerCase().includes(normalized) ||
    book.author.toLowerCase().includes(normalized)
  )
}

export function GroupBooksSelector({
  bookOptions,
  selectedBookIds,
  onSelectedBookIdsChange,
  disabled = false,
}: GroupBooksSelectorProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [searchQuery, setSearchQuery] = useState("")

  const bookStatusLabel = (status: BookStatus) =>
    t(`groups.bookStatus.${status}` as TranslationKey)

  const filteredBooks = useMemo(
    () => bookOptions.filter((book) => matchesBook(book, searchQuery)),
    [bookOptions, searchQuery]
  )

  function toggleBook(bookId: string, checked: boolean): void {
    if (checked) {
      onSelectedBookIdsChange([...selectedBookIds, bookId])
      return
    }

    onSelectedBookIdsChange(selectedBookIds.filter((id) => id !== bookId))
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t("groups.booksSelector.searchPlaceholder")}
          disabled={disabled}
          className="pl-9"
        />
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-3">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => {
            const isChecked = selectedBookIds.includes(book.id)

            return (
              <label
                key={book.id}
                className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50"
              >
                <Checkbox
                  checked={isChecked}
                  disabled={disabled}
                  onCheckedChange={(checked) =>
                    toggleBook(book.id, checked === true)
                  }
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{book.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {book.author} · {book.isbn}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {t("groups.booksSelector.meta", {
                      stock: book.stock.toLocaleString(locale),
                      available: book.available.toLocaleString(locale),
                      price: formatGroupBookPrice(book.price, locale),
                      status: bookStatusLabel(book.status),
                    })}
                  </span>
                </span>
              </label>
            )
          })
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {searchQuery.trim()
              ? t("groups.booksSelector.noMatch")
              : t("groups.booksSelector.noAvailable")}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {t("groups.booksSelector.selected", { count: selectedBookIds.length })}
      </p>
    </div>
  )
}

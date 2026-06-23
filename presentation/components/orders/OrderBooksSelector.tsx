"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { OrderBookOption } from "@/domain/repositories/OrderManagementRepository"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type OrderBooksSelectorProps = {
  bookOptions: OrderBookOption[]
  selectedBookIds: string[]
  onSelectedBookIdsChange: (bookIds: string[]) => void
  disabled?: boolean
  createBookHref: string
}

function matchesBook(book: OrderBookOption, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return (
    book.title.toLowerCase().includes(normalized) ||
    book.author.toLowerCase().includes(normalized) ||
    book.category.toLowerCase().includes(normalized) ||
    book.id.toLowerCase().includes(normalized)
  )
}

export function OrderBooksSelector({
  bookOptions,
  selectedBookIds,
  onSelectedBookIdsChange,
  disabled = false,
  createBookHref,
}: OrderBooksSelectorProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBooks = useMemo(
    () => bookOptions.filter((book) => matchesBook(book, searchQuery)),
    [bookOptions, searchQuery]
  )

  const hasSearchQuery = searchQuery.trim().length > 0
  const showAddBook =
    bookOptions.length === 0 || (hasSearchQuery && filteredBooks.length === 0)

  function toggleBook(bookId: string, checked: boolean): void {
    if (checked) {
      onSelectedBookIdsChange([...selectedBookIds, bookId])
      return
    }

    onSelectedBookIdsChange(selectedBookIds.filter((id) => id !== bookId))
  }

  function handleAddBook(): void {
    router.push(createBookHref)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t("orders.booksSelector.searchPlaceholder")}
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
                    {book.author}
                    {book.translator
                      ? ` · ${t("orders.booksSelector.translatorPrefix")} ${book.translator}`
                      : ""}{" "}
                    · {book.category}
                  </span>
                </span>
              </label>
            )
          })
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              {hasSearchQuery
                ? t("orders.booksSelector.noMatch")
                : t("orders.booksSelector.noAvailable")}
            </p>
            {showAddBook ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={disabled}
                onClick={handleAddBook}
              >
                <PlusIcon />
                {t("orders.booksSelector.addBook")}
              </Button>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {t("orders.booksSelector.selected", {
            count: selectedBookIds.length,
          })}
          {hasSearchQuery && filteredBooks.length > 0
            ? ` · ${t("orders.booksSelector.shown", { count: filteredBooks.length })}`
            : ""}
        </span>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto px-0"
          disabled={disabled}
          onClick={handleAddBook}
        >
          <PlusIcon className="size-3.5" />
          {t("orders.booksSelector.addNewBook")}
        </Button>
      </div>
    </div>
  )
}

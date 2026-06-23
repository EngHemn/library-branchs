"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { OrderBookOption } from "@/domain/repositories/OrderManagementRepository"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useLocale } from "@/presentation/i18n/useLocale"
import { formatOrderPriceInDinar } from "@/presentation/components/orders/orderDisplay"

export type OrderFormLineItem = {
  bookId: string
  quantity: number
  initialPrice: number
  unitPrice: number
}

type OrderBooksSelectorProps = {
  bookOptions: OrderBookOption[]
  items: OrderFormLineItem[]
  onItemsChange: (items: OrderFormLineItem[]) => void
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
  items,
  onItemsChange,
  disabled = false,
  createBookHref,
}: OrderBooksSelectorProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [searchQuery, setSearchQuery] = useState("")

  const selectedBookIds = useMemo(
    () => items.map((item) => item.bookId),
    [items]
  )

  const filteredBooks = useMemo(
    () => bookOptions.filter((book) => matchesBook(book, searchQuery)),
    [bookOptions, searchQuery]
  )

  const selectedRows = useMemo(
    () =>
      items
        .map((item) => {
          const book = bookOptions.find((option) => option.id === item.bookId)
          return book ? { item, book } : null
        })
        .filter(
          (row): row is { item: OrderFormLineItem; book: OrderBookOption } =>
            row !== null
        ),
    [items, bookOptions]
  )

  const hasSearchQuery = searchQuery.trim().length > 0
  const showAddBook =
    bookOptions.length === 0 || (hasSearchQuery && filteredBooks.length === 0)

  function toggleBook(bookId: string, checked: boolean): void {
    if (checked) {
      const book = bookOptions.find((option) => option.id === bookId)
      if (!book) return

      onItemsChange([
        ...items,
        {
          bookId,
          quantity: 1,
          initialPrice: book.price,
          unitPrice: book.price,
        },
      ])
      return
    }

    onItemsChange(items.filter((item) => item.bookId !== bookId))
  }

  function handleAddBook(): void {
    router.push(createBookHref)
  }

  function updateItem(bookId: string, patch: Partial<OrderFormLineItem>): void {
    onItemsChange(
      items.map((item) =>
        item.bookId === bookId ? { ...item, ...patch } : item
      )
    )
  }

  function updateQuantity(bookId: string, value: string): void {
    const parsed = parseInt(value, 10)
    updateItem(bookId, {
      quantity: Number.isInteger(parsed) && parsed > 0 ? parsed : 1,
    })
  }

  function updateFinalPrice(bookId: string, value: string): void {
    const parsed = Number(value)
    updateItem(bookId, {
      unitPrice: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0,
    })
  }

  return (
    <div className="space-y-4">
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

      {selectedRows.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="border-b bg-muted/40 px-3 py-2 text-sm font-medium">
            {t("bills.booksSelector.selectedTableTitle")}
          </div>
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 text-left text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-3 py-2">{t("orders.items.book")}</th>
                  <th className="px-3 py-2">{t("orders.items.author")}</th>
                  <th className="px-3 py-2">ISBN</th>
                  <th className="px-3 py-2">{t("bills.booksSelector.columns.initialPrice")}</th>
                  <th className="px-3 py-2">{t("bills.booksSelector.columns.finalPrice")}</th>
                  <th className="px-3 py-2">{t("orders.items.quantity")}</th>
                  <th className="px-3 py-2 text-right">{t("orders.items.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map(({ item, book }) => {
                  return (
                    <tr key={book.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{book.title}</td>
                      <td className="px-3 py-2">{book.author}</td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {book.isbn}
                      </td>
                      <td className="px-3 py-2">
                        {formatOrderPriceInDinar(item.initialPrice, locale)}
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={0}
                          step="1"
                          value={item.unitPrice}
                          onChange={(event) =>
                            updateFinalPrice(book.id, event.target.value)
                          }
                          disabled={disabled}
                          className="h-8 w-28"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={1}
                          step="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(book.id, event.target.value)
                          }
                          disabled={disabled}
                          className="h-8 w-20"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            disabled={disabled}
                            title={t("orders.items.viewBook")}
                            onClick={() =>
                              router.push(`/dashboard/books/${book.id}`)
                            }
                          >
                            <EyeIcon className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}

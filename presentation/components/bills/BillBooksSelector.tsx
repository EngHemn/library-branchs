"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  EyeIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { getBillLineFinalPrice } from "@/domain/entities/bill/BillLineItem"
import type { BillBookOption } from "@/domain/repositories/BillManagementRepository"
import type { BillFormLineItem } from "@/domain/schemas/billFormSchema"
import { formatBillPrice } from "@/presentation/components/bills/billDisplay"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BillBooksSelectorProps = {
  bookOptions: BillBookOption[]
  items: BillFormLineItem[]
  onItemsChange: (items: BillFormLineItem[]) => void
  disabled?: boolean
  createBookHref: string
}

function matchesBook(book: BillBookOption, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return (
    book.title.toLowerCase().includes(normalized) ||
    book.isbn.toLowerCase().includes(normalized) ||
    book.id.toLowerCase().includes(normalized)
  )
}

export function BillBooksSelector({
  bookOptions,
  items,
  onItemsChange,
  disabled = false,
  createBookHref,
}: BillBooksSelectorProps) {
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
          (row): row is { item: BillFormLineItem; book: BillBookOption } =>
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
          newPrice: null,
        },
      ])
      return
    }

    onItemsChange(items.filter((item) => item.bookId !== bookId))
  }

  function handleAddBook(): void {
    router.push(createBookHref)
  }

  function updateItem(bookId: string, patch: Partial<BillFormLineItem>): void {
    onItemsChange(
      items.map((item) =>
        item.bookId === bookId ? { ...item, ...patch } : item
      )
    )
  }

  function updateQuantity(
    bookId: string,
    nextQuantity: number,
    maxQuantity: number
  ): void {
    const safeQuantity = Math.min(
      Math.max(nextQuantity, 1),
      Math.max(maxQuantity, 1)
    )
    updateItem(bookId, { quantity: safeQuantity })
  }

  function updateNewPrice(bookId: string, value: string): void {
    if (value.trim() === "") {
      updateItem(bookId, { newPrice: null })
      return
    }

    const parsed = Number(value)
    updateItem(bookId, {
      newPrice: Number.isFinite(parsed) && parsed > 0 ? parsed : null,
    })
  }

  function updateFinalPrice(
    bookId: string,
    value: string,
    quantity: number
  ): void {
    if (value.trim() === "") {
      updateItem(bookId, { newPrice: null })
      return
    }

    const parsed = Number(value)
    updateItem(bookId, {
      newPrice:
        Number.isFinite(parsed) && parsed > 0 ? parsed / quantity : null,
    })
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t("bills.booksSelector.searchPlaceholder")}
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
                    {book.isbn}
                  </span>
                </span>
              </label>
            )
          })
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              {hasSearchQuery
                ? t("bills.booksSelector.noMatch")
                : t("bills.booksSelector.noAvailable")}
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
                {t("bills.booksSelector.addBook")}
              </Button>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {t("bills.booksSelector.selected", { count: selectedBookIds.length })}
          {hasSearchQuery && filteredBooks.length > 0
            ? ` · ${t("bills.booksSelector.shown", { count: filteredBooks.length })}`
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
          {t("bills.booksSelector.addNewBook")}
        </Button>
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
                  <th className="px-3 py-2">
                    {t("bills.booksSelector.columns.title")}
                  </th>
                  <th className="px-3 py-2">
                    {t("bills.booksSelector.columns.isbn")}
                  </th>
                  <th className="px-3 py-2">
                    {t("bills.booksSelector.columns.stock")}
                  </th>
                  <th className="px-3 py-2">
                    {t("bills.booksSelector.columns.initialPrice")}
                  </th>
                  <th className="px-3 py-2">
                    {t("bills.booksSelector.columns.newPrice")}
                  </th>
                  <th className="px-3 py-2">
                    {t("bills.booksSelector.columns.quantity")}
                  </th>
                  <th className="px-3 py-2">
                    {t("bills.booksSelector.columns.finalPrice")}
                  </th>
                  <th className="px-3 py-2 text-right">
                    {t("bills.booksSelector.columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map(({ item, book }) => {
                  const maxQuantity = Math.max(book.stock, 1)
                  const canDecrease = item.quantity > 1
                  const canIncrease = item.quantity < maxQuantity
                  const finalPrice = getBillLineFinalPrice(item)

                  return (
                    <tr key={book.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{book.title}</td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {book.isbn}
                      </td>
                      <td className="px-3 py-2">{book.stock}</td>
                      <td className="px-3 py-2">
                        {formatBillPrice(item.initialPrice, locale)}
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.newPrice ?? ""}
                          onChange={(event) =>
                            updateNewPrice(book.id, event.target.value)
                          }
                          disabled={disabled}
                          placeholder={item.initialPrice.toFixed(2)}
                          className="h-8 w-28"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            disabled={disabled || !canDecrease}
                            onClick={() =>
                              updateQuantity(
                                book.id,
                                item.quantity - 1,
                                maxQuantity
                              )
                            }
                          >
                            <MinusIcon className="size-3.5" />
                          </Button>
                          <span className="min-w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            disabled={disabled || !canIncrease}
                            onClick={() =>
                              updateQuantity(
                                book.id,
                                item.quantity + 1,
                                maxQuantity
                              )
                            }
                          >
                            <PlusIcon className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={
                            item.newPrice != null
                              ? (item.newPrice * item.quantity).toFixed(2)
                              : ""
                          }
                          onChange={(event) =>
                            updateFinalPrice(
                              book.id,
                              event.target.value,
                              item.quantity
                            )
                          }
                          placeholder={(
                            item.initialPrice * item.quantity
                          ).toFixed(2)}
                          disabled={disabled}
                          className="h-8 w-28 font-semibold"
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
                            aria-label={t(
                              "bills.booksSelector.actions.viewBook"
                            )}
                            title={t("bills.booksSelector.actions.viewBook")}
                            onClick={() =>
                              router.push(`/dashboard/books/${book.id}`)
                            }
                          >
                            <EyeIcon className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            disabled={disabled}
                            aria-label={t(
                              "bills.booksSelector.actions.editBook"
                            )}
                            title={t("bills.booksSelector.actions.editBook")}
                            onClick={() =>
                              router.push(`/dashboard/books/${book.id}/edit`)
                            }
                          >
                            <PencilIcon className="size-3.5" />
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

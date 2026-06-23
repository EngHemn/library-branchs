"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useTranslation } from "@/presentation/i18n/useTranslation"

const ADD_BOOK_HREF = "/dashboard/books/create"

export type StockBookOption = {
  id: string
  title: string
  isbn: string
  author: string
}

type StockBookSearchComboboxProps = {
  books: StockBookOption[]
  value: string
  onChange: (bookId: string) => void
  disabled?: boolean
}

function matchesBook(book: StockBookOption, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true

  return (
    book.title.toLowerCase().includes(normalizedQuery) ||
    book.isbn.toLowerCase().includes(normalizedQuery) ||
    book.author.toLowerCase().includes(normalizedQuery)
  )
}

export function StockBookSearchCombobox({
  books,
  value,
  onChange,
  disabled = false,
}: StockBookSearchComboboxProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState("")

  const bookMap = new Map(books.map((book) => [book.id, book]))
  const selectedBook = value ? bookMap.get(value) : undefined
  const comboboxInputValue = inputValue || selectedBook?.title || ""
  const filteredBooks = books.filter((book) =>
    matchesBook(book, comboboxInputValue)
  )
  const hasSearchQuery = comboboxInputValue.trim().length > 0

  function itemToStringLabel(bookId: string): string {
    return bookMap.get(bookId)?.title ?? bookId
  }

  function handleInputValueChange(
    nextInput: string,
    eventDetails?: { reason?: string }
  ): void {
    setInputValue(nextInput)

    if (
      eventDetails?.reason === "input-change" &&
      selectedBook &&
      nextInput.trim().toLowerCase() !== selectedBook.title.trim().toLowerCase()
    ) {
      onChange("")
    }
  }

  function handleValueChange(nextBookId: string | null): void {
    if (!nextBookId) {
      onChange("")
      return
    }

    const book = bookMap.get(nextBookId)
    if (!book) return

    setInputValue(book.title)
    onChange(nextBookId)
  }

  return (
    <Combobox
      value={value || null}
      inputValue={comboboxInputValue}
      onValueChange={handleValueChange}
      onInputValueChange={handleInputValueChange}
      itemToStringLabel={itemToStringLabel}
      filter={null}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={t("stock.bookSearch.placeholder")}
        disabled={disabled}
        className="w-full"
      />
      <ComboboxContent className="z-200 rounded-md border border-border/60 bg-background shadow-sm">
        {filteredBooks.length > 0 ? (
          <ComboboxList>
            {filteredBooks.map((book) => (
              <ComboboxItem key={book.id} value={book.id}>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate">{book.title}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {book.author}
                    {book.isbn ? ` · ${book.isbn}` : ""}
                  </span>
                </div>
              </ComboboxItem>
            ))}
          </ComboboxList>
        ) : hasSearchQuery ? (
          <div className="flex flex-col items-center gap-3 px-3 py-4">
            <p className="text-sm text-muted-foreground">
              {t("stock.bookSearch.noBooksFound")}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onMouseDown={(event) => {
                event.preventDefault()
                router.push(ADD_BOOK_HREF)
              }}
            >
              <PlusIcon className="mr-2 size-4" />
              {t("stock.bookSearch.addNewBook")}
            </Button>
          </div>
        ) : (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            {t("stock.bookSearch.startTyping")}
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  )
}

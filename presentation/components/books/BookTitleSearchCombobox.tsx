"use client"

import { useState } from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import type { Book } from "@/domain/entities/book/Book"

type BookTitleSearchComboboxProps = {
  books: Book[]
  title: string
  onTitleChange: (title: string) => void
  onBookSelect: (bookId: string) => void
  placeholder?: string
  disabled?: boolean
  excludeBookId?: string
}

function matchesBook(book: Book, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true

  return (
    book.title.toLowerCase().includes(normalizedQuery) ||
    book.author.toLowerCase().includes(normalizedQuery) ||
    book.isbn.toLowerCase().includes(normalizedQuery)
  )
}

export function BookTitleSearchCombobox({
  books,
  title,
  onTitleChange,
  onBookSelect,
  placeholder = "Search or enter book title",
  disabled = false,
  excludeBookId,
}: BookTitleSearchComboboxProps) {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const inputValue = title ?? ""

  const bookMap = new Map(books.map((book) => [book.id, book]))
  const searchableBooks = excludeBookId
    ? books.filter((book) => book.id !== excludeBookId)
    : books

  const filteredBooks = searchableBooks.filter((book) =>
    matchesBook(book, inputValue)
  )

  const hasSearchQuery = inputValue.trim().length > 0

  function itemToStringLabel(bookId: string): string {
    return bookMap.get(bookId)?.title ?? bookId
  }

  function handleInputValueChange(
    nextInput: string,
    eventDetails?: { reason?: string }
  ): void {
    onTitleChange(nextInput)

    const selectedBook = selectedBookId ? bookMap.get(selectedBookId) : undefined
    if (
      eventDetails?.reason === "input-change" &&
      selectedBook &&
      nextInput.trim().toLowerCase() !== selectedBook.title.trim().toLowerCase()
    ) {
      setSelectedBookId(null)
    }
  }

  function handleValueChange(nextBookId: string | null): void {
    if (!nextBookId) {
      setSelectedBookId(null)
      return
    }

    const book = bookMap.get(nextBookId)
    if (!book) return

    setSelectedBookId(nextBookId)
    onTitleChange(book.title)
    onBookSelect(nextBookId)
  }

  return (
    <Combobox
      value={selectedBookId}
      inputValue={inputValue}
      onValueChange={handleValueChange}
      onInputValueChange={handleInputValueChange}
      itemToStringLabel={itemToStringLabel}
      filter={null}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={placeholder}
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
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            No existing books found. Continue typing to add a new title.
          </div>
        ) : (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            Start typing to search existing books.
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  )
}

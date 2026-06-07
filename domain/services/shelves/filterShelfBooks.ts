import type { ShelfBook } from "@/domain/entities/shelf/ShelfBook"

export type ShelfBookCategoryFilter = "all" | string
export type ShelfBookLanguageFilter = "all" | string

export type ShelfBookFilterState = {
  searchQuery: string
  categoryFilter: ShelfBookCategoryFilter
  languageFilter: ShelfBookLanguageFilter
}

function getUniqueValues(
  books: ShelfBook[],
  accessor: (book: ShelfBook) => string | null
): string[] {
  const valueSet = new Set<string>()
  for (const book of books) {
    const value = accessor(book)
    if (value) valueSet.add(value)
  }
  return Array.from(valueSet).sort()
}

function matchesShelfBookSearch(
  book: ShelfBook,
  searchQuery: string,
  formatLocation: (book: ShelfBook) => string
): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  if (!normalizedQuery) return true

  const location = formatLocation(book)

  return [book.title, book.author, book.isbn, book.category, location].some(
    (value) => value.toLowerCase().includes(normalizedQuery)
  )
}

export function filterShelfBooks(
  books: ShelfBook[],
  filters: ShelfBookFilterState,
  formatLocation: (book: ShelfBook) => string
): ShelfBook[] {
  return books.filter(
    (book) =>
      matchesShelfBookSearch(book, filters.searchQuery, formatLocation) &&
      (filters.categoryFilter === "all" ||
        book.category === filters.categoryFilter) &&
      (filters.languageFilter === "all" ||
        book.language === filters.languageFilter)
  )
}

export function getShelfBookCategoryOptions(books: ShelfBook[]): string[] {
  return getUniqueValues(books, (book) => book.category)
}

export function getShelfBookLanguageOptions(books: ShelfBook[]): string[] {
  return getUniqueValues(books, (book) => book.language)
}

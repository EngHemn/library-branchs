import type { Shelf } from "@/domain/entities/shelf/Shelf"

import type { ShelfBook } from "@/domain/entities/shelf/ShelfBook"

import type {
  ShelfBookCategoryFilter,
  ShelfBookLanguageFilter,
} from "@/domain/services/shelves/filterShelfBooks"

export type ViewShelfStatus = "loading" | "loaded" | "not-found" | "error"

export type ViewShelfViewModelState = {
  status: ViewShelfStatus

  shelf: Shelf | null

  books: ShelfBook[]

  filteredBooks: ShelfBook[]

  searchQuery: string

  categoryFilter: ShelfBookCategoryFilter

  languageFilter: ShelfBookLanguageFilter

  categoryOptions: string[]

  languageOptions: string[]

  error: string | null

  booksError: string | null

  showBranchField: boolean

  deleteShelfBookDialog: {
    shelfBookId: string

    bookTitle: string
  } | null

  deleteShelfBookError: string | null

  isDeletingShelfBook: boolean

  isLoading: boolean

  isBooksLoading: boolean

  isLoaded: boolean

  isNotFound: boolean

  isError: boolean
}

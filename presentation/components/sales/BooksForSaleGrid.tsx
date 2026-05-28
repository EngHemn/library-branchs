"use client"

import {
  AlertCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"
import { BookSaleCard } from "./BookSaleCard"

type BooksForSaleGridProps = {
  books: SaleBook[]
  booksStatus: "idle" | "loading" | "success" | "error"
  booksError: string | null
  displayedBranch: Branch | null
  shoppingBranch: Branch | null
  isViewingOtherBranch: boolean
  cart: CartItem[]
  searchQuery: string
  languageFilter: string
  categoryFilter: string
  authorFilter: string
  translatorFilter: string
  languages: string[]
  categories: string[]
  authors: string[]
  translators: string[]
  onSearchQueryChange: (q: string) => void
  onLanguageFilterChange: (value: string) => void
  onCategoryFilterChange: (value: string) => void
  onAuthorFilterChange: (value: string) => void
  onTranslatorFilterChange: (value: string) => void
  onAddToCart: (book: SaleBook) => void
  onUpdateQuantity: (bookId: string, qty: number) => void
  onRequestShopFromDisplayedBranch: () => void
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-xl" />
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <BookOpenIcon className="size-12 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

type FilterComboboxProps = {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  allLabel: string
  options: string[]
  widthClassName: string
}

function FilterCombobox({
  value,
  onValueChange,
  placeholder,
  allLabel,
  options,
  widthClassName,
}: FilterComboboxProps) {
  return (
    <Combobox
      value={value}
      onValueChange={(next) => onValueChange((next as string) ?? "all")}
      onInputValueChange={() => undefined}
      filter={null}
    >
      <ComboboxInput
        className={widthClassName}
        placeholder={placeholder}
        disabled={false}
      />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxItem value="all">{allLabel}</ComboboxItem>
          {options.map((option) => (
            <ComboboxItem key={option} value={option}>
              {option}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export function BooksForSaleGrid({
  books,
  booksStatus,
  booksError,
  displayedBranch,
  shoppingBranch,
  isViewingOtherBranch,
  cart,
  searchQuery,
  languageFilter,
  categoryFilter,
  authorFilter,
  translatorFilter,
  languages,
  categories,
  authors,
  translators,
  onSearchQueryChange,
  onLanguageFilterChange,
  onCategoryFilterChange,
  onAuthorFilterChange,
  onTranslatorFilterChange,
  onAddToCart,
  onUpdateQuantity,
  onRequestShopFromDisplayedBranch,
}: BooksForSaleGridProps) {
  function getCartQuantity(bookId: string): number {
    return cart.find((item) => item.book.id === bookId)?.quantity ?? 0
  }

  function handleCartAction(book: SaleBook): void {
    const qty = getCartQuantity(book.id)
    if (qty === 0) {
      onAddToCart(book)
    }
  }

  return (
    <div className="flex flex-1  flex-col">
      <div className="sticky top-0 z-10 flex flex-col gap-2 border-b bg-background p-4">
        {displayedBranch ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{displayedBranch.branchName}</p>
              <p className="text-xs text-muted-foreground">
                {displayedBranch.address}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">All branches catalog</p>
              <p className="text-xs text-muted-foreground">
                Browse all books first, then choose a shopping branch to add items to cart.
              </p>
            </div>
          </div>
        )}
        {/* card of viewing other branch */}
        {isViewingOtherBranch && shoppingBranch && displayedBranch && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950/30">
            <div className="flex items-center gap-1.5">
              <AlertCircleIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="text-xs text-amber-800 dark:text-amber-200">
                Browsing <strong>{displayedBranch.branchName}</strong> — shopping
                from <strong>{shoppingBranch.branchName}</strong>
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-6 gap-1 border-amber-300 px-2 text-[11px] text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200"
              onClick={onRequestShopFromDisplayedBranch}
            >
              Switch to shop here
              <ArrowRightIcon className="size-3" />
            </Button>
          </div>
        )}

        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search books by title, author or category…"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterCombobox
            value={languageFilter}
            onValueChange={onLanguageFilterChange}
            placeholder="Language"
            allLabel="All Languages"
            options={languages}
            widthClassName="w-[150px]"
          />
          <FilterCombobox
            value={categoryFilter}
            onValueChange={onCategoryFilterChange}
            placeholder="Category"
            allLabel="All Categories"
            options={categories}
            widthClassName="w-[170px]"
          />
          <FilterCombobox
            value={authorFilter}
            onValueChange={onAuthorFilterChange}
            placeholder="Author"
            allLabel="All Authors"
            options={authors}
            widthClassName="w-[180px]"
          />
          <FilterCombobox
            value={translatorFilter}
            onValueChange={onTranslatorFilterChange}
            placeholder="Translator"
            allLabel="All Translators"
            options={translators}
            widthClassName="w-[180px]"
          />
        </div>
      </div>

      {booksStatus === "loading" && <LoadingGrid />}

      {booksStatus === "error" && booksError && (
        <div className="m-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircleIcon className="size-4 shrink-0" />
          {booksError}
        </div>
      )}

      {booksStatus === "success" && books.length === 0 && (
        <EmptyState message="No books available in this branch." />
      )}

      {booksStatus === "success" && books.length > 0 && (
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          {books.map((book) => {
            const qty = getCartQuantity(book.id)
            return (
              <BookSaleCard
                key={book.id}
                book={book}
                cartQuantity={qty}
                isShoppingBranch={!shoppingBranch || !isViewingOtherBranch}
                onAdd={() => handleCartAction(book)}
                onUpdateQuantity={(newQty) =>
                  onUpdateQuantity(book.id, newQty)
                }
              />
            )
          })}
        </div>
      )}

      {booksStatus === "success" && books.length === 0 && searchQuery && (
        <EmptyState
          message={`No books matched "${searchQuery}". Try a different search.`}
        />
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PowerOffIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { EntityImage } from "@/components/ui/entity-image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import type { Author } from "@/domain/entities/author/Author"
import type { Book, BookStatus } from "@/domain/entities/book/Book"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import type { Translator } from "@/domain/entities/translator/Translator"
import { getAuthorViewHref } from "@/lib/authorLink"
import { getTranslatorViewHref } from "@/lib/translatorLink"
import { CategoryDetailDialog } from "@/presentation/components/books/CategoryDetailDialog"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"

type BooksTabProps = {
  books: Book[]
  branchAuthors?: Author[]
  branchTranslators?: Translator[]
  permissions: BranchPermissions
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onView: (book: Book) => void
  onEdit: (book: Book) => void
  onDelete: (book: Book) => void
  onToggleStatus: (book: Book) => void
}

type BookColumnKey =
  | "cover"
  | "title"
  | "category"
  | "author"
  | "translator"
  | "isbn"
  | "stock"
  | "available"
  | "status"
  | "actions"

type BookFilter = "all" | string

const bookStatusLabels: Record<BookStatus, string> = {
  available: "Available",
  borrowed: "Borrowed",
  reserved: "Reserved",
  unavailable: "Unavailable",
}

const bookStatusVariants: Record<
  BookStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  borrowed: "secondary",
  reserved: "outline",
  unavailable: "destructive",
}

function getUniqueValues(
  books: Book[],
  getValue: (book: Book) => string | null
): string[] {
  const values = new Set<string>()

  for (const book of books) {
    const value = getValue(book)
    if (value) {
      values.add(value)
    }
  }

  return Array.from(values).sort((a, b) => a.localeCompare(b))
}

type FilterComboboxProps = {
  value: BookFilter
  onValueChange: (value: BookFilter) => void
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
      onValueChange={(next) => onValueChange(next ?? "all")}
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

function resolveAuthorHref(name: string, branchAuthors: Author[]): string | null {
  const branchMatch = branchAuthors.find((author) => author.name === name)
  if (branchMatch) {
    return `/dashboard/authors/${branchMatch.id}`
  }

  return getAuthorViewHref(name)
}

function resolveTranslatorHref(
  name: string,
  branchTranslators: Translator[]
): string | null {
  const branchMatch = branchTranslators.find(
    (translator) => translator.name === name
  )
  if (branchMatch) {
    return `/dashboard/translators/${branchMatch.id}`
  }

  return getTranslatorViewHref(name)
}

function PersonNameButton({
  name,
  href,
  onNavigate,
}: {
  name: string
  href: string | null
  onNavigate: (href: string) => void
}) {
  if (!href) {
    return <span>{name}</span>
  }

  return (
    <button
      type="button"
      onClick={() => onNavigate(href)}
      className="font-medium text-primary underline-offset-4 hover:underline"
    >
      {name}
    </button>
  )
}

export function BooksTab({
  books,
  branchAuthors = [],
  branchTranslators = [],
  permissions,
  searchQuery,
  onSearchQueryChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: BooksTabProps) {
  const router = useRouter()
  const [categoryFilter, setCategoryFilter] = useState<BookFilter>("all")
  const [authorFilter, setAuthorFilter] = useState<BookFilter>("all")
  const [translatorFilter, setTranslatorFilter] = useState<BookFilter>("all")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = getUniqueValues(books, (book) => book.category)
  const authorOptions = getUniqueValues(books, (book) => book.author)
  const translatorOptions = getUniqueValues(books, (book) => book.translator)

  const filteredBooks = books.filter(
    (book) =>
      (categoryFilter === "all" || book.category === categoryFilter) &&
      (authorFilter === "all" || book.author === authorFilter) &&
      (translatorFilter === "all" ||
        (book.translator ?? "") === translatorFilter)
  )

  const selectedCategoryBookCount = selectedCategory
    ? books.filter((book) => book.category === selectedCategory).length
    : 0

  const navigateTo = (href: string) => {
    router.push(href)
  }

  const columns: DataTableColumn<Book, BookColumnKey>[] = [
    {
      key: "cover",
      header: "Cover",
      cell: (b) => (
        <EntityImage
          src={b.coverUrl}
          alt={b.title}
          width={40}
          height={40}
          className="size-10 rounded-md"
          imageClassName="rounded-md"
          fallback={
            <span className="text-xs text-muted-foreground">N/A</span>
          }
        />
      ),
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortValue: (b) => b.title,
      cell: (b) => <span className="font-medium">{b.title}</span>,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      sortValue: (b) => b.category,
      cell: (b) => (
        <button
          type="button"
          onClick={() => setSelectedCategory(b.category)}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {b.category}
        </button>
      ),
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      sortValue: (b) => b.author,
      cell: (b) => (
        <PersonNameButton
          name={b.author}
          href={resolveAuthorHref(b.author, branchAuthors)}
          onNavigate={navigateTo}
        />
      ),
    },
    {
      key: "translator",
      header: "Translator",
      cell: (b) =>
        b.translator ? (
          <PersonNameButton
            name={b.translator}
            href={resolveTranslatorHref(b.translator, branchTranslators)}
            onNavigate={navigateTo}
          />
        ) : (
          "-"
        ),
    },
    {
      key: "isbn",
      header: "ISBN",
      cell: (b) => <span className="font-mono text-xs">{b.isbn}</span>,
    },
    {
      key: "stock",
      header: "Stock",
      sortable: true,
      sortValue: (b) => b.stock,
      cell: (b) => b.stock.toLocaleString(),
    },
    {
      key: "available",
      header: "Available",
      sortable: true,
      sortValue: (b) => b.available,
      cell: (b) => b.available.toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (b) => bookStatusLabels[b.status],
      cell: (b) => (
        <Badge variant={bookStatusVariants[b.status]}>
          {bookStatusLabels[b.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (b) => {
        const toggleLabel =
          b.status === "available" ? "Deactivate" : "Activate"
        const ToggleIcon =
          b.status === "available" ? PowerOffIcon : PowerIcon

        return (
          <div className="flex justify-end gap-1">
            <BranchActionButton
              icon={EyeIcon}
              label="View"
              onClick={() => onView(b)}
            />
            {permissions.canManageBooks ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label="Edit"
                  onClick={() => onEdit(b)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label="Delete"
                  variant="destructive"
                  onClick={() => onDelete(b)}
                />
                <BranchActionButton
                  icon={ToggleIcon}
                  label={toggleLabel}
                  onClick={() => onToggleStatus(b)}
                />
              </>
            ) : null}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <Card className="rounded-lg">
        <CardHeader className="gap-4 space-y-0">
          <CardTitle>Books</CardTitle>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterCombobox
                value={categoryFilter}
                onValueChange={setCategoryFilter}
                placeholder="Category"
                allLabel="All Categories"
                options={categories}
                widthClassName="w-[170px]"
              />
              <FilterCombobox
                value={authorFilter}
                onValueChange={setAuthorFilter}
                placeholder="Author"
                allLabel="All Authors"
                options={authorOptions}
                widthClassName="w-[180px]"
              />
              <FilterCombobox
                value={translatorFilter}
                onValueChange={setTranslatorFilter}
                placeholder="Translator"
                allLabel="All Translators"
                options={translatorOptions}
                widthClassName="w-[180px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredBooks}
            columns={columns}
            getRowId={(b) => b.id}
            emptyTitle="No books found"
            emptyDescription="This branch does not have any books yet."
            initialSort={{ key: "title", direction: "asc" }}
            initialPageSize={5}
            tableClassName="min-w-[1100px]"
          />
        </CardContent>
      </Card>

      <CategoryDetailDialog
        categoryName={selectedCategory}
        bookCount={selectedCategoryBookCount}
        open={selectedCategory !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCategory(null)
          }
        }}
      />
    </>
  )
}

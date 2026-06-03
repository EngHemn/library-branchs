"use client"

import { useRouter } from "next/navigation"
import {
  BookIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { EntityImage } from "@/components/ui/entity-image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import type { Book } from "@/domain/entities/book/Book"
import { getAuthorViewHref } from "@/lib/authorLink"
import { getTranslatorViewHref } from "@/lib/translatorLink"
import { BookActionButton } from "@/presentation/components/books/BookActionButton"

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
    return <span className="font-medium">{name}</span>
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

type BooksTableProps = {
  books: Book[]
  onView: (book: Book) => void
  onBooking: (book: Book) => void
  onEdit: (book: Book) => void
  onDelete: (book: Book) => void
}

type BookColumnKey =
  | "title"
  | "author"
  | "translator"
  | "category"
  | "branches"
  | "actions"

export function BooksTable({
  books,
  onView,
  onBooking,
  onEdit,
  onDelete,
}: BooksTableProps) {
  const router = useRouter()

  const navigateTo = (href: string) => {
    router.push(href)
  }

  const columns: DataTableColumn<Book, BookColumnKey>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortValue: (book) => book.title,
      cell: (book) => (
        <div className="flex items-center gap-3">
          <EntityImage
            src={book.coverUrl}
            alt={book.title}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-md"
            imageClassName="rounded-md"
            fallback={<BookIcon className="size-5 text-muted-foreground" />}
          />
          <div className="min-w-0">
            <span className="font-medium">{book.title}</span>
            <span className="block text-xs text-muted-foreground">
              {book.language}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      sortValue: (book) => book.author,
      cell: (book) => (
        <PersonNameButton
          name={book.author}
          href={getAuthorViewHref(book.author)}
          onNavigate={navigateTo}
        />
      ),
    },
    {
      key: "translator",
      header: "Translator",
      cell: (book) =>
        book.translator ? (
          <PersonNameButton
            name={book.translator}
            href={getTranslatorViewHref(book.translator)}
            onNavigate={navigateTo}
          />
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      sortValue: (book) => book.category,
      cell: (book) => book.category,
    },
    {
      key: "branches",
      header: "Branches",
      sortable: true,
      sortValue: (book) => book.branchCount,
      cell: (book) => (
        <Badge
          variant="secondary"
          className="size-6 justify-center rounded-full p-0 text-xs"
        >
          {book.branchCount}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-left",
      className: "text-right",
      cell: (book) => (
        <div className="flex flex-row items-end gap-1">
          <div className="flex gap-1">
            <BookActionButton
              icon={EyeIcon}
              label="View Book"

              variant="outline"
              onClick={() => onView(book)}
            />
            <BookActionButton
              icon={CalendarIcon}
              variant="outline"
              label="Book / Reserve"
              onClick={() => onBooking(book)}
            />
          </div>
          <div className="flex gap-1">
            <BookActionButton
              icon={PencilIcon}
              label="Edit Book"
              variant="outline"
              onClick={() => onEdit(book)}
            />
            <BookActionButton
              icon={Trash2Icon}
              label="Delete Book"
              variant="destructive"
              onClick={() => onDelete(book)}
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>All Books</CardTitle>
        <CardDescription>
          {books.length.toLocaleString()} book records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={books}
          columns={columns}
          getRowId={(book) => book.id}
          emptyTitle="No books found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "title", direction: "asc" }}
          initialPageSize={10}
          tableClassName=""
        />
      </CardContent>
    </Card>
  )
}

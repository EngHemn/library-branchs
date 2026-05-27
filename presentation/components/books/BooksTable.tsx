"use client"

import {
  BookIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import { BookActionButton } from "@/presentation/components/books/BookActionButton"

type BooksTableProps = {
  books: Book[]
  onView: (book: Book) => void
  onBooking: (book: Book) => void
  onEdit: (book: Book) => void
  onDelete: (book: Book) => void
}

type BookColumnKey =
  | "cover"
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
  const columns: DataTableColumn<Book, BookColumnKey>[] = [
    {
      key: "cover",
      header: "Cover",
      cell: () => (
        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
          <BookIcon className="size-5 text-muted-foreground" />
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortValue: (book) => book.title,
      cell: (book) => (
        <div className="flex flex-col">
          <span className="font-medium">{book.title}</span>
          <span className="text-xs text-muted-foreground">
            {book.language}
          </span>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      sortValue: (book) => book.author,
      cell: (book) => (
        <div className="flex flex-col">
          <span className="font-medium">{book.author}</span>
        </div>
      ),
    },
    {
      key: "translator",
      header: "Translator",
      cell: (book) => (
        <div className="flex flex-col">
          <span className={book.translator ? "font-medium" : "text-muted-foreground" + "text-xs text-center"}>
            {book.translator ?? "—"}
          </span>
        </div>
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
              onClick={() => onView(book)}
            />
            <BookActionButton
              icon={CalendarIcon}
              label="Book / Reserve"
              onClick={() => onBooking(book)}
            />
          </div>
          <div className="flex gap-1">
            <BookActionButton
              icon={PencilIcon}
              label="Edit Book"
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

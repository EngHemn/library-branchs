"use client"

import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"

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
import { Skeleton } from "@/components/ui/skeleton"
import type { ShelfBook } from "@/domain/entities/shelf/ShelfBook"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"
import { ShelfActionButton } from "@/presentation/components/shelves/ShelfActionButton"

type ShelfBooksTableProps = {
  books: ShelfBook[]
  isLoading?: boolean
  onView: (book: ShelfBook) => void
  onEdit: (book: ShelfBook) => void
  onDelete: (book: ShelfBook) => void
}

type ShelfBookColumnKey =
  | "title"
  | "author"
  | "category"
  | "language"
  | "isbn"
  | "location"
  | "quantity"
  | "actions"

export function ShelfBooksTable({
  books,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: ShelfBooksTableProps) {
  const columns: DataTableColumn<ShelfBook, ShelfBookColumnKey>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortValue: (book) => book.title,
      cell: (book) => <span className="font-medium">{book.title}</span>,
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      sortValue: (book) => book.author,
      cell: (book) => book.author,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      sortValue: (book) => book.category,
      cell: (book) => book.category,
    },
    {
      key: "language",
      header: "Language",
      sortable: true,
      sortValue: (book) => book.language,
      cell: (book) => book.language,
    },
    {
      key: "isbn",
      header: "ISBN",
      sortable: true,
      sortValue: (book) => book.isbn,
      cell: (book) => (
        <span className="font-mono text-xs text-muted-foreground">
          {book.isbn}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
      sortValue: (book) => formatShelfLocationParts(book.locationParts),
      cell: (book) => (
        <span className="text-sm text-muted-foreground">
          {formatShelfLocationParts(book.locationParts)}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Qty",
      sortable: true,
      sortValue: (book) => book.quantity,
      cell: (book) => book.quantity.toLocaleString(),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (book) => (
        <div className="flex justify-end gap-1">
          <ShelfActionButton
            icon={EyeIcon}
            label="View"
            variant="outline"
            onClick={() => onView(book)}
          />
          <ShelfActionButton
            icon={PencilIcon}
            label="Edit"
            variant="outline"
            onClick={() => onEdit(book)}
          />
          <ShelfActionButton
            icon={Trash2Icon}
            label="Remove"
            variant="destructive"
            onClick={() => onDelete(book)}
          />
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <Card className="rounded-lg">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Books on Shelf</CardTitle>
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
          tableClassName="min-w-[1020px]"
        />
      </CardContent>
    </Card>
  )
}

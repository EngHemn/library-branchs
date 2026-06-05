"use client"

import { Badge } from "@/components/ui/badge"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import type { EventBranchBook } from "@/domain/entities/event/EventBranchBook"
import {
  AuthorLink,
  BookLink,
  TranslatorLink,
} from "@/presentation/components/shared/DashboardEntityLink"

type EventBranchBooksTableProps = {
  books: EventBranchBook[]
  isLoading: boolean
}

type EventBranchBookColumnKey =
  | "title"
  | "author"
  | "translator"
  | "category"
  | "language"
  | "quantityAllocated"
  | "quantityOnDisplay"

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-11 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function EventBranchBooksTable({
  books,
  isLoading,
}: EventBranchBooksTableProps) {
  const columns: DataTableColumn<EventBranchBook, EventBranchBookColumnKey>[] =
    [
      {
        key: "title",
        header: "Title",
        sortable: true,
        sortValue: (book) => book.title,
        cell: (book) => (
          <div>
            <BookLink bookId={book.bookId} title={book.title} />
            <div className="text-xs text-muted-foreground">{book.isbn}</div>
          </div>
        ),
      },
      {
        key: "author",
        header: "Author",
        sortable: true,
        sortValue: (book) => book.author,
        cell: (book) => <AuthorLink name={book.author} />,
      },
      {
        key: "translator",
        header: "Translator",
        sortable: true,
        sortValue: (book) => book.translator ?? "",
        cell: (book) => <TranslatorLink name={book.translator} />,
      },
      {
        key: "category",
        header: "Category",
        sortable: true,
        sortValue: (book) => book.category,
        cell: (book) => <Badge variant="secondary">{book.category}</Badge>,
      },
      {
        key: "language",
        header: "Language",
        sortable: true,
        sortValue: (book) => book.language,
        cell: (book) => book.language,
      },
      {
        key: "quantityAllocated",
        header: "Allocated",
        sortable: true,
        sortValue: (book) => book.quantityAllocated,
        headerClassName: "text-right",
        className: "text-right tabular-nums",
        cell: (book) => book.quantityAllocated.toLocaleString(),
      },
      {
        key: "quantityOnDisplay",
        header: "On display",
        sortable: true,
        sortValue: (book) => book.quantityOnDisplay,
        headerClassName: "text-right",
        className: "text-right tabular-nums",
        cell: (book) => book.quantityOnDisplay.toLocaleString(),
      },
    ]

  if (isLoading) {
    return <TableSkeleton />
  }

  return (
    <DataTable
      data={books}
      columns={columns}
      getRowId={(book) => book.id}
      emptyTitle="No books found"
      emptyDescription="Try adjusting your search or filters."
      initialSort={{ key: "title", direction: "asc" }}
      initialPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      tableClassName="min-w-[760px]"
    />
  )
}

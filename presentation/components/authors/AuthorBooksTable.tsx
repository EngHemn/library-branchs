"use client"

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
import type { BookStatus } from "@/domain/entities/book/Book"
import type { AuthorBookItem } from "@/domain/entities/author/AuthorDetail"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type AuthorBooksTableProps = {
  title: string
  description: string
  books: AuthorBookItem[]
  showAuthorColumn?: boolean
  emptyDescription: string
}

type AuthorBookColumnKey =
  | "title"
  | "author"
  | "isbn"
  | "language"
  | "category"
  | "branch"
  | "status"

const bookStatusVariants: Record<
  BookStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  borrowed: "secondary",
  reserved: "outline",
  unavailable: "destructive",
}

export function AuthorBooksTable({
  title,
  description,
  books,
  showAuthorColumn = false,
  emptyDescription,
}: AuthorBooksTableProps) {
  const { t } = useTranslation()

  const bookStatusLabel = (status: BookStatus) =>
    t(`authors.books.statuses.${status}`)

  const columns: DataTableColumn<AuthorBookItem, AuthorBookColumnKey>[] = [
    {
      key: "title",
      header: t("authors.books.title"),
      sortable: true,
      sortValue: (book) => book.title,
      cell: (book) => <span className="font-medium">{book.title}</span>,
    },
    ...(showAuthorColumn
      ? [
          {
            key: "author" as const,
            header: t("authors.books.author"),
            sortable: true,
            sortValue: (book: AuthorBookItem) => book.author,
            cell: (book: AuthorBookItem) => book.author,
          },
        ]
      : []),
    {
      key: "isbn",
      header: t("authors.books.isbn"),
      sortable: true,
      sortValue: (book) => book.isbn,
      cell: (book) => (
        <span className="font-mono text-xs text-muted-foreground">
          {book.isbn}
        </span>
      ),
    },
    {
      key: "language",
      header: t("authors.books.language"),
      sortable: true,
      sortValue: (book) => book.language,
      cell: (book) => book.language,
    },
    {
      key: "category",
      header: t("authors.books.category"),
      sortable: true,
      sortValue: (book) => book.category,
      cell: (book) => book.category,
    },
    {
      key: "branch",
      header: t("authors.books.branch"),
      sortable: true,
      sortValue: (book) => book.firstAddedBranch,
      cell: (book) => book.firstAddedBranch,
    },
    {
      key: "status",
      header: t("authors.books.status"),
      sortable: true,
      sortValue: (book) => bookStatusLabel(book.status),
      cell: (book) => (
        <Badge variant={bookStatusVariants[book.status]}>
          {bookStatusLabel(book.status)}
        </Badge>
      ),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={books}
          columns={columns}
          getRowId={(book) => book.id}
          emptyTitle={t("authors.books.emptyTitle")}
          emptyDescription={emptyDescription}
          initialSort={{ key: "title", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[800px]"
        />
      </CardContent>
    </Card>
  )
}

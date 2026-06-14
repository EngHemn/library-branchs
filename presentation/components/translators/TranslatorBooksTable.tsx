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
import type { TranslatorBookItem } from "@/domain/entities/translator/TranslatorDetail"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type TranslatorBooksTableProps = {
  title: string
  description: string
  books: TranslatorBookItem[]
  emptyDescription: string
}

type TranslatorBookColumnKey =
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

export function TranslatorBooksTable({
  title,
  description,
  books,
  emptyDescription,
}: TranslatorBooksTableProps) {
  const { t } = useTranslation()

  const bookStatusLabel = (status: BookStatus) =>
    t(`translators.books.statuses.${status}`)

  const columns: DataTableColumn<TranslatorBookItem, TranslatorBookColumnKey>[] = [
    {
      key: "title",
      header: t("translators.books.title"),
      sortable: true,
      sortValue: (book) => book.title,
      cell: (book) => <span className="font-medium">{book.title}</span>,
    },
    {
      key: "author",
      header: t("translators.books.author"),
      sortable: true,
      sortValue: (book) => book.author,
      cell: (book) => book.author,
    },
    {
      key: "isbn",
      header: t("translators.books.isbn"),
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
      header: t("translators.books.language"),
      sortable: true,
      sortValue: (book) => book.language,
      cell: (book) => book.language,
    },
    {
      key: "category",
      header: t("translators.books.category"),
      sortable: true,
      sortValue: (book) => book.category,
      cell: (book) => book.category,
    },
    {
      key: "branch",
      header: t("translators.books.branch"),
      sortable: true,
      sortValue: (book) => book.firstAddedBranch,
      cell: (book) => book.firstAddedBranch,
    },
    {
      key: "status",
      header: t("translators.books.status"),
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
          emptyTitle={t("translators.books.emptyTitle")}
          emptyDescription={emptyDescription}
          initialSort={{ key: "title", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[800px]"
        />
      </CardContent>
    </Card>
  )
}

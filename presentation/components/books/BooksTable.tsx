"use client"

import { useRouter } from "next/navigation"
import {
  BookIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

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
import { BookActionButton } from "@/presentation/components/books/BookActionButton"
import { BookLocationCell } from "@/presentation/components/books/BookLocationCell"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
    return (
      <span className="block max-w-[9rem] truncate font-medium">{name}</span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onNavigate(href)}
      className="block max-w-[9rem] truncate text-start font-medium text-primary underline-offset-4 hover:underline"
    >
      {name}
    </button>
  )
}

function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(price)
  return `${formatted} IQD`
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
  | "category"
  | "location"
  | "inventory"
  | "price"
  | "actions"

export function BooksTable({
  books,
  onView,
  onBooking,
  onEdit,
  onDelete,
}: BooksTableProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const navigateTo = (href: string) => {
    router.push(href)
  }

  const columns: DataTableColumn<Book, BookColumnKey>[] = [
    {
      key: "title",
      header: t("books.table.titleColumn"),
      sortable: true,
      sortValue: (book) => book.title,
      className: "w-[28%] max-w-0",
      cell: (book) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <EntityImage
            src={book.coverUrl}
            alt={book.title}
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-md"
            imageClassName="rounded-md"
            fallback={<BookIcon className="size-4 text-muted-foreground" />}
          />
          <div className="min-w-0">
            <span className="block truncate font-medium">{book.title}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {book.language}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: t("books.table.author"),
      sortable: true,
      sortValue: (book) => book.author,
      className: "w-[14%] max-w-0",
      cell: (book) => (
        <PersonNameButton
          name={book.author}
          href={getAuthorViewHref(book.author)}
          onNavigate={navigateTo}
        />
      ),
    },
    {
      key: "category",
      header: t("books.table.category"),
      sortable: true,
      sortValue: (book) => book.category,
      className: "w-[12%] max-w-0",
      cell: (book) => (
        <span className="block truncate text-sm">{book.category}</span>
      ),
    },
    {
      key: "location",
      header: t("books.table.location"),
      sortable: true,
      sortValue: (book) => book.shelfHint,
      className: "w-[18%] max-w-0 whitespace-normal",
      cell: (book) => <BookLocationCell shelfHint={book.shelfHint} />,
    },
    {
      key: "inventory",
      header: t("books.table.inventory"),
      sortable: true,
      sortValue: (book) => book.available,
      headerClassName: "text-center",
      className: "w-[10%] text-center tabular-nums",
      cell: (book) => (
        <span className="text-sm">
          {book.available.toLocaleString()}
          <span className="text-muted-foreground">
            {" "}
            / {book.stock.toLocaleString()}
          </span>
        </span>
      ),
    },
    {
      key: "price",
      header: t("books.table.price"),
      sortable: true,
      sortValue: (book) => book.price,
      headerClassName: "text-center",
      className: "w-[10%] text-center tabular-nums",
      cell: (book) => formatPrice(book.price),
    },
    {
      key: "actions",
      header: t("books.table.actions"),
      headerClassName: "text-right",
      className: "w-[8%] text-right",
      cell: (book) => (
        <div className="table-action-content gap-0.5">
          <BookActionButton
            icon={EyeIcon}
            label={t("books.table.viewBook")}
            variant="outline"
            onClick={() => onView(book)}
          />
          <BookActionButton
            icon={CalendarIcon}
            variant="outline"
            label={t("books.table.bookReserve")}
            onClick={() => onBooking(book)}
          />
          <BookActionButton
            icon={PencilIcon}
            label={t("books.table.editBook")}
            variant="outline"
            onClick={() => onEdit(book)}
          />
          <BookActionButton
            icon={Trash2Icon}
            label={t("books.table.deleteBook")}
            variant="destructive"
            onClick={() => onDelete(book)}
          />
        </div>
      ),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("books.table.title")}</CardTitle>
        <CardDescription>
          {t("books.table.recordCount", { count: books.length.toLocaleString() })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={books}
          columns={columns}
          getRowId={(book) => book.id}
          emptyTitle={t("books.table.emptyTitle")}
          emptyDescription={t("books.table.emptyDescription")}
          initialSort={{ key: "title", direction: "asc" }}
          initialPageSize={10}
          tableClassName="table-fixed"
        />
      </CardContent>
    </Card>
  )
}

"use client"

import {
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PowerOffIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import type { Book, BookStatus } from "@/domain/entities/book/Book"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"

type BooksTabProps = {
  books: Book[]
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

const bookStatusLabels: Record<BookStatus, string> = {
  available: "Available",
  borrowed: "Borrowed",
  reserved: "Reserved",
  unavailable: "Unavailable",
}

const bookStatusVariants: Record<BookStatus, "default" | "secondary" | "outline" | "destructive"> = {
  available: "default",
  borrowed: "secondary",
  reserved: "outline",
  unavailable: "destructive",
}

export function BooksTab({
  books,
  permissions,
  searchQuery,
  onSearchQueryChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: BooksTabProps) {
  const columns: DataTableColumn<Book, BookColumnKey>[] = [
    {
      key: "cover",
      header: "Cover",
      cell: (b) => (
        <div className="flex size-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
          {b.coverUrl ? (
            <img
              src={b.coverUrl}
              alt={b.title}
              className="size-10 rounded object-cover"
            />
          ) : (
            "N/A"
          )}
        </div>
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
      cell: (b) => b.category,
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      sortValue: (b) => b.author,
      cell: (b) => b.author,
    },
    {
      key: "translator",
      header: "Translator",
      cell: (b) => b.translator ?? "-",
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
    <Card className="rounded-lg">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>Books</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={books}
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
  )
}

"use client"

import { EyeIcon, PencilIcon, Trash2Icon, UserRoundIcon } from "lucide-react"

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
import type { Author } from "@/domain/entities/author/Author"
import { AuthorActionButton } from "@/presentation/components/authors/AuthorActionButton"

type AuthorsTableProps = {
  authors: Author[]
  onView: (author: Author) => void
  onEdit: (author: Author) => void
  onDelete: (author: Author) => void
}

type AuthorColumnKey =
  | "name"
  | "nationality"
  | "dateOfBirth"
  | "totalBooks"
  | "status"
  | "actions"

const statusLabels = {
  active: "active",
  inactive: "inactive",
}

export function AuthorsTable({
  authors,
  onView,
  onEdit,
  onDelete,
}: AuthorsTableProps) {
  const columns: DataTableColumn<Author, AuthorColumnKey>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (author) => author.name,
      cell: (author) => (
        <div className="flex items-center gap-3">
          <EntityImage
            src={author.imageUrl}
            alt={author.name}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full"
            imageClassName="rounded-full"
            fallback={
              <UserRoundIcon className="size-5 text-muted-foreground" />
            }
          />
          <span className="font-semibold">{author.name}</span>
        </div>
      ),
    },
    {
      key: "nationality",
      header: "Nationality",
      sortable: true,
      sortValue: (author) => author.nationality,
      cell: (author) => author.nationality,
    },
    {
      key: "dateOfBirth",
      header: "Date of Birth",
      sortable: true,
      sortValue: (author) => author.dateOfBirth,
      cell: (author) => author.dateOfBirth,
    },
    {
      key: "totalBooks",
      header: "Books Count",
      sortable: true,
      sortValue: (author) => author.totalBooks,
      cell: (author) => (
        <Badge
          variant="secondary"
          className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
        >
          Authored {author.totalBooks}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (author) => statusLabels[author.status],
      cell: (author) => (
        <Badge
          variant="outline"
          className={
            author.status === "active"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
              : "border-muted bg-muted text-muted-foreground"
          }
        >
          {statusLabels[author.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (author) => (
        <div className="flex justify-end gap-1">
          <AuthorActionButton
            icon={EyeIcon}
            label="View"
            variant="outline"
            onClick={() => onView(author)}
          />
          <AuthorActionButton
            icon={PencilIcon}
            label="Edit"
            variant="outline"
            onClick={() => onEdit(author)}
          />
          <AuthorActionButton
            icon={Trash2Icon}
            label="Delete"
            variant="destructive"
            onClick={() => onDelete(author)}
          />
        </div>
      ),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>All Authors</CardTitle>
        <CardDescription>
          {authors.length.toLocaleString()} author records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={authors}
          columns={columns}
          getRowId={(author) => author.id}
          emptyTitle="No authors found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[900px]"
        />
      </CardContent>
    </Card>
  )
}

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
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import type { Author } from "@/domain/entities/author/Author"
import { AuthorActionButton } from "@/presentation/components/authors/AuthorActionButton"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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

export function AuthorsTable({
  authors,
  onView,
  onEdit,
  onDelete,
}: AuthorsTableProps) {
  const { t } = useTranslation()

  const statusLabel = (status: Author["status"]) =>
    status === "active" ? t("common.active") : t("common.inactive")

  const columns: DataTableColumn<Author, AuthorColumnKey>[] = [
    {
      key: "name",
      header: t("authors.table.name"),
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
      header: t("authors.table.nationality"),
      sortable: true,
      sortValue: (author) => author.nationality,
      cell: (author) => author.nationality,
    },
    {
      key: "dateOfBirth",
      header: t("authors.table.dateOfBirth"),
      sortable: true,
      sortValue: (author) => author.dateOfBirth,
      cell: (author) => author.dateOfBirth,
    },
    {
      key: "totalBooks",
      header: t("authors.table.booksCount"),
      sortable: true,
      sortValue: (author) => author.totalBooks,
      cell: (author) => (
        <Badge
          variant="secondary"
          className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
        >
          {t("authors.table.authoredCount", { count: author.totalBooks })}
        </Badge>
      ),
    },
    {
      key: "status",
      header: t("authors.table.status"),
      sortable: true,
      sortValue: (author) => statusLabel(author.status),
      cell: (author) => (
        <Badge
          variant="outline"
          className={
            author.status === "active"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
              : "border-muted bg-muted text-muted-foreground"
          }
        >
          {statusLabel(author.status)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("authors.table.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (author) => (
        <div className="table-action-content">
          <AuthorActionButton
            icon={EyeIcon}
            label={t("authors.table.viewAuthor")}
            variant="outline"
            onClick={() => onView(author)}
          />
          <AuthorActionButton
            icon={PencilIcon}
            label={t("authors.table.editAuthor")}
            variant="outline"
            onClick={() => onEdit(author)}
          />
          <AuthorActionButton
            icon={Trash2Icon}
            label={t("authors.table.deleteAuthor")}
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
        <CardTitle>{t("authors.table.title")}</CardTitle>
        <CardDescription>
          {t("authors.table.recordCount", {
            count: authors.length.toLocaleString(),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={authors}
          columns={columns}
          getRowId={(author) => author.id}
          emptyTitle={t("authors.table.emptyTitle")}
          emptyDescription={t("authors.table.emptyDescription")}
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[900px]"
        />
      </CardContent>
    </Card>
  )
}

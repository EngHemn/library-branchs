"use client"

import { PencilIcon, Trash2Icon } from "lucide-react"

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
import type { Category } from "@/domain/entities/category/Category"
import { CategoryActionButton } from "@/presentation/components/categories/CategoryActionButton"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type CategoriesTableProps = {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

type CategoryColumnKey =
  | "id"
  | "name"
  | "description"
  | "totalBooks"
  | "status"
  | "actions"

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const { t } = useTranslation()

  const statusLabel = (status: Category["status"]) =>
    status === "active" ? t("common.active") : t("common.inactive")

  const columns: DataTableColumn<Category, CategoryColumnKey>[] = [
    {
      key: "id",
      header: t("categories.table.id"),
      sortable: true,
      sortValue: (category) => category.id,
      cell: (category) => (
        <span className="font-mono text-xs text-muted-foreground">
          {category.id}
        </span>
      ),
    },
    {
      key: "name",
      header: t("categories.table.name"),
      sortable: true,
      sortValue: (category) => category.name,
      cell: (category) => (
        <span className="font-semibold">{category.name}</span>
      ),
    },
    {
      key: "description",
      header: t("categories.table.description"),
      sortable: true,
      sortValue: (category) => category.description,
      cell: (category) => (
        <span className="text-muted-foreground">{category.description}</span>
      ),
    },
    {
      key: "totalBooks",
      header: t("categories.table.totalBooks"),
      sortable: true,
      sortValue: (category) => category.totalBooks,
      cell: (category) => (
        <Badge
          variant="secondary"
          className="size-7 justify-center rounded-full bg-violet-100 p-0 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
        >
          {category.totalBooks}
        </Badge>
      ),
    },
    {
      key: "status",
      header: t("categories.table.status"),
      sortable: true,
      sortValue: (category) => statusLabel(category.status),
      cell: (category) => (
        <Badge
          variant="outline"
          className={
            category.status === "active"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
              : "border-muted bg-muted text-muted-foreground"
          }
        >
          {statusLabel(category.status)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("categories.table.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (category) => (
        <div className="table-action-content">
          <CategoryActionButton
            icon={PencilIcon}
            label={t("categories.table.editCategory")}
            variant="outline"
            onClick={() => onEdit(category)}
          />
          <CategoryActionButton
            icon={Trash2Icon}
            label={t("categories.table.deleteCategory")}
            variant="destructive"
            onClick={() => onDelete(category)}
          />
        </div>
      ),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("categories.table.title")}</CardTitle>
        <CardDescription>
          {t("categories.table.recordCount", {
            count: categories.length.toLocaleString(),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={categories}
          columns={columns}
          getRowId={(category) => category.id}
          emptyTitle={t("categories.table.emptyTitle")}
          emptyDescription={t("categories.table.emptyDescription")}
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[900px]"
        />
      </CardContent>
    </Card>
  )
}

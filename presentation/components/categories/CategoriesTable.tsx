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

const statusLabels = {
  active: "active",
  inactive: "inactive",
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const columns: DataTableColumn<Category, CategoryColumnKey>[] = [
    {
      key: "id",
      header: "ID",
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
      header: "Name",
      sortable: true,
      sortValue: (category) => category.name,
      cell: (category) => (
        <span className="font-semibold">{category.name}</span>
      ),
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
      sortValue: (category) => category.description,
      cell: (category) => (
        <span className="text-muted-foreground">{category.description}</span>
      ),
    },
    {
      key: "totalBooks",
      header: "Total Books",
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
      header: "Status",
      sortable: true,
      sortValue: (category) => statusLabels[category.status],
      cell: (category) => (
        <Badge
          variant="outline"
          className={
            category.status === "active"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
              : "border-muted bg-muted text-muted-foreground"
          }
        >
          {statusLabels[category.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (category) => (
        <div className="flex justify-end gap-1">
          <CategoryActionButton
            icon={PencilIcon}
            label="Edit"
            variant="outline"
            onClick={() => onEdit(category)}
          />
          <CategoryActionButton
            icon={Trash2Icon}
            label="Delete"
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
        <CardTitle>All Categories</CardTitle>
        <CardDescription>
          {categories.length.toLocaleString()} category records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={categories}
          columns={columns}
          getRowId={(category) => category.id}
          emptyTitle="No categories found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[900px]"
        />
      </CardContent>
    </Card>
  )
}

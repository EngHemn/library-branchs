"use client"

import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"

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
import type { Shelf } from "@/domain/entities/shelf/Shelf"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"
import { ShelfActionButton } from "@/presentation/components/shelves/ShelfActionButton"
import { ShelfStatusBadge } from "@/presentation/components/shelves/ShelfStatusBadge"
import { ShelfTypeBadge } from "@/presentation/components/shelves/ShelfTypeBadge"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelvesTableProps = {
  shelves: Shelf[]
  showBranchColumn?: boolean
  onView: (shelf: Shelf) => void
  onEdit: (shelf: Shelf) => void
  onDelete: (shelf: Shelf) => void
}

type ShelfColumnKey =
  | "id"
  | "name"
  | "shelfType"
  | "branch"
  | "location"
  | "capacity"
  | "bookCount"
  | "status"
  | "actions"

export function ShelvesTable({
  shelves,
  showBranchColumn = true,
  onView,
  onEdit,
  onDelete,
}: ShelvesTableProps) {
  const { t } = useTranslation()

  const columns: DataTableColumn<Shelf, ShelfColumnKey>[] = [
    {
      key: "id",
      header: t("shelves.table.id"),
      sortable: true,
      sortValue: (shelf) => shelf.id,
      cell: (shelf) => (
        <span className="font-mono text-xs text-muted-foreground">
          {shelf.id}
        </span>
      ),
    },
    {
      key: "name",
      header: t("shelves.table.shelfName"),
      sortable: true,
      sortValue: (shelf) => shelf.name,
      cell: (shelf) => <span className="font-semibold">{shelf.name}</span>,
    },
    {
      key: "shelfType",
      header: t("shelves.table.shelfType"),
      sortable: true,
      sortValue: (shelf) => shelf.shelfType,
      cell: (shelf) => <ShelfTypeBadge shelfType={shelf.shelfType} />,
    },
    ...(showBranchColumn
      ? [
          {
            key: "branch" as const,
            header: t("shelves.table.branch"),
            sortable: true,
            sortValue: (shelf: Shelf) => shelf.branchName,
            cell: (shelf: Shelf) => (
              <span className="text-sm">{shelf.branchName}</span>
            ),
          },
        ]
      : []),
    {
      key: "location",
      header: t("shelves.table.location"),
      sortable: true,
      sortValue: (shelf) => formatShelfLocationParts(shelf.locationParts),
      cell: (shelf) => (
        <span className="text-sm text-muted-foreground">
          {formatShelfLocationParts(shelf.locationParts)}
        </span>
      ),
    },
    {
      key: "capacity",
      header: t("shelves.table.capacity"),
      sortable: true,
      sortValue: (shelf) => shelf.capacity,
      cell: (shelf) => shelf.capacity.toLocaleString(),
    },
    {
      key: "bookCount",
      header: t("shelves.table.books"),
      sortable: true,
      sortValue: (shelf) => shelf.bookCount,
      cell: (shelf) => (
        <Badge
          variant="secondary"
          className="size-7 justify-center rounded-full bg-violet-100 p-0 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
        >
          {shelf.bookCount}
        </Badge>
      ),
    },
    {
      key: "status",
      header: t("shelves.table.status"),
      sortable: true,
      sortValue: (shelf) => shelf.status,
      cell: (shelf) => <ShelfStatusBadge status={shelf.status} />,
    },
    {
      key: "actions",
      header: t("shelves.table.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (shelf) => (
        <div className="table-action-content">
          <ShelfActionButton
            icon={EyeIcon}
            label={t("shelves.table.view")}
            variant="outline"
            onClick={() => onView(shelf)}
          />
          <ShelfActionButton
            icon={PencilIcon}
            label={t("shelves.table.edit")}
            variant="outline"
            onClick={() => onEdit(shelf)}
          />
          <ShelfActionButton
            icon={Trash2Icon}
            label={t("shelves.table.delete")}
            variant="destructive"
            onClick={() => onDelete(shelf)}
          />
        </div>
      ),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("shelves.table.title")}</CardTitle>
        <CardDescription>
          {t("shelves.table.recordCount", {
            count: shelves.length.toLocaleString(),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={shelves}
          columns={columns}
          getRowId={(shelf) => shelf.id}
          emptyTitle={t("shelves.table.emptyTitle")}
          emptyDescription={t("shelves.table.emptyDescription")}
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[960px]"
        />
      </CardContent>
    </Card>
  )
}

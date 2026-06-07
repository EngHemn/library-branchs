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
  const columns: DataTableColumn<Shelf, ShelfColumnKey>[] = [
    {
      key: "id",
      header: "ID",
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
      header: "Shelf Name",
      sortable: true,
      sortValue: (shelf) => shelf.name,
      cell: (shelf) => <span className="font-semibold">{shelf.name}</span>,
    },
    {
      key: "shelfType",
      header: "Shelf Type",
      sortable: true,
      sortValue: (shelf) => shelf.shelfType,
      cell: (shelf) => <ShelfTypeBadge shelfType={shelf.shelfType} />,
    },
    ...(showBranchColumn
      ? [
          {
            key: "branch" as const,
            header: "Branch",
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
      header: "Location",
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
      header: "Capacity",
      sortable: true,
      sortValue: (shelf) => shelf.capacity,
      cell: (shelf) => shelf.capacity.toLocaleString(),
    },
    {
      key: "bookCount",
      header: "Books",
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
      header: "Status",
      sortable: true,
      sortValue: (shelf) => shelf.status,
      cell: (shelf) => <ShelfStatusBadge status={shelf.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (shelf) => (
        <div className="flex justify-end gap-1">
          <ShelfActionButton
            icon={EyeIcon}
            label="View"
            variant="outline"
            onClick={() => onView(shelf)}
          />
          <ShelfActionButton
            icon={PencilIcon}
            label="Edit"
            variant="outline"
            onClick={() => onEdit(shelf)}
          />
          <ShelfActionButton
            icon={Trash2Icon}
            label="Delete"
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
        <CardTitle>All Shelves</CardTitle>
        <CardDescription>
          {shelves.length.toLocaleString()} shelf records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={shelves}
          columns={columns}
          getRowId={(shelf) => shelf.id}
          emptyTitle="No shelves found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[960px]"
        />
      </CardContent>
    </Card>
  )
}

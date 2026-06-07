"use client"

import {
  EyeIcon,
  LayersIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

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
import { TooltipProvider } from "@/components/ui/tooltip"
import type { GroupListItem, GroupStatus } from "@/domain/entities/group/Group"
import { GroupActionButton } from "@/presentation/components/groups/GroupActionButton"
import { formatGroupDate } from "@/presentation/components/groups/groupDisplay"
import { GroupLink } from "@/presentation/components/shared/DashboardEntityLink"

type GroupsTableProps = {
  groups: GroupListItem[]
  onView: (group: GroupListItem) => void
  onEdit: (group: GroupListItem) => void
  onDelete: (group: GroupListItem) => void
}

type GroupColumnKey =
  | "name"
  | "description"
  | "totalBooks"
  | "assignedStaff"
  | "createdAt"
  | "status"
  | "actions"

const statusVariants: Record<
  GroupStatus,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  inactive: "outline",
}

const statusLabels: Record<GroupStatus, string> = {
  active: "Active",
  inactive: "Inactive",
}

export function GroupsTable({
  groups,
  onView,
  onEdit,
  onDelete,
}: GroupsTableProps) {
  const columns: DataTableColumn<GroupListItem, GroupColumnKey>[] = [
    {
      key: "name",
      header: "Group Name",
      sortable: true,
      sortValue: (group) => group.name,
      cell: (group) => (
        <div className="flex items-center gap-3">
          <EntityImage
            src={group.imageUrl}
            alt={group.name}
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-lg"
            fallback={
              <LayersIcon className="size-4 text-muted-foreground" />
            }
          />
          <GroupLink groupId={group.id} name={group.name} />
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
      sortValue: (group) => group.description,
      cell: (group) => (
        <p className="max-w-xs truncate text-sm text-muted-foreground">
          {group.description || "—"}
        </p>
      ),
    },
    {
      key: "totalBooks",
      header: "Books",
      sortable: true,
      sortValue: (group) => group.totalBooks,
      cell: (group) => (
        <span className="tabular-nums">{group.totalBooks.toLocaleString()}</span>
      ),
    },
    {
      key: "assignedStaff",
      header: "Staff",
      sortable: true,
      sortValue: (group) => group.assignedStaff,
      cell: (group) => (
        <span className="tabular-nums">
          {group.assignedStaff.toLocaleString()}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      sortable: true,
      sortValue: (group) => new Date(group.createdAt).getTime(),
      cell: (group) => formatGroupDate(group.createdAt),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (group) => group.status,
      cell: (group) => (
        <Badge variant={statusVariants[group.status]}>
          {statusLabels[group.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (group) => (
        <div className="flex items-center justify-end gap-1">
          <GroupActionButton
            icon={EyeIcon}
            label="View group"
            onClick={() => onView(group)}
          />
          <GroupActionButton
            icon={PencilIcon}
            label="Edit group"
            variant="outline"
            onClick={() => onEdit(group)}
          />
          <GroupActionButton
            icon={Trash2Icon}
            label="Delete group"
            variant="destructive"
            onClick={() => onDelete(group)}
          />
        </div>
      ),
    },
  ]

  return (
    <TooltipProvider>
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Groups</CardTitle>
          <CardDescription>
            {groups.length === 0
              ? "No groups match the current filters."
              : `${groups.length} group${groups.length === 1 ? "" : "s"} shown`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={groups}
            columns={columns}
            getRowId={(group) => group.id}
            emptyTitle="No groups found"
            emptyDescription="Try changing or clearing the active filters."
            initialSort={{ key: "name", direction: "asc" }}
            initialPageSize={10}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

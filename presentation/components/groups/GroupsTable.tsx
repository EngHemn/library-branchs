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
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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

export function GroupsTable({
  groups,
  onView,
  onEdit,
  onDelete,
}: GroupsTableProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const statusLabel = (status: GroupStatus) =>
    status === "active" ? t("common.active") : t("common.inactive")

  const columns: DataTableColumn<GroupListItem, GroupColumnKey>[] = [
    {
      key: "name",
      header: t("groups.table.name"),
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
      header: t("groups.table.description"),
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
      header: t("groups.table.books"),
      sortable: true,
      sortValue: (group) => group.totalBooks,
      cell: (group) => (
        <span className="tabular-nums">{group.totalBooks.toLocaleString(locale)}</span>
      ),
    },
    {
      key: "assignedStaff",
      header: t("groups.table.staff"),
      sortable: true,
      sortValue: (group) => group.assignedStaff,
      cell: (group) => (
        <span className="tabular-nums">
          {group.assignedStaff.toLocaleString(locale)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t("groups.table.createdAt"),
      sortable: true,
      sortValue: (group) => new Date(group.createdAt).getTime(),
      cell: (group) => formatGroupDate(group.createdAt, locale),
    },
    {
      key: "status",
      header: t("groups.table.status"),
      sortable: true,
      sortValue: (group) => group.status,
      cell: (group) => (
        <Badge variant={statusVariants[group.status]}>
          {statusLabel(group.status)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("groups.table.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (group) => (
        <div className="table-action-content">
          <GroupActionButton
            icon={EyeIcon}
            label={t("groups.table.viewGroup")}
            onClick={() => onView(group)}
          />
          <GroupActionButton
            icon={PencilIcon}
            label={t("groups.table.editGroup")}
            variant="outline"
            onClick={() => onEdit(group)}
          />
          <GroupActionButton
            icon={Trash2Icon}
            label={t("groups.table.deleteGroup")}
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
          <CardTitle className="text-base">{t("groups.table.title")}</CardTitle>
          <CardDescription>
            {groups.length === 0
              ? t("groups.table.recordCountZero")
              : t("groups.table.recordCount", {
                  count: groups.length.toLocaleString(locale),
                })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={groups}
            columns={columns}
            getRowId={(group) => group.id}
            emptyTitle={t("groups.table.emptyTitle")}
            emptyDescription={t("groups.table.emptyDescription")}
            initialSort={{ key: "name", direction: "asc" }}
            initialPageSize={10}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

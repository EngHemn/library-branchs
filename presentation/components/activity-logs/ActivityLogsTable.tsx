"use client"

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
import type { ActivityLog } from "@/domain/entities/activity-log/ActivityLog"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import { ActivityLogActionBadge } from "@/presentation/components/activity-logs/ActivityLogActionBadge"
import { StaffLink } from "@/presentation/components/shared/DashboardEntityLink"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ActivityLogsTableProps = {
  logs: ActivityLog[]
}

type ActivityLogColumnKey =
  | "createdAt"
  | "action"
  | "description"
  | "entity"
  | "staff"
  | "branch"
  | "ipAddress"

function formatTimestamp(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return iso
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function timestampSortValue(iso: string): number {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

export function ActivityLogsTable({ logs }: ActivityLogsTableProps) {
  const { t } = useTranslation()
  const columns: DataTableColumn<ActivityLog, ActivityLogColumnKey>[] = [
    {
      key: "createdAt",
      header: t("activityLogs.table.timestamp"),
      sortable: true,
      sortValue: (log) => timestampSortValue(log.createdAt),
      cell: (log) => (
        <span className="whitespace-nowrap text-sm">{formatTimestamp(log.createdAt)}</span>
      ),
    },
    {
      key: "action",
      header: t("activityLogs.table.action"),
      sortable: true,
      sortValue: (log) => log.action,
      cell: (log) => <ActivityLogActionBadge action={log.action} />,
    },
    {
      key: "description",
      header: t("activityLogs.table.description"),
      sortable: true,
      sortValue: (log) => log.description,
      cell: (log) => (
        <span className="max-w-xs text-sm leading-5">{log.description}</span>
      ),
    },
    {
      key: "entity",
      header: t("activityLogs.table.entity"),
      sortable: true,
      sortValue: (log) => log.entityType,
      cell: (log) => (
        <div className="space-y-1">
          <Badge variant="secondary" className="capitalize">
            {log.entityType}
          </Badge>
          {log.entityId ? (
            <p className="font-mono text-xs text-muted-foreground">{log.entityId}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: "staff",
      header: t("activityLogs.table.staff"),
      sortable: true,
      sortValue: (log) => log.staffName,
      cell: (log) => (
        <div>
          <StaffLink staffId={log.staffId} name={log.staffName} className="text-sm" />
          <p className="font-mono text-xs text-muted-foreground">{log.staffId}</p>
        </div>
      ),
    },
    {
      key: "branch",
      header: t("activityLogs.table.branch"),
      sortable: true,
      sortValue: (log) => log.branchName,
      cell: (log) => (
        <BranchLink
          branchId={log.branchId}
          branchName={log.branchName}
          className="text-sm"
        />
      ),
    },
    {
      key: "ipAddress",
      header: t("activityLogs.table.ipAddress"),
      sortable: true,
      sortValue: (log) => log.ipAddress,
      cell: (log) => (
        <span className="font-mono text-xs text-muted-foreground">{log.ipAddress}</span>
      ),
      className: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("activityLogs.table.title")}</CardTitle>
        <CardDescription>
          {logs.length === 0
            ? t("activityLogs.table.noLogsFound")
            : t(
                logs.length === 1
                  ? "activityLogs.table.logsCount"
                  : "activityLogs.table.logsCountPlural",
                { count: logs.length }
              )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={logs}
          columns={columns}
          getRowId={(log) => log.id}
          emptyTitle={t("activityLogs.table.emptyTitle")}
          emptyDescription={t("activityLogs.table.emptyDescription")}
          initialSort={{ key: "createdAt", direction: "desc" }}
          initialPageSize={10}
        />
      </CardContent>
    </Card>
  )
}

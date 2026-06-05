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
  const columns: DataTableColumn<ActivityLog, ActivityLogColumnKey>[] = [
    {
      key: "createdAt",
      header: "Timestamp",
      sortable: true,
      sortValue: (log) => timestampSortValue(log.createdAt),
      cell: (log) => (
        <span className="whitespace-nowrap text-sm">{formatTimestamp(log.createdAt)}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      sortValue: (log) => log.action,
      cell: (log) => <ActivityLogActionBadge action={log.action} />,
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
      sortValue: (log) => log.description,
      cell: (log) => (
        <span className="max-w-xs text-sm leading-5">{log.description}</span>
      ),
    },
    {
      key: "entity",
      header: "Entity",
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
      header: "Staff",
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
      header: "Branch",
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
      header: "IP Address",
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
        <CardTitle className="text-base">Activity Logs</CardTitle>
        <CardDescription>
          {logs.length === 0
            ? "No logs match the current filters."
            : `${logs.length} log${logs.length === 1 ? "" : "s"} shown`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={logs}
          columns={columns}
          getRowId={(log) => log.id}
          emptyTitle="No activity logs found"
          emptyDescription="Try adjusting your search or filter criteria."
          initialSort={{ key: "createdAt", direction: "desc" }}
          initialPageSize={10}
        />
      </CardContent>
    </Card>
  )
}

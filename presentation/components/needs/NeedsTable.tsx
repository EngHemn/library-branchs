"use client"

import {
  CheckIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

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
import type { NeedListItem } from "@/domain/entities/need/Need"
import { NeedActionButton } from "@/presentation/components/needs/NeedActionButton"
import { NeedPriorityBadge } from "@/presentation/components/needs/NeedPriorityBadge"
import { NeedStatusBadge } from "@/presentation/components/needs/NeedStatusBadge"
import { formatNeedDate } from "@/presentation/components/needs/needDisplay"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type NeedsTableProps = {
  needs: NeedListItem[]
  showBranchColumn?: boolean
  onView: (need: NeedListItem) => void
  onEdit: (need: NeedListItem) => void
  onDelete: (need: NeedListItem) => void
  onApprove: (need: NeedListItem) => void
  onReject: (need: NeedListItem) => void
}

type NeedColumnKey =
  | "name"
  | "category"
  | "requestedBy"
  | "branchName"
  | "quantity"
  | "priority"
  | "status"
  | "requestDate"
  | "actions"

export function NeedsTable({
  needs,
  showBranchColumn = true,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: NeedsTableProps) {
  const { t } = useTranslation()

  const columns: DataTableColumn<NeedListItem, NeedColumnKey>[] = [
    {
      key: "name",
      header: t("needs.table.columns.name"),
      sortable: true,
      sortValue: (need) => need.name,
      cell: (need) => <span className="font-semibold">{need.name}</span>,
    },
    {
      key: "category",
      header: t("needs.table.columns.category"),
      sortable: true,
      sortValue: (need) => need.category,
      cell: (need) => t(`needs.categories.${need.category}` as any),
    },
    {
      key: "requestedBy",
      header: t("needs.table.columns.requestedBy"),
      sortable: true,
      sortValue: (need) => need.requestedBy,
      cell: (need) => need.requestedBy,
    },
    ...(showBranchColumn
      ? [
          {
            key: "branchName" as const,
            header: t("needs.table.columns.branch"),
            sortable: true,
            sortValue: (need: NeedListItem) => need.branchName,
            cell: (need: NeedListItem) => need.branchName,
          },
        ]
      : []),
    {
      key: "quantity",
      header: t("needs.table.columns.quantity"),
      sortable: true,
      sortValue: (need) => need.quantity,
      cell: (need) => (
        <span className="tabular-nums">{need.quantity.toLocaleString()}</span>
      ),
    },
    {
      key: "priority",
      header: t("needs.table.columns.priority"),
      sortable: true,
      sortValue: (need) => need.priority,
      cell: (need) => <NeedPriorityBadge priority={need.priority} />,
    },
    {
      key: "status",
      header: t("needs.table.columns.status"),
      sortable: true,
      sortValue: (need) => need.status,
      cell: (need) => <NeedStatusBadge status={need.status} />,
    },
    {
      key: "requestDate",
      header: t("needs.table.columns.requestDate"),
      sortable: true,
      sortValue: (need) => new Date(need.requestDate).getTime(),
      cell: (need) => formatNeedDate(need.requestDate),
    },
    {
      key: "actions",
      header: t("needs.table.columns.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (need) => (
        <div className="table-action-content">
          <NeedActionButton
            icon={EyeIcon}
            label={t("needs.table.actionsTooltip.view")}
            onClick={() => onView(need)}
          />
          <NeedActionButton
            icon={PencilIcon}
            label={t("needs.table.actionsTooltip.edit")}
            variant="outline"
            onClick={() => onEdit(need)}
          />
          {need.status === "pending" ? (
            <>
              <NeedActionButton
                icon={CheckIcon}
                label={t("needs.table.actionsTooltip.approve")}
                variant="outline"
                onClick={() => onApprove(need)}
              />
              <NeedActionButton
                icon={XIcon}
                label={t("needs.table.actionsTooltip.reject")}
                variant="destructive"
                onClick={() => onReject(need)}
              />
            </>
          ) : null}
          <NeedActionButton
            icon={Trash2Icon}
            label={t("needs.table.actionsTooltip.delete")}
            variant="destructive"
            onClick={() => onDelete(need)}
          />
        </div>
      ),
    },
  ]

  return (
    <TooltipProvider>
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("needs.table.title")}</CardTitle>
          <CardDescription>
            {needs.length === 0
              ? t("needs.table.noMatch")
              : t(needs.length === 1 ? "needs.table.recordCount" : "needs.table.recordCountPlural", {
                  count: needs.length,
                })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={needs}
            columns={columns}
            getRowId={(need) => need.id}
            emptyTitle={t("needs.table.emptyTitle")}
            emptyDescription={t("needs.table.emptyDescription")}
            initialSort={{ key: "requestDate", direction: "desc" }}
            initialPageSize={10}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

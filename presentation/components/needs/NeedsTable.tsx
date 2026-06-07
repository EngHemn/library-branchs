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
import { getNeedCategoryLabel } from "@/domain/entities/need/NeedCategory"
import type { NeedListItem } from "@/domain/entities/need/Need"
import { NeedActionButton } from "@/presentation/components/needs/NeedActionButton"
import { NeedPriorityBadge } from "@/presentation/components/needs/NeedPriorityBadge"
import { NeedStatusBadge } from "@/presentation/components/needs/NeedStatusBadge"
import { formatNeedDate } from "@/presentation/components/needs/needDisplay"

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
  const columns: DataTableColumn<NeedListItem, NeedColumnKey>[] = [
    {
      key: "name",
      header: "Need Name",
      sortable: true,
      sortValue: (need) => need.name,
      cell: (need) => <span className="font-semibold">{need.name}</span>,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      sortValue: (need) => need.category,
      cell: (need) => getNeedCategoryLabel(need.category),
    },
    {
      key: "requestedBy",
      header: "Requested By",
      sortable: true,
      sortValue: (need) => need.requestedBy,
      cell: (need) => need.requestedBy,
    },
    ...(showBranchColumn
      ? [
          {
            key: "branchName" as const,
            header: "Branch",
            sortable: true,
            sortValue: (need: NeedListItem) => need.branchName,
            cell: (need: NeedListItem) => need.branchName,
          },
        ]
      : []),
    {
      key: "quantity",
      header: "Quantity Needed",
      sortable: true,
      sortValue: (need) => need.quantity,
      cell: (need) => (
        <span className="tabular-nums">{need.quantity.toLocaleString()}</span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      sortValue: (need) => need.priority,
      cell: (need) => <NeedPriorityBadge priority={need.priority} />,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (need) => need.status,
      cell: (need) => <NeedStatusBadge status={need.status} />,
    },
    {
      key: "requestDate",
      header: "Request Date",
      sortable: true,
      sortValue: (need) => new Date(need.requestDate).getTime(),
      cell: (need) => formatNeedDate(need.requestDate),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (need) => (
        <div className="flex items-center justify-end gap-1">
          <NeedActionButton
            icon={EyeIcon}
            label="View need"
            onClick={() => onView(need)}
          />
          <NeedActionButton
            icon={PencilIcon}
            label="Edit need"
            variant="outline"
            onClick={() => onEdit(need)}
          />
          {need.status === "pending" ? (
            <>
              <NeedActionButton
                icon={CheckIcon}
                label="Approve need"
                variant="outline"
                onClick={() => onApprove(need)}
              />
              <NeedActionButton
                icon={XIcon}
                label="Reject need"
                variant="destructive"
                onClick={() => onReject(need)}
              />
            </>
          ) : null}
          <NeedActionButton
            icon={Trash2Icon}
            label="Delete need"
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
          <CardTitle className="text-base">Need Requests</CardTitle>
          <CardDescription>
            {needs.length === 0
              ? "No need requests match the current filters."
              : `${needs.length} request${needs.length === 1 ? "" : "s"} shown`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={needs}
            columns={columns}
            getRowId={(need) => need.id}
            emptyTitle="No need requests found"
            emptyDescription="Try changing or clearing the active filters."
            initialSort={{ key: "requestDate", direction: "desc" }}
            initialPageSize={10}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

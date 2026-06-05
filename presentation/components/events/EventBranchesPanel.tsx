"use client"

import { EyeIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { TooltipProvider } from "@/components/ui/tooltip"
import type {
  EventBranchParticipation,
  EventBranchStatus,
} from "@/domain/entities/event/Event"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import {
  EventBranchNameCell,
  EventCoordinatorCell,
} from "@/presentation/components/events/EventBranchContextLinks"

const branchStatusVariants: Record<
  EventBranchStatus,
  "default" | "secondary" | "outline"
> = {
  planned: "outline",
  active: "default",
  completed: "secondary",
}

const branchStatusLabels: Record<EventBranchStatus, string> = {
  planned: "Planned",
  active: "Active",
  completed: "Completed",
}

type EventBranchesPanelProps = {
  eventId: string
  eventName: string
  branches: EventBranchParticipation[]
  onViewBranchBooks: (input: {
    eventId: string
    eventName: string
    branchId: string
    branchName: string
  }) => void
}

type EventBranchColumnKey =
  | "branchName"
  | "coordinatorName"
  | "booksAllocated"
  | "booksOnDisplay"
  | "status"
  | "actions"

export function EventBranchesPanel({
  eventId,
  eventName,
  branches,
  onViewBranchBooks,
}: EventBranchesPanelProps) {
  const columns: DataTableColumn<
    EventBranchParticipation,
    EventBranchColumnKey
  >[] = [
    {
      key: "branchName",
      header: "Branch",
      sortable: true,
      sortValue: (branch) => branch.branchName,
      cell: (branch) => (
        <EventBranchNameCell
          branchId={branch.branchId}
          branchName={branch.branchName}
        />
      ),
    },
    {
      key: "coordinatorName",
      header: "Coordinator",
      sortable: true,
      sortValue: (branch) => branch.coordinatorName,
      cell: (branch) => (
        <EventCoordinatorCell
          branchId={branch.branchId}
          coordinatorName={branch.coordinatorName}
        />
      ),
    },
    {
      key: "booksAllocated",
      header: "Allocated",
      sortable: true,
      sortValue: (branch) => branch.booksAllocated,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (branch) => branch.booksAllocated.toLocaleString(),
    },
    {
      key: "booksOnDisplay",
      header: "On display",
      sortable: true,
      sortValue: (branch) => branch.booksOnDisplay,
      headerClassName: "text-right",
      className: "text-right tabular-nums",
      cell: (branch) => branch.booksOnDisplay.toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (branch) => branchStatusLabels[branch.status],
      cell: (branch) => (
        <Badge variant={branchStatusVariants[branch.status]}>
          {branchStatusLabels[branch.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (branch) => (
        <div className="flex justify-end gap-1">
          <BranchActionButton
            icon={EyeIcon}
            label="View books"
            onClick={() =>
              onViewBranchBooks({
                eventId,
                eventName,
                branchId: branch.branchId,
                branchName: branch.branchName,
              })
            }
          />
        </div>
      ),
    },
  ]

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-background p-3">
        <div className="mb-3 text-xs font-medium tracking-normal text-muted-foreground uppercase">
          Participating branches ({branches.length})
        </div>
        <DataTable
          data={branches}
          columns={columns}
          getRowId={(branch) => branch.branchId}
          emptyTitle="No branches in this event"
          emptyDescription="This event has no participating branches yet."
          initialSort={{ key: "branchName", direction: "asc" }}
          initialPageSize={5}
          pageSizeOptions={[5, 10, 20]}
          tableClassName="min-w-[780px]"
        />
      </div>
    </TooltipProvider>
  )
}

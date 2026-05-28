"use client"

import {
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { EventStatus, LibraryEvent } from "@/domain/entities/event/Event"
import { EventBranchesPanel } from "@/presentation/components/events/EventBranchesPanel"
import { CategoryActionButton } from "@/presentation/components/categories/CategoryActionButton"

type EventsTableProps = {
  events: LibraryEvent[]
  expandedEventIds: string[]
  onToggleExpanded: (eventId: string) => void
  onViewBranchBooks: (input: {
    eventId: string
    eventName: string
    branchId: string
    branchName: string
  }) => void
  onView: (event: LibraryEvent) => void
  onEdit: (event: LibraryEvent) => void
}

type EventColumnKey =
  | "expand"
  | "id"
  | "name"
  | "branches"
  | "dates"
  | "books"
  | "status"
  | "actions"

const statusVariants: Record<
  EventStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  upcoming: "outline",
  active: "default",
  completed: "secondary",
  cancelled: "destructive",
}

const statusLabels: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
}

function formatDateRange(startDate: string, endDate: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const start = formatter.format(new Date(`${startDate}T00:00:00`))
  const end = formatter.format(new Date(`${endDate}T00:00:00`))

  if (startDate === endDate) {
    return start
  }

  return `${start} – ${end}`
}

function dateRangeSortValue(startDate: string): number {
  return new Date(`${startDate}T00:00:00`).getTime()
}

function getTotalBooksAllocated(event: LibraryEvent): number {
  return event.branches.reduce(
    (total, branch) => total + branch.booksAllocated,
    0
  )
}

function BranchesCell({
  event,
  isMultiBranch,
  onViewBranchBooks,
}: {
  event: LibraryEvent
  isMultiBranch: boolean
  onViewBranchBooks: EventsTableProps["onViewBranchBooks"]
}) {
  if (!isMultiBranch) {
    const branch = event.branches[0]

    if (!branch) {
      return <span>—</span>
    }

    return (
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{branch.branchName}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="border border-border rounded-lg"
              onClick={() =>
                onViewBranchBooks({
                  eventId: event.id,
                  eventName: event.name,
                  branchId: branch.branchId,
                  branchName: branch.branchName,
                })
              }
            >
              <EyeIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View books</TooltipContent>
        </Tooltip>
      </div>
    )
  }

  return (
    <Badge variant="secondary">
      {event.branches.length} branches
    </Badge>
  )
}

export function EventsTable({
  events,
  expandedEventIds,
  onToggleExpanded,
  onViewBranchBooks,
  onView,
  onEdit,
}: EventsTableProps) {
  const columns: DataTableColumn<LibraryEvent, EventColumnKey>[] = [
    {
      key: "expand",
      header: "",
      className: "w-10",
      headerClassName: "w-10",
      cell: (event) => {
        const isMultiBranch = event.branches.length > 1
        const isExpanded = expandedEventIds.includes(event.id)

        if (!isMultiBranch) {
          return <span className="inline-block w-8" aria-hidden />
        }

        return (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onToggleExpanded(event.id)}
            aria-label={
              isExpanded
                ? `Hide branches for ${event.name}`
                : `Show branches for ${event.name}`
            }
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </Button>
        )
      },
    },
    {
      key: "id",
      header: "ID",
      sortable: true,
      sortValue: (event) => event.id,
      cell: (event) => (
        <span className="font-mono text-xs text-muted-foreground">
          {event.id}
        </span>
      ),
    },
    {
      key: "name",
      header: "Event",
      sortable: true,
      sortValue: (event) => event.name,
      cell: (event) => (
        <span className="font-semibold">{event.name}</span>
      ),
    },
    {
      key: "branches",
      header: "Branch(es)",
      sortable: true,
      sortValue: (event) =>
        event.branches.length === 1
          ? (event.branches[0]?.branchName ?? "")
          : event.branches.length,
      cell: (event) => (
        <BranchesCell
          event={event}
          isMultiBranch={event.branches.length > 1}
          onViewBranchBooks={onViewBranchBooks}
        />
      ),
    },
    {
      key: "dates",
      header: "Dates",
      sortable: true,
      sortValue: (event) => dateRangeSortValue(event.startDate),
      cell: (event) => formatDateRange(event.startDate, event.endDate),
    },
    {
      key: "books",
      header: "Books allocated",
      sortable: true,
      sortValue: (event) => getTotalBooksAllocated(event),
      cell: (event) => (
        <span className="tabular-nums">
          {getTotalBooksAllocated(event).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (event) => event.status,
      cell: (event) => (
        <Badge variant={statusVariants[event.status]}>
          {statusLabels[event.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (event) => (
        <div className="flex justify-end gap-1">
          <CategoryActionButton
            icon={EyeIcon}
            label="View event"
            variant="outline"
            onClick={() => onView(event)}
          />
          <CategoryActionButton
            icon={PencilIcon}
            label="Edit event"
            variant="outline"
            onClick={() => onEdit(event)}
          />
        </div>
      ),
    },
  ]

  return (
    <TooltipProvider>
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            {events.length.toLocaleString()} event
            {events.length === 1 ? "" : "s"} — expand multi-branch rows to see
            each participating branch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={events}
            columns={columns}
            getRowId={(event) => event.id}
            emptyTitle="No events found"
            emptyDescription="Try adjusting your search or status filter."
            initialSort={{ key: "dates", direction: "desc" }}
            initialPageSize={10}
            tableClassName="min-w-[900px]"
            isRowExpanded={(event) =>
              event.branches.length > 1 && expandedEventIds.includes(event.id)
            }
            renderExpandedRow={(event) => (
              <EventBranchesPanel
                eventId={event.id}
                eventName={event.name}
                branches={event.branches}
                onViewBranchBooks={onViewBranchBooks}
              />
            )}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

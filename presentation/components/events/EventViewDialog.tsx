"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  EventBranchParticipation,
  EventBranchStatus,
  EventStatus,
  LibraryEvent,
} from "@/domain/entities/event/Event"

type EventViewDialogProps = {
  event: LibraryEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (event: LibraryEvent) => void
}

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

function DetailItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  )
}

function BranchesSection({ branches }: { branches: EventBranchParticipation[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase">
        Participating branches ({branches.length})
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch</TableHead>
              <TableHead>Coordinator</TableHead>
              <TableHead className="text-right">Allocated</TableHead>
              <TableHead className="text-right">On display</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.branchId}>
                <TableCell className="font-medium">{branch.branchName}</TableCell>
                <TableCell>{branch.coordinatorName}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {branch.booksAllocated.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {branch.booksOnDisplay.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={branchStatusVariants[branch.status]}>
                    {branchStatusLabels[branch.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function EventViewDialog({
  event,
  open,
  onOpenChange,
  onEdit,
}: EventViewDialogProps) {
  if (!event) {
    return null
  }

  const totalAllocated = event.branches.reduce(
    (total, branch) => total + branch.booksAllocated,
    0
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>
            {event.id} · {formatDateRange(event.startDate, event.endDate)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariants[event.status]}>
              {statusLabels[event.status]}
            </Badge>
            <Badge variant="secondary">
              {event.branches.length}{" "}
              {event.branches.length === 1 ? "branch" : "branches"}
            </Badge>
            <Badge variant="outline">
              {totalAllocated.toLocaleString()} books allocated
            </Badge>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Event ID" value={event.id} />
            <DetailItem
              label="Date range"
              value={formatDateRange(event.startDate, event.endDate)}
            />
          </div>

          <DetailItem label="Description" value={event.description} />

          <BranchesSection branches={event.branches} />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {onEdit ? (
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onEdit(event)
              }}
            >
              Edit event
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { EyeIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { EventBranchParticipation } from "@/domain/entities/event/Event"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import {
  EventBranchNameCell,
  EventCoordinatorCell,
} from "@/presentation/components/events/EventBranchContextLinks"
import {
  eventBranchStatusLabels,
  eventBranchStatusVariants,
} from "@/presentation/components/events/eventDisplay"

type EventParticipatingBranchesTableProps = {
  branches: EventBranchParticipation[]
  onViewBranchBooks?: (input: {
    eventId: string
    eventName: string
    branchId: string
    branchName: string
  }) => void
  eventId?: string
  eventName?: string
}

export function EventParticipatingBranchesTable({
  branches,
  onViewBranchBooks,
  eventId,
  eventName,
}: EventParticipatingBranchesTableProps) {
  const showActions = Boolean(onViewBranchBooks && eventId && eventName)

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Participating branches</CardTitle>
        <CardDescription>
          {branches.length.toLocaleString()} branch
          {branches.length === 1 ? "" : "es"} assigned to this event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Coordinator</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
                <TableHead className="text-right">On display</TableHead>
                <TableHead>Status</TableHead>
                {showActions ? (
                  <TableHead className="text-right">Actions</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.branchId}>
                  <TableCell>
                    <EventBranchNameCell
                      branchId={branch.branchId}
                      branchName={branch.branchName}
                    />
                  </TableCell>
                  <TableCell>
                    <EventCoordinatorCell
                      branchId={branch.branchId}
                      coordinatorName={branch.coordinatorName}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {branch.booksAllocated.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {branch.booksOnDisplay.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={eventBranchStatusVariants[branch.status]}>
                      {eventBranchStatusLabels[branch.status]}
                    </Badge>
                  </TableCell>
                  {showActions ? (
                    <TableCell className="text-right">
                      <BranchActionButton
                        icon={EyeIcon}
                        label="View books"
                        onClick={() =>
                          onViewBranchBooks?.({
                            eventId: eventId!,
                            eventName: eventName!,
                            branchId: branch.branchId,
                            branchName: branch.branchName,
                          })
                        }
                      />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

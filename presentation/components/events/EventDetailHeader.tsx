"use client"

import { ArrowLeftIcon, PencilIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { LibraryEvent } from "@/domain/entities/event/Event"
import {
  eventStatusLabels,
  eventStatusVariants,
  formatEventDateRange,
} from "@/presentation/components/events/eventDisplay"

type EventDetailHeaderProps = {
  event: LibraryEvent
  onBack: () => void
  onEdit: () => void
}

function getTotalBooksAllocated(event: LibraryEvent): number {
  return event.branches.reduce(
    (total, branch) => total + branch.booksAllocated,
    0
  )
}

export function EventDetailHeader({
  event,
  onBack,
  onEdit,
}: EventDetailHeaderProps) {
  const totalAllocated = getTotalBooksAllocated(event)

  return (
    <header className="flex flex-col gap-4">
      <div className="space-y-2">
        <p className="font-mono text-xs text-muted-foreground">{event.id}</p>
        <h1 className="text-2xl font-bold tracking-normal">{event.name}</h1>
        <p className="text-sm text-muted-foreground">
          {formatEventDateRange(event.startDate, event.endDate)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={eventStatusVariants[event.status]}>
          {eventStatusLabels[event.status]}
        </Badge>
        <Badge variant="secondary">
          {event.branches.length}{" "}
          {event.branches.length === 1 ? "branch" : "branches"}
        </Badge>
        <Badge variant="outline">
          {totalAllocated.toLocaleString()} books allocated
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeftIcon />
          Back to Events
        </Button>
        <Button variant="outline" onClick={onEdit}>
          <PencilIcon />
          Edit Event
        </Button>
      </div>
    </header>
  )
}

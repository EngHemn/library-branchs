import type {
  EventBranchStatus,
  EventStatus,
} from "@/domain/entities/event/Event"

export const eventStatusVariants: Record<
  EventStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  upcoming: "outline",
  active: "default",
  completed: "secondary",
  cancelled: "destructive",
}

export const eventStatusLabels: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
}

export const eventBranchStatusVariants: Record<
  EventBranchStatus,
  "default" | "secondary" | "outline"
> = {
  planned: "outline",
  active: "default",
  completed: "secondary",
}

export const eventBranchStatusLabels: Record<EventBranchStatus, string> = {
  planned: "Planned",
  active: "Active",
  completed: "Completed",
}

export function formatEventDateRange(
  startDate: string,
  endDate: string
): string {
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

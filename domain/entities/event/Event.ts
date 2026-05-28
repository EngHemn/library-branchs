export type EventStatus = "upcoming" | "active" | "completed" | "cancelled"

export type EventBranchStatus = "planned" | "active" | "completed"

export type EventBranchParticipation = {
  branchId: string
  branchName: string
  booksAllocated: number
  booksOnDisplay: number
  coordinatorName: string
  status: EventBranchStatus
}

export type LibraryEvent = {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: EventStatus
  branches: EventBranchParticipation[]
}

export type EventSummary = {
  totalEvents: number
  upcomingEvents: number
  activeEvents: number
  multiBranchEvents: number
}

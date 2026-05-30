import type { EventStatus } from "@/domain/entities/event/Event"
import type { EventBranchBook } from "@/domain/entities/event/EventBranchBook"
import type { EventSummary, LibraryEvent } from "@/domain/entities/event/Event"
import type { Result } from "@/domain/result/Result"

export type EventBranchOption = {
  id: string
  name: string
}

export type CreateEventInput = {
  name: string
  description: string
  startDate: string
  endDate: string
  status: EventStatus
  branchIds: string[]
}

export type UpdateEventInput = CreateEventInput & {
  id: string
}

export interface EventRepository {
  getEvents(): Promise<Result<LibraryEvent[]>>
  getEventById(id: string): Promise<Result<LibraryEvent | null>>
  getEventSummary(): Promise<Result<EventSummary>>
  getEventBranchBooks(
    eventId: string,
    branchId: string
  ): Promise<Result<EventBranchBook[]>>
  getEventBranchOptions(): Promise<Result<EventBranchOption[]>>
  createEvent(input: CreateEventInput): Promise<Result<LibraryEvent>>
  updateEvent(input: UpdateEventInput): Promise<Result<LibraryEvent>>
}

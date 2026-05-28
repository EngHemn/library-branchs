import type { EventFakeDataSource } from "@/data/datasources/EventFakeDataSource"
import type { EventBranchBook } from "@/domain/entities/event/EventBranchBook"
import type { EventSummary, LibraryEvent } from "@/domain/entities/event/Event"
import type {
  CreateEventInput,
  EventBranchOption,
  EventRepository,
  UpdateEventInput,
} from "@/domain/repositories/EventRepository"
import type { Result } from "@/domain/result/Result"

export class EventRepositoryImpl implements EventRepository {
  constructor(private readonly dataSource: EventFakeDataSource) {}

  getEvents(): Promise<Result<LibraryEvent[]>> {
    return this.dataSource.getEvents()
  }

  getEventSummary(): Promise<Result<EventSummary>> {
    return this.dataSource.getEventSummary()
  }

  getEventBranchBooks(
    eventId: string,
    branchId: string
  ): Promise<Result<EventBranchBook[]>> {
    return this.dataSource.getEventBranchBooks(eventId, branchId)
  }

  getEventBranchOptions(): Promise<Result<EventBranchOption[]>> {
    return this.dataSource.getEventBranchOptions()
  }

  createEvent(input: CreateEventInput): Promise<Result<LibraryEvent>> {
    return this.dataSource.createEvent(input)
  }

  updateEvent(input: UpdateEventInput): Promise<Result<LibraryEvent>> {
    return this.dataSource.updateEvent(input)
  }
}

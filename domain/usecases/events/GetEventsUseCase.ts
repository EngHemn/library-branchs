import type { EventBranchBook } from "@/domain/entities/event/EventBranchBook"
import type { EventSummary, LibraryEvent } from "@/domain/entities/event/Event"
import type {
  CreateEventInput,
  EventBranchOption,
  EventRepository,
  UpdateEventInput,
} from "@/domain/repositories/EventRepository"
import type { Result } from "@/domain/result/Result"

export class GetEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  getEvents(): Promise<Result<LibraryEvent[]>> {
    return this.eventRepository.getEvents()
  }

  getEventById(id: string): Promise<Result<LibraryEvent | null>> {
    return this.eventRepository.getEventById(id)
  }

  getEventSummary(): Promise<Result<EventSummary>> {
    return this.eventRepository.getEventSummary()
  }

  getEventBranchBooks(
    eventId: string,
    branchId: string
  ): Promise<Result<EventBranchBook[]>> {
    return this.eventRepository.getEventBranchBooks(eventId, branchId)
  }

  getEventBranchOptions(): Promise<Result<EventBranchOption[]>> {
    return this.eventRepository.getEventBranchOptions()
  }

  createEvent(input: CreateEventInput): Promise<Result<LibraryEvent>> {
    return this.eventRepository.createEvent(input)
  }

  updateEvent(input: UpdateEventInput): Promise<Result<LibraryEvent>> {
    return this.eventRepository.updateEvent(input)
  }
}

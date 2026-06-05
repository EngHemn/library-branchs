import { fakeBranches } from "@/data/fake/fakeBranches"
import { getFakeEventBranchBooks } from "@/data/fake/fakeEventBranchBooks"
import { fakeEvents } from "@/data/fake/fakeEvents"
import type {
  EventBranchParticipation,
  EventStatus,
  EventSummary,
  LibraryEvent,
} from "@/domain/entities/event/Event"
import type { EventBranchBook } from "@/domain/entities/event/EventBranchBook"
import type {
  CreateEventInput,
  EventBranchOption,
  UpdateEventInput,
} from "@/domain/repositories/EventRepository"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function buildSummary(events: LibraryEvent[]): EventSummary {
  return {
    totalEvents: events.length,
    upcomingEvents: events.filter((event) => event.status === "upcoming").length,
    activeEvents: events.filter((event) => event.status === "active").length,
    multiBranchEvents: events.filter((event) => event.branches.length > 1)
      .length,
  }
}

function branchParticipationStatus(
  eventStatus: EventStatus
): EventBranchParticipation["status"] {
  if (eventStatus === "active") {
    return "active"
  }

  if (eventStatus === "completed" || eventStatus === "cancelled") {
    return "completed"
  }

  return "planned"
}

function buildBranchParticipations(
  branchIds: string[],
  eventStatus: EventStatus,
  existingBranches: EventBranchParticipation[] = []
): EventBranchParticipation[] {
  const participations: EventBranchParticipation[] = []

  for (const branchId of branchIds) {
    const existing = existingBranches.find(
      (branch) => branch.branchId === branchId
    )

    if (existing) {
      participations.push({ ...existing })
      continue
    }

    const branch = fakeBranches.find((item) => item.id === branchId)

    if (!branch) {
      continue
    }

    participations.push({
      branchId: branch.id,
      branchName: branch.branchName,
      booksAllocated: 0,
      booksOnDisplay: 0,
      coordinatorName: branch.adminName,
      status: branchParticipationStatus(eventStatus),
    })
  }

  return participations
}

let nextEventNumber = fakeEvents.length + 1

export class EventFakeDataSource {
  private events: LibraryEvent[] = fakeEvents.map((event) => ({
    ...event,
    branches: event.branches.map((branch) => ({ ...branch })),
  }))

  async getEvents(): Promise<Result<LibraryEvent[]>> {
    await delay(400)
    return {
      success: true,
      data: this.events.map((event) => ({
        ...event,
        branches: event.branches.map((branch) => ({ ...branch })),
      })),
    }
  }

  async getEventById(id: string): Promise<Result<LibraryEvent | null>> {
    await delay(300)

    const event = this.events.find((item) => item.id === id)

    if (!event) {
      return { success: true, data: null }
    }

    return {
      success: true,
      data: {
        ...event,
        branches: event.branches.map((branch) => ({ ...branch })),
      },
    }
  }

  async getEventSummary(): Promise<Result<EventSummary>> {
    await delay(200)
    return {
      success: true,
      data: buildSummary(this.events),
    }
  }

  async getEventBranchBooks(
    eventId: string,
    branchId: string
  ): Promise<Result<EventBranchBook[]>> {
    await delay(350)

    const eventExists = this.events.some((event) => event.id === eventId)
    if (!eventExists) {
      return { success: false, error: "Event not found." }
    }

    const branchExists = this.events
      .find((event) => event.id === eventId)
      ?.branches.some((branch) => branch.branchId === branchId)

    if (!branchExists) {
      return { success: false, error: "Branch is not part of this event." }
    }

    return {
      success: true,
      data: getFakeEventBranchBooks(eventId, branchId).map((book) => ({
        ...book,
      })),
    }
  }

  async getEventBranchOptions(): Promise<Result<EventBranchOption[]>> {
    await delay(150)

    return {
      success: true,
      data: fakeBranches
        .filter((branch) => branch.status === "active")
        .map((branch) => ({
          id: branch.id,
          name: branch.branchName,
        })),
    }
  }

  async createEvent(input: CreateEventInput): Promise<Result<LibraryEvent>> {
    await delay(400)

    const normalizedName = input.name.trim()
    const nameExists = this.events.some(
      (event) => event.name.toLowerCase() === normalizedName.toLowerCase()
    )

    if (nameExists) {
      return {
        success: false,
        error: "An event with this name already exists.",
      }
    }

    const branches = buildBranchParticipations(input.branchIds, input.status)

    if (branches.length === 0) {
      return {
        success: false,
        error: "Select at least one valid branch.",
      }
    }

    const newEvent: LibraryEvent = {
      id: `EVT-${String(nextEventNumber).padStart(3, "0")}`,
      name: normalizedName,
      description: input.description.trim(),
      startDate: input.startDate,
      endDate: input.endDate,
      status: input.status,
      branches,
      imageUrl: input.imageUrl ?? null,
    }

    nextEventNumber += 1
    this.events = [newEvent, ...this.events]

    return {
      success: true,
      data: {
        ...newEvent,
        branches: newEvent.branches.map((branch) => ({ ...branch })),
      },
    }
  }

  async updateEvent(input: UpdateEventInput): Promise<Result<LibraryEvent>> {
    await delay(400)

    const eventIndex = this.events.findIndex((event) => event.id === input.id)

    if (eventIndex === -1) {
      return { success: false, error: "Event not found." }
    }

    const normalizedName = input.name.trim()
    const nameExists = this.events.some(
      (event) =>
        event.id !== input.id &&
        event.name.toLowerCase() === normalizedName.toLowerCase()
    )

    if (nameExists) {
      return {
        success: false,
        error: "An event with this name already exists.",
      }
    }

    const existingEvent = this.events[eventIndex]
    const branches = buildBranchParticipations(
      input.branchIds,
      input.status,
      existingEvent.branches
    )

    if (branches.length === 0) {
      return {
        success: false,
        error: "Select at least one valid branch.",
      }
    }

    const updatedEvent: LibraryEvent = {
      ...existingEvent,
      name: normalizedName,
      description: input.description.trim(),
      startDate: input.startDate,
      endDate: input.endDate,
      status: input.status,
      branches,
      imageUrl: input.imageUrl ?? existingEvent.imageUrl ?? null,
    }

    this.events = this.events.map((event) =>
      event.id === input.id ? updatedEvent : event
    )

    return {
      success: true,
      data: {
        ...updatedEvent,
        branches: updatedEvent.branches.map((branch) => ({ ...branch })),
      },
    }
  }
}

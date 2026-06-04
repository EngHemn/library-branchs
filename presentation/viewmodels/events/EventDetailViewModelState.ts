"use client"

import type { LibraryEvent } from "@/domain/entities/event/Event"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"

export type EventDetailStatus = "idle" | "loading" | "loaded" | "not-found" | "error"

export type EventDetailViewModelState = {
  status: EventDetailStatus
  event: LibraryEvent | null
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}

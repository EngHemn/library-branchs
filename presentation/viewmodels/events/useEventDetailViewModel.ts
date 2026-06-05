"use client"

import { useQuery } from "@tanstack/react-query"

import type { LibraryEvent } from "@/domain/entities/event/Event"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"
import type { EventDetailStatus, EventDetailViewModelState } from "./EventDetailViewModelState"

type EventDetailViewModel = {
  state: EventDetailViewModelState
  reload: () => void
}

export function useEventDetailViewModel(
  eventId: string,
  getEventsUseCase: GetEventsUseCase
): EventDetailViewModel {
  const eventQuery = useQuery({
    queryKey: ["events", eventId],
    queryFn: async () => {
      const result = await getEventsUseCase.getEventById(eventId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const status: EventDetailStatus = eventQuery.isPending
    ? "loading"
    : eventQuery.isError
      ? "error"
      : eventQuery.data == null
        ? "not-found"
        : "loaded"

  function reload(): void {
    void eventQuery.refetch()
  }

  const state: EventDetailViewModelState = {
    status,
    event: eventQuery.data ?? null,
    error: eventQuery.isError ? (eventQuery.error?.message ?? null) : null,
    isLoading: eventQuery.isPending,
    isLoaded: eventQuery.isSuccess && eventQuery.data != null,
    isNotFound: eventQuery.isSuccess && eventQuery.data == null,
    isError: eventQuery.isError,
  }

  return { state, reload }
}

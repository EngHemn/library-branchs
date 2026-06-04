"use client"

import type { EventBranchOption } from "@/domain/repositories/EventRepository"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"

export type CreateEventStatus = "idle" | "loading" | "ready" | "saving" | "saved"

export type CreateEventViewModelState = {
  status: CreateEventStatus
  branchOptions: EventBranchOption[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

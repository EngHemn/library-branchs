"use client"

import type { EventBranchOption } from "@/domain/repositories/EventRepository"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"

export type EditEventStatus =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

export type EditEventViewModelState = {
  status: EditEventStatus
  branchOptions: EventBranchOption[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

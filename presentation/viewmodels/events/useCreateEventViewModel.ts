"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { EventBranchOption } from "@/domain/repositories/EventRepository"
import {
  eventFormSchema,
  type EventFormValues,
} from "@/domain/schemas/eventFormSchema"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"

type CreateEventStatus = "idle" | "loading" | "ready" | "saving" | "saved"

type CreateEventViewModelState = {
  status: CreateEventStatus
  branchOptions: EventBranchOption[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

type CreateEventViewModel = {
  state: CreateEventViewModelState
  form: ReturnType<typeof useForm<EventFormValues>>
  save: (values: EventFormValues) => Promise<void>
}

export function useCreateEventViewModel(
  getEventsUseCase: GetEventsUseCase
): CreateEventViewModel {
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "upcoming",
      branchIds: [],
      imageUrl: null,
    },
  })

  const branchOptionsQuery = useQuery({
    queryKey: ["event-branch-options"],
    queryFn: async () => {
      const result = await getEventsUseCase.getEventBranchOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (values: EventFormValues) => {
      const result = await getEventsUseCase.createEvent(values)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
    onError: (err: Error) => setError(err.message),
  })

  const status: CreateEventStatus = createMutation.isSuccess
    ? "saved"
    : createMutation.isPending
      ? "saving"
      : branchOptionsQuery.isPending
        ? "loading"
        : "ready"

  async function save(values: EventFormValues): Promise<void> {
    setError(null)
    try {
      await createMutation.mutateAsync(values)
    } catch {
      // error handled in onError callback
    }
  }

  const state: CreateEventViewModelState = {
    status,
    branchOptions: branchOptionsQuery.data ?? [],
    error,
    isLoading: status === "loading",
    isReady: status === "ready",
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save }
}

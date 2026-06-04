"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { EventBranchOption } from "@/domain/repositories/EventRepository"
import {
  eventFormSchema,
  type EventFormValues,
} from "@/domain/schemas/eventFormSchema"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"
import type { EditEventStatus, EditEventViewModelState } from "./EditEventViewModelState"

type EditEventViewModel = {
  state: EditEventViewModelState
  form: ReturnType<typeof useForm<EventFormValues>>
  save: (values: EventFormValues) => Promise<void>
  reload: () => void
}

export function useEditEventViewModel(
  eventId: string,
  getEventsUseCase: GetEventsUseCase
): EditEventViewModel {
  const [saveError, setSaveError] = useState<string | null>(null)

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

  const editQuery = useQuery({
    queryKey: ["events", eventId, "edit"],
    queryFn: async () => {
      const [eventResult, branchOptionsResult] = await Promise.all([
        getEventsUseCase.getEventById(eventId),
        getEventsUseCase.getEventBranchOptions(),
      ])

      if (!eventResult.success) throw new Error(eventResult.error)
      if (!eventResult.data) return null

      return {
        event: eventResult.data,
        branchOptions: branchOptionsResult.success
          ? branchOptionsResult.data
          : [],
      }
    },
  })

  useEffect(() => {
    if (editQuery.data?.event) {
      const event = editQuery.data.event
      form.reset({
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        status: event.status,
        branchIds: event.branches.map((branch) => branch.branchId),
        imageUrl: event.imageUrl ?? null,
      })
    }
  }, [editQuery.data, form])

  const updateMutation = useMutation({
    mutationFn: async (values: EventFormValues) => {
      const result = await getEventsUseCase.updateEvent({
        id: eventId,
        ...values,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
      queryClient.invalidateQueries({ queryKey: ["events", eventId] })
    },
    onError: (err: Error) => setSaveError(err.message),
  })

  const status: EditEventStatus = updateMutation.isSuccess
    ? "saved"
    : updateMutation.isPending
      ? "saving"
      : editQuery.isError
        ? "error"
        : editQuery.isPending
          ? "loading"
          : editQuery.data == null
            ? "not-found"
            : "ready"

  async function save(values: EventFormValues): Promise<void> {
    setSaveError(null)
    try {
      await updateMutation.mutateAsync(values)
    } catch {
      // error handled in onError callback
    }
  }

  function reload(): void {
    void editQuery.refetch()
  }

  const state: EditEventViewModelState = {
    status,
    branchOptions: editQuery.data?.branchOptions ?? [],
    error: saveError ?? editQuery.error?.message ?? null,
    isLoading: status === "loading",
    isReady: status === "ready",
    isNotFound: status === "not-found",
    isError: status === "error",
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save, reload }
}

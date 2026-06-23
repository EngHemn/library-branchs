"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"

type UseShelfLocationOptionsMutationsResult = {
  error: string | null
  isPending: boolean
  clearError: () => void
  addLocationStep: (label: string) => Promise<boolean>
  updateLocationStep: (stepId: string, label: string) => Promise<boolean>
  deleteLocationStep: (stepId: string) => Promise<boolean>
  addLocationValue: (stepId: string, value: string) => Promise<string | null>
  updateLocationValue: (
    stepId: string,
    currentValue: string,
    value: string
  ) => Promise<string | null>
  deleteLocationValue: (stepId: string, value: string) => Promise<boolean>
}

function invalidateLocationQueries(
  queryClient: ReturnType<typeof useQueryClient>
) {
  void queryClient.invalidateQueries({ queryKey: ["shelfLocationOptions"] })
  void queryClient.invalidateQueries({ queryKey: ["shelves"] })
}

export function useShelfLocationOptionsMutations(
  shelfManagementUseCase: ShelfManagementUseCase
): UseShelfLocationOptionsMutationsResult {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async (
      action: () => Promise<
        { success: true } | { success: false; error: string }
      >
    ) => {
      const result = await action()
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => invalidateLocationQueries(queryClient),
    onError: (err: Error) => setError(err.message),
  })

  function clearError(): void {
    setError(null)
  }

  async function addLocationStep(label: string): Promise<boolean> {
    setError(null)
    try {
      await mutation.mutateAsync(() =>
        shelfManagementUseCase.addLocationStep(label.trim())
      )
      return true
    } catch {
      return false
    }
  }

  async function updateLocationStep(
    stepId: string,
    label: string
  ): Promise<boolean> {
    setError(null)
    try {
      await mutation.mutateAsync(() =>
        shelfManagementUseCase.updateLocationStep(stepId, label.trim())
      )
      return true
    } catch {
      return false
    }
  }

  async function deleteLocationStep(stepId: string): Promise<boolean> {
    setError(null)
    try {
      await mutation.mutateAsync(() =>
        shelfManagementUseCase.deleteLocationStep(stepId)
      )
      return true
    } catch {
      return false
    }
  }

  async function addLocationValue(
    stepId: string,
    value: string
  ): Promise<string | null> {
    setError(null)
    const normalizedValue = value.trim()
    try {
      await mutation.mutateAsync(() =>
        shelfManagementUseCase.addLocationValue(stepId, normalizedValue)
      )
      return normalizedValue
    } catch {
      return null
    }
  }

  async function updateLocationValue(
    stepId: string,
    currentValue: string,
    value: string
  ): Promise<string | null> {
    setError(null)
    const normalizedValue = value.trim()
    try {
      await mutation.mutateAsync(() =>
        shelfManagementUseCase.updateLocationValue(
          stepId,
          currentValue,
          normalizedValue
        )
      )
      return normalizedValue
    } catch {
      return null
    }
  }

  async function deleteLocationValue(
    stepId: string,
    value: string
  ): Promise<boolean> {
    setError(null)
    try {
      await mutation.mutateAsync(() =>
        shelfManagementUseCase.deleteLocationValue(stepId, value)
      )
      return true
    } catch {
      return false
    }
  }

  return {
    error,
    isPending: mutation.isPending,
    clearError,
    addLocationStep,
    updateLocationStep,
    deleteLocationStep,
    addLocationValue,
    updateLocationValue,
    deleteLocationValue,
  }
}

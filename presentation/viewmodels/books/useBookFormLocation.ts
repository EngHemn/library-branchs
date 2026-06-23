"use client"

import { useQuery } from "@tanstack/react-query"
import type { UseFormReturn } from "react-hook-form"

import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { BookFormValues } from "@/domain/schemas/bookFormSchema"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import {
  shelfHintFromLocationValues,
  shelfHintToLocationValues,
} from "@/lib/bookLocationForm"
import { useShelfLocationOptionsMutations } from "@/presentation/viewmodels/shelves/useShelfLocationOptionsMutations"

type UseBookFormLocationResult = {
  locationOptions: ShelfLocationOptions | null
  isLocationOptionsLoading: boolean
  locationManageError: string | null
  isManagingLocation: boolean
  shelfHintFromForm: () => string
  setLocationFromShelfHint: (shelfHint: string) => void
  addLocationValue: (stepId: string, value: string) => Promise<void>
  updateLocationValue: (
    stepId: string,
    currentValue: string,
    value: string
  ) => Promise<void>
  deleteLocationValue: (stepId: string, value: string) => Promise<void>
  addLocationStep: (label: string) => Promise<void>
  updateLocationStep: (stepId: string, label: string) => Promise<void>
  deleteLocationStep: (stepId: string) => Promise<void>
}

export function useBookFormLocation(
  form: UseFormReturn<BookFormValues>,
  shelfManagementUseCase: ShelfManagementUseCase
): UseBookFormLocationResult {
  const locationMutations = useShelfLocationOptionsMutations(
    shelfManagementUseCase
  )

  const locationOptionsQuery = useQuery({
    queryKey: ["shelfLocationOptions"],
    queryFn: async () => {
      const result = await shelfManagementUseCase.getLocationOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const locationOptions = locationOptionsQuery.data ?? null

  function shelfHintFromForm(): string {
    if (!locationOptions) return ""
    return shelfHintFromLocationValues(
      locationOptions.steps,
      form.getValues("locationValues")
    )
  }

  function setLocationFromShelfHint(shelfHint: string): void {
    if (!locationOptions) return
    form.setValue(
      "locationValues",
      shelfHintToLocationValues(shelfHint, locationOptions.steps)
    )
  }

  async function addLocationValue(
    stepId: string,
    value: string
  ): Promise<void> {
    locationMutations.clearError()
    const added = await locationMutations.addLocationValue(stepId, value)
    if (added) {
      form.setValue(`locationValues.${stepId}`, added, { shouldValidate: true })
    }
  }

  async function updateLocationValue(
    stepId: string,
    currentValue: string,
    value: string
  ): Promise<void> {
    locationMutations.clearError()
    const updated = await locationMutations.updateLocationValue(
      stepId,
      currentValue,
      value
    )
    if (
      updated &&
      (form.getValues("locationValues")[stepId] ?? "") === currentValue
    ) {
      form.setValue(`locationValues.${stepId}`, updated, {
        shouldValidate: true,
      })
    }
  }

  async function deleteLocationValue(
    stepId: string,
    value: string
  ): Promise<void> {
    locationMutations.clearError()
    await locationMutations.deleteLocationValue(stepId, value)
  }

  async function addLocationStep(label: string): Promise<void> {
    locationMutations.clearError()
    await locationMutations.addLocationStep(label)
  }

  async function updateLocationStep(
    stepId: string,
    label: string
  ): Promise<void> {
    locationMutations.clearError()
    await locationMutations.updateLocationStep(stepId, label)
  }

  async function deleteLocationStep(stepId: string): Promise<void> {
    locationMutations.clearError()
    await locationMutations.deleteLocationStep(stepId)
  }

  return {
    locationOptions,
    isLocationOptionsLoading: locationOptionsQuery.isPending,
    locationManageError: locationMutations.error,
    isManagingLocation: locationMutations.isPending,
    shelfHintFromForm,
    setLocationFromShelfHint,
    addLocationValue,
    updateLocationValue,
    deleteLocationValue,
    addLocationStep,
    updateLocationStep,
    deleteLocationStep,
  }
}

"use client"

import { useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"

import { Label } from "@/components/ui/label"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { BookFormValues } from "@/domain/schemas/bookFormSchema"
import {
  ShelfLocationStepFlow,
  type LocationFormValues,
} from "@/presentation/components/shelves/ShelfLocationStepFlow"

type BookFormLocationFieldProps = {
  form: UseFormReturn<BookFormValues>
  locationOptions: ShelfLocationOptions | null
  disabled?: boolean
  locationManageError: string | null
  isManagingLocation: boolean
  onAddLocationValue: (stepId: string, value: string) => Promise<void>
  onUpdateLocationValue: (
    stepId: string,
    currentValue: string,
    value: string
  ) => Promise<void>
  onDeleteLocationValue: (stepId: string, value: string) => Promise<void>
  onAddLocationStep: (label: string) => Promise<void>
  onUpdateLocationStep: (stepId: string, label: string) => Promise<void>
  onDeleteLocationStep: (stepId: string) => Promise<void>
}

export function BookFormLocationField({
  form,
  locationOptions,
  disabled = false,
  locationManageError,
  isManagingLocation,
  onAddLocationValue,
  onUpdateLocationValue,
  onDeleteLocationValue,
  onAddLocationStep,
  onUpdateLocationStep,
  onDeleteLocationStep,
}: BookFormLocationFieldProps) {
  const [locationStepIndex, setLocationStepIndex] = useState(0)
  const steps = locationOptions?.steps ?? []

  useEffect(() => {
    if (locationStepIndex >= steps.length) {
      setLocationStepIndex(Math.max(steps.length - 1, 0))
    }
  }, [locationStepIndex, steps.length])

  function goPrevStep(): void {
    if (locationStepIndex > 0) {
      setLocationStepIndex((index) => index - 1)
    }
  }

  function goNextStep(): void {
    if (locationStepIndex < steps.length - 1) {
      setLocationStepIndex((index) => index + 1)
    }
  }

  if (!locationOptions) {
    return (
      <div className="space-y-2">
        <Label>Location</Label>
        <p className="text-sm text-muted-foreground">Loading location options...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Label>Location</Label>

      <ShelfLocationStepFlow
        form={form as unknown as UseFormReturn<LocationFormValues>}
        locationOptions={locationOptions}
        locationStepIndex={locationStepIndex}
        disabled={disabled}
        locationManageError={locationManageError}
        isManagingLocation={isManagingLocation}
        onAddLocationValue={onAddLocationValue}
        onUpdateLocationValue={onUpdateLocationValue}
        onDeleteLocationValue={onDeleteLocationValue}
        onAddLocationStep={onAddLocationStep}
        onUpdateLocationStep={onUpdateLocationStep}
        onDeleteLocationStep={onDeleteLocationStep}
        selectOnly
        onStepBack={goPrevStep}
        canStepBack={locationStepIndex > 0}
        onAfterSelect={goNextStep}
      />
    </div>
  )
}

export const SHELF_BOOK_BAY_STEP_ID = "LOC-STEP-BAY"
export const SHELF_BOOK_SLOT_STEP_ID = "LOC-STEP-SLOT"

export type ShelfLocationStepDefinition = {
  id: string
  label: string
}

export type ShelfLocationPart = {
  stepId: string
  stepLabel: string
  value: string
}

export type ShelfLocationOptions = {
  steps: ShelfLocationStepDefinition[]
  valuesByStepId: Record<string, string[]>
}

export function cloneShelfLocationOptions(
  options: ShelfLocationOptions
): ShelfLocationOptions {
  return {
    steps: options.steps.map((step) => ({ ...step })),
    valuesByStepId: Object.fromEntries(
      Object.entries(options.valuesByStepId).map(([stepId, values]) => [
        stepId,
        [...values],
      ])
    ),
  }
}

export function getStepValues(
  options: ShelfLocationOptions,
  stepId: string
): string[] {
  return options.valuesByStepId[stepId] ?? []
}

export function buildLocationParts(
  steps: ShelfLocationStepDefinition[],
  locationValues: Record<string, string>
): ShelfLocationPart[] {
  return steps
    .map((step) => ({
      stepId: step.id,
      stepLabel: step.label,
      value: (locationValues[step.id] ?? "").trim(),
    }))
    .filter((part) => part.value.length > 0)
}

export function locationValuesFromParts(
  parts: ShelfLocationPart[]
): Record<string, string> {
  return Object.fromEntries(parts.map((part) => [part.stepId, part.value]))
}

export function getShelfLocationPartValue(
  parts: ShelfLocationPart[],
  stepId: string
): string {
  return parts.find((part) => part.stepId === stepId)?.value ?? ""
}

import {
  buildLocationParts,
  type ShelfLocationStepDefinition,
} from "@/domain/entities/shelf/ShelfLocationOptions"
import { formatShelfLocation } from "@/lib/shelfLocationDisplay"

export function shelfHintFromLocationValues(
  steps: ShelfLocationStepDefinition[],
  locationValues: Record<string, string>
): string {
  return formatShelfLocation(buildLocationParts(steps, locationValues))
}

export function hasActiveLocationFilter(
  steps: ShelfLocationStepDefinition[],
  locationValues: Record<string, string>
): boolean {
  return steps.some((step) => (locationValues[step.id] ?? "").trim().length > 0)
}

export function matchesBookShelfLocationFilter(
  shelfHint: string,
  steps: ShelfLocationStepDefinition[],
  locationValues: Record<string, string>
): boolean {
  if (!hasActiveLocationFilter(steps, locationValues)) {
    return true
  }

  const bookValues = shelfHintToLocationValues(shelfHint, steps)

  return steps.every((step) => {
    const filterValue = (locationValues[step.id] ?? "").trim()
    if (!filterValue) return true
    return bookValues[step.id] === filterValue
  })
}

export function shelfHintToLocationValues(
  shelfHint: string,
  steps: ShelfLocationStepDefinition[]
): Record<string, string> {
  const parts = shelfHint
    .split(" / ")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  return Object.fromEntries(
    steps.map((step, index) => [step.id, parts[index] ?? ""])
  )
}

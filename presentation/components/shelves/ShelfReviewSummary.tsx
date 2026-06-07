"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { buildLocationParts } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { ShelfLocationStepDefinition } from "@/domain/entities/shelf/ShelfLocationOptions"
import { getShelfTypeLabel } from "@/domain/entities/shelf/ShelfType"
import type { ShelfFormValues } from "@/domain/schemas/shelfFormSchema"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"

type ShelfReviewSummaryProps = {
  values: ShelfFormValues
  branchName: string
  locationSteps: ShelfLocationStepDefinition[]
}

export function ShelfReviewSummary({
  values,
  branchName,
  locationSteps,
}: ShelfReviewSummaryProps) {
  const locationParts = buildLocationParts(
    locationSteps,
    values.locationValues
  )

  return (
    <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Shelf Name</p>
        <p className="text-base font-semibold">{values.name}</p>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Shelf Type</p>
          <Badge variant="outline" className="mt-1">
            {getShelfTypeLabel(values.shelfType)}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Branch</p>
          <p className="text-sm">{branchName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Capacity</p>
          <p className="text-sm">{values.capacity.toLocaleString()} books</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <Badge
            variant="outline"
            className={
              values.status === "active"
                ? "mt-1 border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                : "mt-1"
            }
          >
            {values.status}
          </Badge>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-sm font-medium text-muted-foreground">Location</p>
        <p className="text-sm font-medium">
          {formatShelfLocationParts(locationParts)}
        </p>
      </div>
    </div>
  )
}

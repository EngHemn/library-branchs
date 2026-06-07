"use client"

import { Badge } from "@/components/ui/badge"
import type { ShelfStatus } from "@/domain/entities/shelf/Shelf"
import { cn } from "@/lib/utils"

type ShelfStatusBadgeProps = {
  status: ShelfStatus
}

export function ShelfStatusBadge({ status }: ShelfStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === "active"
          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
          : "border-muted bg-muted text-muted-foreground"
      )}
    >
      {status}
    </Badge>
  )
}

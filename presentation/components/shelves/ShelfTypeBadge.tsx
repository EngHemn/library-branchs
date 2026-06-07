"use client"

import { Badge } from "@/components/ui/badge"
import type { ShelfType } from "@/domain/entities/shelf/ShelfType"
import { getShelfTypeLabel } from "@/domain/entities/shelf/ShelfType"
import { cn } from "@/lib/utils"

type ShelfTypeBadgeProps = {
  shelfType: ShelfType
}

const shelfTypeStyles: Record<ShelfType, string> = {
  standard:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  reference:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300",
  display:
    "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900 dark:bg-pink-950 dark:text-pink-300",
  storage:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
  archive:
    "border-stone-200 bg-stone-50 text-stone-700 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300",
}

export function ShelfTypeBadge({ shelfType }: ShelfTypeBadgeProps) {
  return (
    <Badge variant="outline" className={cn(shelfTypeStyles[shelfType])}>
      {getShelfTypeLabel(shelfType)}
    </Badge>
  )
}

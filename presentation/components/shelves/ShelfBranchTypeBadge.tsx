"use client"

import { Badge } from "@/components/ui/badge"
import type { BranchType } from "@/domain/entities/branch/Branch"
import { getBranchTypeLabel } from "@/lib/branchTypeLabel"
import { cn } from "@/lib/utils"

type ShelfBranchTypeBadgeProps = {
  branchType: BranchType
}

export function ShelfBranchTypeBadge({ branchType }: ShelfBranchTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        branchType === "main"
          ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300"
          : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
      )}
    >
      {getBranchTypeLabel(branchType)}
    </Badge>
  )
}

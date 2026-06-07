"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type BookLocationCellProps = {
  shelfHint: string
}

export function BookLocationCell({ shelfHint }: BookLocationCellProps) {
  const trimmed = shelfHint.trim()

  if (!trimmed) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  const parts = trimmed
    .split(" / ")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
  const visibleParts = parts.slice(0, 2)
  const hiddenCount = parts.length - visibleParts.length

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex min-w-0 items-center gap-1">
          {visibleParts.map((part, index) => (
            <span
              key={`${part}-${index}`}
              className="inline-flex max-w-[5.5rem] truncate rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground"
            >
              {part}
            </span>
          ))}
          {hiddenCount > 0 ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              +{hiddenCount}
            </span>
          ) : null}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {trimmed}
      </TooltipContent>
    </Tooltip>
  )
}

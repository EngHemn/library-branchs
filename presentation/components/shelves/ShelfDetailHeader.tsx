"use client"

import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Shelf } from "@/domain/entities/shelf/Shelf"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"
import { ShelfStatusBadge } from "@/presentation/components/shelves/ShelfStatusBadge"
import { ShelfTypeBadge } from "@/presentation/components/shelves/ShelfTypeBadge"

type ShelfDetailHeaderProps = {
  shelf: Shelf
  onEdit: () => void
}

export function ShelfDetailHeader({ shelf, onEdit }: ShelfDetailHeaderProps) {
  return (
    <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <p className="font-mono text-xs text-muted-foreground">{shelf.id}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{shelf.name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <ShelfTypeBadge shelfType={shelf.shelfType} />
          <ShelfStatusBadge status={shelf.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {formatShelfLocationParts(shelf.locationParts)}
        </p>
      </div>
      <Button variant="outline" onClick={onEdit}>
        <PencilIcon />
        Edit Shelf
      </Button>
    </section>
  )
}

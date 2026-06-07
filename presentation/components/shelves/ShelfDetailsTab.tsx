"use client"

import type { ReactNode } from "react"

import type { Shelf } from "@/domain/entities/shelf/Shelf"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"
import { ShelfStatusBadge } from "@/presentation/components/shelves/ShelfStatusBadge"
import { ShelfTypeBadge } from "@/presentation/components/shelves/ShelfTypeBadge"

type ShelfDetailsTabProps = {
  shelf: Shelf
  showBranchField?: boolean
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

export function ShelfDetailsTab({
  shelf,
  showBranchField = true,
}: ShelfDetailsTabProps) {
  return (
    <dl className="space-y-4">
      <DetailRow label="Shelf ID" value={shelf.id} />
      <DetailRow label="Shelf Name" value={shelf.name} />
      <DetailRow
        label="Shelf Type"
        value={<ShelfTypeBadge shelfType={shelf.shelfType} />}
      />
      {showBranchField ? (
        <DetailRow label="Branch" value={shelf.branchName} />
      ) : null}
      <DetailRow
        label="Location"
        value={formatShelfLocationParts(shelf.locationParts)}
      />
      {shelf.locationParts.length > 0 ? (
        <>
          {shelf.locationParts.map((part) => (
            <DetailRow
              key={part.stepId}
              label={part.stepLabel}
              value={part.value}
            />
          ))}
        </>
      ) : null}
      <DetailRow label="Capacity" value={`${shelf.capacity.toLocaleString()} books`} />
      <DetailRow label="Books on Shelf" value={shelf.bookCount.toLocaleString()} />
      <DetailRow
        label="Status"
        value={<ShelfStatusBadge status={shelf.status} />}
      />
    </dl>
  )
}

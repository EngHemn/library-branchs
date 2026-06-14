"use client"

import type { ReactNode } from "react"

import type { Shelf } from "@/domain/entities/shelf/Shelf"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"
import { ShelfStatusBadge } from "@/presentation/components/shelves/ShelfStatusBadge"
import { ShelfTypeBadge } from "@/presentation/components/shelves/ShelfTypeBadge"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()

  return (
    <dl className="space-y-4">
      <DetailRow label={t("shelves.detail.shelfId")} value={shelf.id} />
      <DetailRow label={t("shelves.detail.shelfName")} value={shelf.name} />
      <DetailRow
        label={t("shelves.detail.shelfType")}
        value={<ShelfTypeBadge shelfType={shelf.shelfType} />}
      />
      {showBranchField ? (
        <DetailRow label={t("shelves.detail.branch")} value={shelf.branchName} />
      ) : null}
      <DetailRow
        label={t("shelves.detail.location")}
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
      <DetailRow
        label={t("shelves.detail.capacity")}
        value={t("shelves.detail.booksCount", {
          count: shelf.capacity.toLocaleString(),
        })}
      />
      <DetailRow
        label={t("shelves.detail.booksOnShelf")}
        value={shelf.bookCount.toLocaleString()}
      />
      <DetailRow
        label={t("common.status")}
        value={<ShelfStatusBadge status={shelf.status} />}
      />
    </dl>
  )
}

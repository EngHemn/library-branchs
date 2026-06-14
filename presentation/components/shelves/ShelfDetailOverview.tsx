"use client"

import type { ReactNode } from "react"
import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Shelf } from "@/domain/entities/shelf/Shelf"
import { getShelfTypeLabel } from "@/domain/entities/shelf/ShelfType"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"
import { ShelfStatusBadge } from "@/presentation/components/shelves/ShelfStatusBadge"
import { ShelfTypeBadge } from "@/presentation/components/shelves/ShelfTypeBadge"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelfDetailOverviewProps = {
  shelf: Shelf
  showBranchField?: boolean
  onEdit: () => void
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}

function getUtilizationPercent(shelf: Shelf): number {
  if (shelf.capacity <= 0) return 0
  return Math.round((shelf.bookCount / shelf.capacity) * 100)
}

export function ShelfDetailOverview({
  shelf,
  showBranchField = true,
  onEdit,
}: ShelfDetailOverviewProps) {
  const { t } = useTranslation()
  const availableSpace = Math.max(shelf.capacity - shelf.bookCount, 0)
  const utilization = getUtilizationPercent(shelf)

  return (
    <Card className="rounded-lg">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs text-muted-foreground">{shelf.id}</p>
          <CardTitle className="text-2xl">{shelf.name}</CardTitle>
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
          {t("shelves.view.editShelf")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            label={t("shelves.detail.shelfType")}
            value={getShelfTypeLabel(shelf.shelfType)}
          />
          {showBranchField ? (
            <InfoItem label={t("shelves.detail.branch")} value={shelf.branchName} />
          ) : null}
          <InfoItem
            label={t("shelves.detail.capacity")}
            value={t("shelves.detail.booksCount", {
              count: shelf.capacity.toLocaleString(),
            })}
          />
          <InfoItem
            label={t("shelves.detail.booksOnShelf")}
            value={shelf.bookCount.toLocaleString()}
          />
          <InfoItem
            label={t("shelves.detail.availableSpace")}
            value={availableSpace.toLocaleString()}
          />
          <InfoItem
            label={t("shelves.detail.utilization")}
            value={`${utilization}%`}
          />
        </div>

        {shelf.locationParts.length > 0 ? (
          <>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shelf.locationParts.map((part) => (
                <InfoItem
                  key={part.stepId}
                  label={part.stepLabel}
                  value={part.value}
                />
              ))}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

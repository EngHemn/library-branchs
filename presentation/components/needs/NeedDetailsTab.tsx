"use client"

import type { ReactNode } from "react"

import type { NeedDetail } from "@/domain/entities/need/Need"
import { getNeedCategoryLabel } from "@/domain/entities/need/NeedCategory"
import { NeedPriorityBadge } from "@/presentation/components/needs/NeedPriorityBadge"
import { NeedStatusBadge } from "@/presentation/components/needs/NeedStatusBadge"
import { formatNeedDateTime } from "@/presentation/components/needs/needDisplay"

type NeedDetailsTabProps = {
  need: NeedDetail
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

export function NeedDetailsTab({ need }: NeedDetailsTabProps) {
  return (
    <dl className="space-y-4">
      <DetailRow label="Need Name" value={need.name} />
      <DetailRow label="Category" value={getNeedCategoryLabel(need.category)} />
      <DetailRow
        label="Description"
        value={need.description || "—"}
      />
      <DetailRow label="Quantity" value={need.quantity.toLocaleString()} />
      <DetailRow label="Branch" value={need.branchName} />
      <DetailRow label="Requested By" value={need.requestedBy} />
      <DetailRow
        label="Priority"
        value={<NeedPriorityBadge priority={need.priority} />}
      />
      <DetailRow
        label="Status"
        value={<NeedStatusBadge status={need.status} />}
      />
      <DetailRow
        label="Created Date"
        value={formatNeedDateTime(need.createdAt)}
      />
    </dl>
  )
}

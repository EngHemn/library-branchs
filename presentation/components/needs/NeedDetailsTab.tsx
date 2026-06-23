"use client"

import type { ReactNode } from "react"

import type { NeedDetail } from "@/domain/entities/need/Need"
import { NeedPriorityBadge } from "@/presentation/components/needs/NeedPriorityBadge"
import { NeedStatusBadge } from "@/presentation/components/needs/NeedStatusBadge"
import { formatNeedDateTime } from "@/presentation/components/needs/needDisplay"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()

  return (
    <dl className="space-y-4">
      <DetailRow label={t("needs.detailsTab.name")} value={need.name} />
      <DetailRow
        label={t("needs.detailsTab.category")}
        value={t(`needs.categories.${need.category}` as any)}
      />
      <DetailRow
        label={t("needs.detailsTab.description")}
        value={need.description || "—"}
      />
      <DetailRow
        label={t("needs.detailsTab.quantity")}
        value={need.quantity.toLocaleString()}
      />
      <DetailRow label={t("needs.detailsTab.branch")} value={need.branchName} />
      <DetailRow
        label={t("needs.detailsTab.requestedBy")}
        value={need.requestedBy}
      />
      <DetailRow
        label={t("needs.detailsTab.priority")}
        value={<NeedPriorityBadge priority={need.priority} />}
      />
      <DetailRow
        label={t("needs.detailsTab.status")}
        value={<NeedStatusBadge status={need.status} />}
      />
      <DetailRow
        label={t("needs.detailsTab.createdDate")}
        value={formatNeedDateTime(need.createdAt)}
      />
    </dl>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GroupDetail, GroupStatus } from "@/domain/entities/group/Group"
import {
  formatGroupDate,
  formatGroupDateTime,
} from "@/presentation/components/groups/groupDisplay"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type GroupDetailsTabProps = {
  group: GroupDetail
}

const statusVariants: Record<GroupStatus, "default" | "secondary" | "outline"> =
  {
    active: "default",
    inactive: "outline",
  }

export function GroupDetailsTab({ group }: GroupDetailsTabProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const statusLabel = (status: GroupStatus) =>
    status === "active" ? t("common.active") : t("common.inactive")

  const fields = [
    { label: t("groups.details.groupName"), value: group.name },
    { label: t("groups.details.description"), value: group.description || "—" },
    {
      label: t("groups.details.status"),
      value: (
        <Badge variant={statusVariants[group.status]}>
          {statusLabel(group.status)}
        </Badge>
      ),
    },
    {
      label: t("groups.details.createdDate"),
      value: formatGroupDate(group.createdAt, locale),
    },
    {
      label: t("groups.details.lastUpdated"),
      value: formatGroupDateTime(group.updatedAt, locale),
    },
    {
      label: t("groups.details.books"),
      value: group.totalBooks.toLocaleString(locale),
    },
    {
      label: t("groups.details.staff"),
      value: group.totalAssignedStaff.toLocaleString(locale),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-base">{t("groups.details.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1">
              <dt className="text-sm text-muted-foreground">{field.label}</dt>
              <dd className="text-sm font-medium">{field.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

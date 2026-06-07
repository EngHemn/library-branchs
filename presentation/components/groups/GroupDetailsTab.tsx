"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { GroupDetail, GroupStatus } from "@/domain/entities/group/Group"
import {
  formatGroupDate,
  formatGroupDateTime,
} from "@/presentation/components/groups/groupDisplay"

type GroupDetailsTabProps = {
  group: GroupDetail
}

const statusVariants: Record<
  GroupStatus,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  inactive: "outline",
}

const statusLabels: Record<GroupStatus, string> = {
  active: "Active",
  inactive: "Inactive",
}

export function GroupDetailsTab({ group }: GroupDetailsTabProps) {
  const fields = [
    { label: "Group Name", value: group.name },
    { label: "Description", value: group.description || "—" },
    {
      label: "Status",
      value: (
        <Badge variant={statusVariants[group.status]}>
          {statusLabels[group.status]}
        </Badge>
      ),
    },
    { label: "Created Date", value: formatGroupDate(group.createdAt) },
    { label: "Last Updated", value: formatGroupDateTime(group.updatedAt) },
    { label: "Books", value: group.totalBooks.toLocaleString() },
    {
      label: "Staff",
      value: group.totalAssignedStaff.toLocaleString(),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-base">Group Information</CardTitle>
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

"use client"

import { UsersRoundIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { EntityImage } from "@/components/ui/entity-image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPermissionRoleLabel } from "@/domain/entities/permission/Permission"
import type { GroupAssignedStaff } from "@/domain/entities/group/Group"
import { StaffLink } from "@/presentation/components/shared/DashboardEntityLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type GroupStaffTabProps = {
  staff: GroupAssignedStaff[]
}

export function GroupStaffTab({ staff }: GroupStaffTabProps) {
  const { t } = useTranslation()

  if (staff.length === 0) {
    return (
      <Card className="rounded-lg">
        <CardContent className="flex min-h-48 items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            {t("groups.staff.empty")}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("groups.staff.assignedTitle")}</CardTitle>
        <CardDescription>
          {t("groups.staff.memberCount", { count: staff.length })}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t("groups.staff.photo")}</TableHead>
              <TableHead>{t("groups.staff.name")}</TableHead>
              <TableHead>{t("groups.staff.role")}</TableHead>
              <TableHead>{t("groups.staff.email")}</TableHead>
              <TableHead>{t("groups.staff.phone")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <EntityImage
                    src={member.imageUrl}
                    alt={member.staffName}
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full"
                    imageClassName="rounded-full"
                    fallback={
                      <UsersRoundIcon className="size-4 text-muted-foreground" />
                    }
                  />
                </TableCell>
                <TableCell>
                  <StaffLink staffId={member.id} name={member.staffName} />
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getPermissionRoleLabel(member.role)}
                  </Badge>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

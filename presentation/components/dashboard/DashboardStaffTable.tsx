"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  DashboardStaff,
  DashboardStaffRole,
  DashboardStaffStatus,
} from "@/domain/entities/dashboard/DashboardSummary"
import { BranchDetailLink } from "@/presentation/components/shared/DashboardEntityLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardStaffTableProps = {
  staff: DashboardStaff[]
  showBranchColumn?: boolean
}

const roleVariant: Record<
  DashboardStaffRole,
  "default" | "secondary" | "outline"
> = {
  manager: "default",
  librarian: "secondary",
  assistant: "secondary",
  clerk: "outline",
  security: "outline",
}

const statusVariant: Record<
  DashboardStaffStatus,
  "default" | "outline"
> = {
  active: "default",
  inactive: "outline",
}

export function DashboardStaffTable({
  staff,
  showBranchColumn = false,
}: DashboardStaffTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("dashboard.tables.name")}</TableHead>
          <TableHead className="hidden sm:table-cell">{t("dashboard.tables.staffId")}</TableHead>
          <TableHead>{t("dashboard.tables.role")}</TableHead>
          {showBranchColumn ? (
            <TableHead className="hidden md:table-cell">{t("dashboard.tables.branch")}</TableHead>
          ) : null}
          <TableHead className="hidden md:table-cell">{t("dashboard.tables.email")}</TableHead>
          <TableHead>{t("common.status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.staffName}</TableCell>
            <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
              {member.staffId}
            </TableCell>
            <TableCell>
              <Badge variant={roleVariant[member.role]} className="text-xs">
                {t(`dashboard.staffRole.${member.role}`)}
              </Badge>
            </TableCell>
            {showBranchColumn ? (
              <TableCell className="hidden max-w-[160px] truncate md:table-cell">
                <BranchDetailLink
                  branchId={member.branchId}
                  branchName={member.branchName}
                  className="block truncate text-sm"
                />
              </TableCell>
            ) : null}
            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
              {member.email}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[member.status]} className="text-xs">
                {t(`common.${member.status}`)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

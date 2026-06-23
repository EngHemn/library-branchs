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
  DashboardMember,
  DashboardMemberStatus,
} from "@/domain/entities/dashboard/DashboardSummary"
import { BranchDetailLink } from "@/presentation/components/shared/DashboardEntityLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardRecentMembersTableProps = {
  members: DashboardMember[]
  showBranchColumn?: boolean
}

const statusVariant: Record<
  DashboardMemberStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  inactive: "outline",
  suspended: "destructive",
}

export function DashboardRecentMembersTable({
  members,
  showBranchColumn = false,
}: DashboardRecentMembersTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("dashboard.tables.member")}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {t("dashboard.tables.id")}
          </TableHead>
          {showBranchColumn ? (
            <TableHead className="hidden md:table-cell">
              {t("dashboard.tables.branch")}
            </TableHead>
          ) : null}
          <TableHead className="w-24 text-right">
            {t("dashboard.tables.bookings")}
          </TableHead>
          <TableHead className="hidden lg:table-cell">
            {t("dashboard.tables.registered")}
          </TableHead>
          <TableHead>{t("common.status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.memberName}</TableCell>
            <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
              {member.membershipNumber}
            </TableCell>
            {showBranchColumn ? (
              <TableCell className="hidden max-w-[160px] truncate md:table-cell">
                <BranchDetailLink
                  branchId={member.branchId}
                  branchName={member.registerBranch}
                  className="block truncate text-sm"
                />
              </TableCell>
            ) : null}
            <TableCell className="text-right text-sm">
              {member.activeBookings}
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
              {member.registrationDate}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[member.status]} className="text-xs">
                {t(`dashboard.memberStatus.${member.status}`)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

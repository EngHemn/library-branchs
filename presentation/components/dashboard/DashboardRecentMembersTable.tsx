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

type DashboardRecentMembersTableProps = {
  members: DashboardMember[]
}

const statusLabel: Record<DashboardMemberStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
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
}: DashboardRecentMembersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead className="hidden sm:table-cell">ID</TableHead>
          <TableHead className="hidden md:table-cell">Branch</TableHead>
          <TableHead className="w-24 text-right">Bookings</TableHead>
          <TableHead className="hidden lg:table-cell">Registered</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.memberName}</TableCell>
            <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
              {member.membershipNumber}
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
              {member.registerBranch}
            </TableCell>
            <TableCell className="text-right text-sm">{member.activeBookings}</TableCell>
            <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
              {member.registrationDate}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[member.status]} className="text-xs">
                {statusLabel[member.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

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

type DashboardStaffTableProps = {
  staff: DashboardStaff[]
  showBranchColumn?: boolean
}

const roleLabel: Record<DashboardStaffRole, string> = {
  manager: "Manager",
  librarian: "Librarian",
  assistant: "Assistant",
  clerk: "Clerk",
  security: "Security",
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden sm:table-cell">Staff ID</TableHead>
          <TableHead>Role</TableHead>
          {showBranchColumn ? (
            <TableHead className="hidden md:table-cell">Branch</TableHead>
          ) : null}
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead>Status</TableHead>
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
                {roleLabel[member.role]}
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
                {member.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

"use client"

import { Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPermissionRoleLabel } from "@/domain/entities/permission/Permission"
import type { GroupStaffOption } from "@/domain/repositories/GroupRepository"

type GroupSelectedStaffTableProps = {
  staffOptions: GroupStaffOption[]
  selectedStaffIds: string[]
  onRemoveStaff: (staffId: string) => void
  disabled?: boolean
}

export function GroupSelectedStaffTable({
  staffOptions,
  selectedStaffIds,
  onRemoveStaff,
  disabled = false,
}: GroupSelectedStaffTableProps) {
  const selectedStaff = selectedStaffIds
    .map((staffId) => staffOptions.find((member) => member.id === staffId))
    .filter((member): member is GroupStaffOption => member !== undefined)

  if (selectedStaff.length === 0) {
    return (
      <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
        No staff assigned yet. Use the selector above to add staff members.
      </p>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="w-16 text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedStaff.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.staffName}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getPermissionRoleLabel(member.role)}
                </Badge>
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  aria-label={`Remove ${member.staffName}`}
                  onClick={() => onRemoveStaff(member.id)}
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

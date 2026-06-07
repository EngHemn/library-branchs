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

type GroupStaffTabProps = {
  staff: GroupAssignedStaff[]
}

export function GroupStaffTab({ staff }: GroupStaffTabProps) {
  if (staff.length === 0) {
    return (
      <Card className="rounded-lg">
        <CardContent className="flex min-h-48 items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            No staff assigned to this group.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Assigned Staff</CardTitle>
        <CardDescription>
          {staff.length} staff member{staff.length === 1 ? "" : "s"} assigned
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
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

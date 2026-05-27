"use client"

import {
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PowerOffIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import type { StaffMember, StaffPermission } from "@/domain/entities/staff/StaffMember"
import { StaffActionButton } from "@/presentation/components/staff-management/StaffActionButton"

type StaffTableProps = {
  staff: StaffMember[]
  onView: (member: StaffMember) => void
  onEdit: (member: StaffMember) => void
  onDelete: (member: StaffMember) => void
  onToggleStatus: (member: StaffMember) => void
}

type StaffColumnKey =
  | "staffId"
  | "staffName"
  | "phone"
  | "role"
  | "branch"
  | "permissions"
  | "status"
  | "actions"

const roleLabels: Record<string, string> = {
  manager: "Manager",
  librarian: "Librarian",
  assistant: "Assistant",
  clerk: "Clerk",
  security: "Security",
}

const statusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
}

const permissionLabels: Record<StaffPermission, string> = {
  read: "Read",
  write: "Write",
  delete: "Delete",
  manage_staff: "Staff",
  manage_books: "Books",
}

function StaffRoleBadge({ role }: { role: string }) {
  const variant = role === "manager" ? "default" : "secondary"
  return <Badge variant={variant}>{roleLabels[role] ?? role}</Badge>
}

function StaffStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "active" ? "default" : "outline"}>
      {statusLabels[status] ?? status}
    </Badge>
  )
}

function StaffPermissionBadges({
  permissions,
}: {
  permissions: StaffPermission[]
}) {
  if (permissions.length === 0) {
    return <span className="text-muted-foreground">None</span>
  }

  if (permissions.length === 1) {
    return (
      <Badge variant="outline" className="text-xs">
        {permissionLabels[permissions[0]]}
      </Badge>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 gap-1 px-2 text-xs font-normal"
        >
          {permissions.length} permissions
          <ChevronDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {permissions.map((perm) => (
          <DropdownMenuItem key={perm} disabled className="text-xs">
            {permissionLabels[perm]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function StaffTable({
  staff,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: StaffTableProps) {
  const columns: DataTableColumn<StaffMember, StaffColumnKey>[] = [
    {
      key: "staffId",
      header: "STAFF ID",
      sortable: true,
      sortValue: (member) => member.staffId,
      cell: (member) => (
        <span className="font-medium text-muted-foreground">
          {member.staffId}
        </span>
      ),
    },
    {
      key: "staffName",
      header: "NAME",
      sortable: true,
      sortValue: (member) => member.staffName,
      cell: (member) => (
        <span className="font-medium">{member.staffName}</span>
      ),
    },
    {
      key: "phone",
      header: "PHONE",
      cell: (member) => member.phone,
    },
    {
      key: "role",
      header: "ROLE",
      sortable: true,
      sortValue: (member) => roleLabels[member.role] ?? member.role,
      cell: (member) => <StaffRoleBadge role={member.role} />,
    },
    {
      key: "branch",
      header: "BRANCH",
      sortable: true,
      sortValue: (member) => member.branch,
      cell: (member) => member.branch,
    },
    {
      key: "permissions",
      header: "PERMISSIONS",
      cell: (member) => (
        <StaffPermissionBadges permissions={member.permissions} />
      ),
    },
    {
      key: "status",
      header: "STATUS",
      sortable: true,
      sortValue: (member) => statusLabels[member.status] ?? member.status,
      cell: (member) => <StaffStatusBadge status={member.status} />,
    },
    {
      key: "actions",
      header: "ACTIONS",
      headerClassName: "text-right",
      className: "text-right",
      cell: (member) => {
        const toggleLabel =
          member.status === "active" ? "Deactivate Staff" : "Activate Staff"
        const ToggleIcon =
          member.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="flex justify-end gap-1">
            <StaffActionButton
              icon={EyeIcon}
              label="View Staff"
              onClick={() => onView(member)}
            />
            <StaffActionButton
              icon={PencilIcon}
              label="Edit Staff"
              onClick={() => onEdit(member)}
            />
            <StaffActionButton
              icon={Trash2Icon}
              label="Delete Staff"
              variant="destructive"
              onClick={() => onDelete(member)}
            />
            <StaffActionButton
              icon={ToggleIcon}
              label={toggleLabel}
              onClick={() => onToggleStatus(member)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Staff Members</CardTitle>
        <CardDescription>
          {staff.length.toLocaleString()} staff records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={staff}
          columns={columns}
          getRowId={(member) => member.id}
          emptyTitle="No staff found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "staffName", direction: "asc" }}
          initialPageSize={10}
          tableClassName=""
        />
      </CardContent>
    </Card>
  )
}

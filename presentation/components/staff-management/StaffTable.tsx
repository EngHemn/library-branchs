"use client"

import {
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PowerOffIcon,
  Trash2Icon,
  UsersRoundIcon,
} from "lucide-react"

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
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { getPermissionRoleLabel } from "@/domain/entities/permission/Permission"
import type { StaffMember, StaffRole } from "@/domain/entities/staff/StaffMember"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import { StaffActionButton } from "@/presentation/components/staff-management/StaffActionButton"

type StaffTableProps = {
  staff: StaffMember[]
  onView: (member: StaffMember) => void
  onEdit: (member: StaffMember) => void
  onDelete: (member: StaffMember) => void
  onToggleStatus: (member: StaffMember) => void
}

type StaffColumnKey =
  | "staffName"
  | "phone"
  | "role"
  | "branch"
  | "status"
  | "actions"

const statusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
}

function StaffRoleBadge({ role }: { role: StaffRole }) {
  const variant = role === "branch_admin" ? "default" : "secondary"
  return <Badge variant={variant}>{getPermissionRoleLabel(role)}</Badge>
}

function StaffStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "active" ? "default" : "outline"}>
      {statusLabels[status] ?? status}
    </Badge>
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
      key: "staffName",
      header: "NAME",
      sortable: true,
      sortValue: (member) => member.staffName,
      cell: (member) => (
        <div className="flex items-center gap-3">
          <EntityImage
            src={member.imageUrl}
            alt={member.staffName}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full"
            imageClassName="rounded-full"
            fallback={
              <UsersRoundIcon className="size-5 text-muted-foreground" />
            }
          />
          <span className="font-medium">{member.staffName}</span>
        </div>
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
      sortValue: (member) => getPermissionRoleLabel(member.role),
      cell: (member) => <StaffRoleBadge role={member.role} />,
    },
    {
      key: "branch",
      header: "BRANCH",
      sortable: true,
      sortValue: (member) => member.branch,
      cell: (member) => (
        <BranchLink
          branchId={member.branchId}
          branchName={member.branch}
          className="block max-w-[180px] truncate font-medium text-primary underline-offset-4 hover:underline"
        />
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
          {staff.length.toLocaleString()} staff records. Permissions are inherited from each member&apos;s role.
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

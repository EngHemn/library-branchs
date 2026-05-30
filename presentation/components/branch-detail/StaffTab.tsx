"use client"

import {
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PowerOffIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import {
  getPermissionRoleLabel,
  type PermissionStaffRole,
} from "@/domain/entities/permission/Permission"
import type { StaffMember, StaffRole } from "@/domain/entities/staff/StaffMember"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"

type StaffTabProps = {
  staff: StaffMember[]
  permissions: BranchPermissions
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onView: (staff: StaffMember) => void
  onEdit: (staff: StaffMember) => void
  onDelete: (staff: StaffMember) => void
  onToggleStatus: (staff: StaffMember) => void
}

type StaffColumnKey =
  | "staffName"
  | "staffId"
  | "role"
  | "branch"
  | "email"
  | "phone"
  | "status"
  | "actions"

const statusLabels = { active: "Active", inactive: "Inactive" }

const roleVariants: Record<PermissionStaffRole, "default" | "secondary" | "outline"> = {
  branch_admin: "default",
  sub_branch_admin: "secondary",
  staff: "outline",
}

function getRoleVariant(role: StaffRole): "default" | "secondary" | "outline" {
  return roleVariants[role as PermissionStaffRole] ?? "outline"
}

export function StaffTab({
  staff,
  permissions,
  searchQuery,
  onSearchQueryChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: StaffTabProps) {
  const columns: DataTableColumn<StaffMember, StaffColumnKey>[] = [
    {
      key: "staffName",
      header: "Staff Name",
      sortable: true,
      sortValue: (s) => s.staffName,
      cell: (s) => <span className="font-medium">{s.staffName}</span>,
    },
    {
      key: "staffId",
      header: "Staff ID",
      cell: (s) => <span className="font-mono text-xs">{s.staffId}</span>,
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      sortValue: (s) => getPermissionRoleLabel(s.role),
      cell: (s) => (
        <Badge variant={getRoleVariant(s.role)}>
          {getPermissionRoleLabel(s.role)}
        </Badge>
      ),
    },
    {
      key: "branch",
      header: "Branch",
      sortable: true,
      sortValue: (s) => s.branch,
      cell: (s) => (
        <span className="block max-w-[180px] truncate">{s.branch}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (s) => s.email,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (s) => s.phone,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (s) => statusLabels[s.status],
      cell: (s) => (
        <Badge variant={s.status === "active" ? "default" : "outline"}>
          {statusLabels[s.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (s) => {
        const toggleLabel =
          s.status === "active" ? "Deactivate" : "Activate"
        const ToggleIcon = s.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="flex justify-end gap-1">
            <BranchActionButton
              icon={EyeIcon}
              label="View"
              onClick={() => onView(s)}
            />
            {permissions.canManageStaff ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label="Edit"
                  onClick={() => onEdit(s)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label="Delete"
                  variant="destructive"
                  onClick={() => onDelete(s)}
                />
                <BranchActionButton
                  icon={ToggleIcon}
                  label={toggleLabel}
                  onClick={() => onToggleStatus(s)}
                />
              </>
            ) : null}
          </div>
        )
      },
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>Staff</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={staff}
          columns={columns}
          getRowId={(s) => s.id}
          emptyTitle="No staff found"
          emptyDescription="This branch does not have any staff members yet."
          initialSort={{ key: "staffName", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[1050px]"
        />
      </CardContent>
    </Card>
  )
}

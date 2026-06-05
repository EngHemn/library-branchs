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
import type { Member, MemberStatus } from "@/domain/entities/member/Member"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"

type MembersTabProps = {
  members: Member[]
  permissions: BranchPermissions
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onView: (member: Member) => void
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
  onToggleStatus: (member: Member) => void
}

type MemberColumnKey =
  | "memberName"
  | "registerBranch"
  | "allBranchesUsed"
  | "email"
  | "phone"
  | "activeBookings"
  | "status"
  | "actions"

const memberStatusLabels: Record<MemberStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
}

const memberStatusVariants: Record<MemberStatus, "default" | "outline" | "destructive"> = {
  active: "default",
  inactive: "outline",
  suspended: "destructive",
}

export function MembersTab({
  members,
  permissions,
  searchQuery,
  onSearchQueryChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: MembersTabProps) {
  const columns: DataTableColumn<Member, MemberColumnKey>[] = [
    {
      key: "memberName",
      header: "Member Name",
      sortable: true,
      sortValue: (m) => m.memberName,
      cell: (m) => <span className="font-medium">{m.memberName}</span>,
    },
    {
      key: "registerBranch",
      header: "Register Branch",
      sortable: true,
      sortValue: (m) => m.registerBranch,
      cell: (m) => (
        <span className="block max-w-[180px] truncate">
          {m.registerBranch}
        </span>
      ),
    },
    {
      key: "allBranchesUsed",
      header: "Branches Used",
      sortable: true,
      sortValue: (m) => m.allBranchesUsed.length,
      cell: (m) => m.allBranchesUsed.length.toLocaleString(),
    },
    {
      key: "email",
      header: "Email",
      cell: (m) => m.email,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (m) => m.phone,
    },
    {
      key: "activeBookings",
      header: "Active Bookings",
      sortable: true,
      sortValue: (m) => m.activeBookings,
      cell: (m) => m.activeBookings.toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (m) => memberStatusLabels[m.status],
      cell: (m) => (
        <Badge variant={memberStatusVariants[m.status]}>
          {memberStatusLabels[m.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (m) => {
        const toggleLabel =
          m.status === "active" ? "Deactivate" : "Activate"
        const ToggleIcon = m.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="flex justify-end gap-1">
            <BranchActionButton
              icon={EyeIcon}
              label="View"
              onClick={() => onView(m)}
            />
            {permissions.canManageMembers ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label="Edit"
                  onClick={() => onEdit(m)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label="Delete"
                  variant="destructive"
                  onClick={() => onDelete(m)}
                />
                <BranchActionButton
                  icon={ToggleIcon}
                  label={toggleLabel}
                  onClick={() => onToggleStatus(m)}
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
        <CardTitle>Members</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={members}
          columns={columns}
          getRowId={(m) => m.id}
          emptyTitle="No members found"
          emptyDescription="This branch does not have any members yet."
          initialSort={{ key: "memberName", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[1050px]"
        />
      </CardContent>
    </Card>
  )
}

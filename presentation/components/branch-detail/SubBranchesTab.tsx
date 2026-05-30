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
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import { BranchAdminLink } from "@/presentation/components/branch-management/BranchAdminLink"

type SubBranchesTabProps = {
  subBranches: Branch[]
  permissions: BranchPermissions
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onView: (branch: Branch) => void
  onEdit: (branch: Branch) => void
  onDelete: (branch: Branch) => void
  onToggleStatus: (branch: Branch) => void
}

type SubBranchColumnKey =
  | "branchName"
  | "adminName"
  | "email"
  | "phone"
  | "address"
  | "status"
  | "actions"

const statusLabels = { active: "Active", inactive: "Inactive" }

export function SubBranchesTab({
  subBranches,
  permissions,
  searchQuery,
  onSearchQueryChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: SubBranchesTabProps) {
  const columns: DataTableColumn<Branch, SubBranchColumnKey>[] = [
    {
      key: "branchName",
      header: "Branch Name",
      sortable: true,
      sortValue: (b) => b.branchName,
      cell: (b) => <span className="font-medium">{b.branchName}</span>,
    },
    {
      key: "adminName",
      header: "Branch Admin",
      sortable: true,
      sortValue: (b) => b.adminName,
      cell: (b) => (
        <BranchAdminLink branchId={b.id} adminName={b.adminName} />
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (b) => b.email,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (b) => b.phone,
    },
    {
      key: "address",
      header: "Address",
      cell: (b) => (
        <span className="block max-w-[200px] truncate">{b.address}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (b) => statusLabels[b.status],
      cell: (b) => (
        <Badge variant={b.status === "active" ? "default" : "outline"}>
          {statusLabels[b.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (b) => {
        const toggleLabel =
          b.status === "active" ? "Deactivate" : "Activate"
        const ToggleIcon = b.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="flex justify-end gap-1">
            <BranchActionButton
              icon={EyeIcon}
              label="View"
              onClick={() => onView(b)}
            />
            {permissions.canManageSubBranches ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label="Edit"
                  onClick={() => onEdit(b)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label="Delete"
                  variant="destructive"
                  onClick={() => onDelete(b)}
                />
                <BranchActionButton
                  icon={ToggleIcon}
                  label={toggleLabel}
                  onClick={() => onToggleStatus(b)}
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
        <CardTitle>Sub Branches</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sub branches..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={subBranches}
          columns={columns}
          getRowId={(b) => b.id}
          emptyTitle="No sub branches found"
          emptyDescription="This branch does not have any sub branches yet."
          initialSort={{ key: "branchName", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[900px]"
        />
      </CardContent>
    </Card>
  )
}

"use client"

import {
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PowerOffIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import type { Branch } from "@/domain/entities/branch/Branch"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"

type BranchesTableProps = {
  branches: Branch[]
  onView: (branch: Branch) => void
  onEdit: (branch: Branch) => void
  onDelete: (branch: Branch) => void
  onToggleStatus: (branch: Branch) => void
}

type BranchColumnKey =
  | "id"
  | "branchName"
  | "type"
  | "adminName"
  | "parentBranch"
  | "bookCount"
  | "status"
  | "actions"

const branchTypeLabels = {
  main: "Main Branch",
  sub: "Sub Branch",
}

const branchStatusLabels = {
  active: "Active",
  inactive: "Inactive",
}

function BranchTypeBadge({ branch }: { branch: Branch }) {
  return (
    <Badge variant={branch.type === "main" ? "default" : "secondary"}>
      {branchTypeLabels[branch.type]}
    </Badge>
  )
}

function BranchStatusBadge({ branch }: { branch: Branch }) {
  return (
    <Badge variant={branch.status === "active" ? "default" : "outline"}>
      {branchStatusLabels[branch.status]}
    </Badge>
  )
}

export function BranchesTable({
  branches,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: BranchesTableProps) {
  const columns: DataTableColumn<Branch, BranchColumnKey>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      sortValue: (branch) => branch.id,
      cell: (branch) => <span className="font-medium">{branch.id}</span>,
    },
    {
      key: "branchName",
      header: "Branch Name",
      sortable: true,
      sortValue: (branch) => branch.branchName,
      cell: (branch) => (
        <span className="font-medium">{branch.branchName}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      sortValue: (branch) => branchTypeLabels[branch.type],
      cell: (branch) => <BranchTypeBadge branch={branch} />,
    },
    {
      key: "adminName",
      header: "Admin Name",
      sortable: true,
      sortValue: (branch) => branch.adminName,
      cell: (branch) => branch.adminName,
    },
    {
      key: "parentBranch",
      header: "Parent Branch",
      sortable: true,
      sortValue: (branch) => branch.parentBranch ?? "",
      cell: (branch) =>
        branch.type === "main" ? "-" : branch.parentBranch ?? "-",
    },
    {
      key: "bookCount",
      header: "Book Count",
      sortable: true,
      sortValue: (branch) => branch.bookCount,
      cell: (branch) => branch.bookCount.toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (branch) => branchStatusLabels[branch.status],
      cell: (branch) => <BranchStatusBadge branch={branch} />,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (branch) => {
        const toggleLabel =
          branch.status === "active" ? "Deactivate Branch" : "Activate Branch"
        const ToggleIcon = branch.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="flex justify-end gap-1">
            <BranchActionButton
              icon={EyeIcon}
              label="View Branch"
              onClick={() => onView(branch)}
            />
            <BranchActionButton
              icon={PencilIcon}
              label="Edit Branch"
              onClick={() => onEdit(branch)}
            />
            <BranchActionButton
              icon={Trash2Icon}
              label="Delete Branch"
              variant="destructive"
              onClick={() => onDelete(branch)}
            />
            <BranchActionButton
              icon={ToggleIcon}
              label={toggleLabel}
              onClick={() => onToggleStatus(branch)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Branches</CardTitle>
        <CardDescription>
          {branches.length.toLocaleString()} branch records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={branches}
          columns={columns}
          getRowId={(branch) => branch.id}
          emptyTitle="No branches found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "branchName", direction: "asc" }}
          initialPageSize={5}
          tableClassName=""
        />
      </CardContent>
    </Card>
  )
}

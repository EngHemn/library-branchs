"use client"

import {
  Building2Icon,
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PowerOffIcon,
  Trash2Icon,
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
import type { Branch } from "@/domain/entities/branch/Branch"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import { BranchAdminLink } from "@/presentation/components/branch-management/BranchAdminLink"

type BranchesTableProps = {
  branches: Branch[]
  hideTypeColumn?: boolean
  onView: (branch: Branch) => void
  onEdit: (branch: Branch) => void
  onDelete: (branch: Branch) => void
  onToggleStatus: (branch: Branch) => void
}

type BranchColumnKey =
  | "photo"
  | "id"
  | "branchName"
  | "type"
  | "adminName"
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
  hideTypeColumn = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: BranchesTableProps) {
  const columns: DataTableColumn<Branch, BranchColumnKey>[] = [
    {
      key: "photo",
      header: "Photo",
      cell: (branch) => (
        <EntityImage
          src={branch.imageUrl}
          alt={branch.branchName}
          width={40}
          height={40}
          className="size-10 rounded-lg"
          imageClassName="rounded-lg"
          fallback={<Building2Icon className="size-5 text-muted-foreground" />}
        />
      ),
    },
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
    ...(!hideTypeColumn
      ? [
          {
            key: "type" as const,
            header: "Type",
            sortable: true,
            sortValue: (branch: Branch) => branchTypeLabels[branch.type],
            cell: (branch: Branch) => <BranchTypeBadge branch={branch} />,
          },
        ]
      : []),
    {
      key: "adminName",
      header: "Admin Name",
      sortable: true,
      sortValue: (branch) => branch.adminName,
      cell: (branch) => (
        <BranchAdminLink branchId={branch.id} adminName={branch.adminName} />
      ),
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

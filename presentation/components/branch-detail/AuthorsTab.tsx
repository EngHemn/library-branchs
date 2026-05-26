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
import type { Author } from "@/domain/entities/author/Author"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"

type AuthorsTabProps = {
  authors: Author[]
  permissions: BranchPermissions
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onView: (author: Author) => void
  onEdit: (author: Author) => void
  onDelete: (author: Author) => void
  onToggleStatus: (author: Author) => void
}

type AuthorColumnKey =
  | "name"
  | "nationality"
  | "totalBooks"
  | "status"
  | "actions"

const statusLabels = { active: "Active", inactive: "Inactive" }

export function AuthorsTab({
  authors,
  permissions,
  searchQuery,
  onSearchQueryChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: AuthorsTabProps) {
  const columns: DataTableColumn<Author, AuthorColumnKey>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (a) => a.name,
      cell: (a) => <span className="font-medium">{a.name}</span>,
    },
    {
      key: "nationality",
      header: "Nationality",
      sortable: true,
      sortValue: (a) => a.nationality,
      cell: (a) => a.nationality,
    },
    {
      key: "totalBooks",
      header: "Total Books",
      sortable: true,
      sortValue: (a) => a.totalBooks,
      cell: (a) => a.totalBooks.toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (a) => statusLabels[a.status],
      cell: (a) => (
        <Badge variant={a.status === "active" ? "default" : "outline"}>
          {statusLabels[a.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (a) => {
        const toggleLabel =
          a.status === "active" ? "Deactivate" : "Activate"
        const ToggleIcon = a.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="flex justify-end gap-1">
            <BranchActionButton
              icon={EyeIcon}
              label="View"
              onClick={() => onView(a)}
            />
            {permissions.canManageAuthors ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label="Edit"
                  onClick={() => onEdit(a)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label="Delete"
                  variant="destructive"
                  onClick={() => onDelete(a)}
                />
                <BranchActionButton
                  icon={ToggleIcon}
                  label={toggleLabel}
                  onClick={() => onToggleStatus(a)}
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
        <CardTitle>Authors</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search authors..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={authors}
          columns={columns}
          getRowId={(a) => a.id}
          emptyTitle="No authors found"
          emptyDescription="This branch does not have any authors yet."
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[700px]"
        />
      </CardContent>
    </Card>
  )
}

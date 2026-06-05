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
import type { Translator } from "@/domain/entities/translator/Translator"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"

type TranslatorsTabProps = {
  translators: Translator[]
  permissions: BranchPermissions
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onView: (translator: Translator) => void
  onEdit: (translator: Translator) => void
  onDelete: (translator: Translator) => void
  onToggleStatus: (translator: Translator) => void
}

type TranslatorColumnKey =
  | "name"
  | "language"
  | "totalBooks"
  | "status"
  | "actions"

const statusLabels = { active: "Active", inactive: "Inactive" }

export function TranslatorsTab({
  translators,
  permissions,
  searchQuery,
  onSearchQueryChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: TranslatorsTabProps) {
  const columns: DataTableColumn<Translator, TranslatorColumnKey>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (t) => t.name,
      cell: (t) => <span className="font-medium">{t.name}</span>,
    },
    {
      key: "language",
      header: "Language",
      sortable: true,
      sortValue: (t) => t.language,
      cell: (t) => t.language,
    },
    {
      key: "totalBooks",
      header: "Total Books",
      sortable: true,
      sortValue: (t) => t.totalBooks,
      cell: (t) => t.totalBooks.toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (t) => statusLabels[t.status],
      cell: (t) => (
        <Badge variant={t.status === "active" ? "default" : "outline"}>
          {statusLabels[t.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (t) => {
        const toggleLabel =
          t.status === "active" ? "Deactivate" : "Activate"
        const ToggleIcon = t.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="flex justify-end gap-1">
            <BranchActionButton
              icon={EyeIcon}
              label="View"
              onClick={() => onView(t)}
            />
            {permissions.canManageTranslators ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label="Edit"
                  onClick={() => onEdit(t)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label="Delete"
                  variant="destructive"
                  onClick={() => onDelete(t)}
                />
                <BranchActionButton
                  icon={ToggleIcon}
                  label={toggleLabel}
                  onClick={() => onToggleStatus(t)}
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
        <CardTitle>Translators</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search translators..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={translators}
          columns={columns}
          getRowId={(t) => t.id}
          emptyTitle="No translators found"
          emptyDescription="This branch does not have any translators yet."
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[700px]"
        />
      </CardContent>
    </Card>
  )
}

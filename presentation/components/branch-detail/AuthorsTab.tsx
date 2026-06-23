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
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import type { Author } from "@/domain/entities/author/Author"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()

  const columns: DataTableColumn<Author, AuthorColumnKey>[] = [
    {
      key: "name",
      header: t("branches.detail.shared.name"),
      sortable: true,
      sortValue: (a) => a.name,
      cell: (a) => <span className="font-medium">{a.name}</span>,
    },
    {
      key: "nationality",
      header: t("branches.detail.shared.nationality"),
      sortable: true,
      sortValue: (a) => a.nationality,
      cell: (a) => a.nationality,
    },
    {
      key: "totalBooks",
      header: t("branches.detail.stats.totalBooks"),
      sortable: true,
      sortValue: (a) => a.totalBooks,
      cell: (a) => a.totalBooks.toLocaleString(),
    },
    {
      key: "status",
      header: t("common.status"),
      sortable: true,
      sortValue: (a) => t(`common.${a.status}` as TranslationKey),
      cell: (a) => (
        <Badge variant={a.status === "active" ? "default" : "outline"}>
          {t(`common.${a.status}` as TranslationKey)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (a) => {
        const toggleLabel =
          a.status === "active"
            ? t("branches.detail.shared.deactivate")
            : t("branches.detail.shared.activate")
        const ToggleIcon = a.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="table-action-content">
            <BranchActionButton
              icon={EyeIcon}
              label={t("common.view")}
              onClick={() => onView(a)}
            />
            {permissions.canManageAuthors ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label={t("common.edit")}
                  onClick={() => onEdit(a)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label={t("common.delete")}
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
        <CardTitle>{t("branches.view.tabs.authors")}</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("branches.detail.shared.searchAuthors")}
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
          emptyTitle={t("branches.detail.empty.authors.title")}
          emptyDescription={t("branches.detail.empty.authors.description")}
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[700px]"
        />
      </CardContent>
    </Card>
  )
}

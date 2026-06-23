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
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import type { Translator } from "@/domain/entities/translator/Translator"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()

  const columns: DataTableColumn<Translator, TranslatorColumnKey>[] = [
    {
      key: "name",
      header: t("branches.detail.shared.name"),
      sortable: true,
      sortValue: (item) => item.name,
      cell: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: "language",
      header: t("branches.detail.shared.language"),
      sortable: true,
      sortValue: (item) => item.language,
      cell: (item) => item.language,
    },
    {
      key: "totalBooks",
      header: t("branches.detail.stats.totalBooks"),
      sortable: true,
      sortValue: (item) => item.totalBooks,
      cell: (item) => item.totalBooks.toLocaleString(),
    },
    {
      key: "status",
      header: t("common.status"),
      sortable: true,
      sortValue: (item) => t(`common.${item.status}` as TranslationKey),
      cell: (item) => (
        <Badge variant={item.status === "active" ? "default" : "outline"}>
          {t(`common.${item.status}` as TranslationKey)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (item) => {
        const toggleLabel =
          item.status === "active"
            ? t("branches.detail.shared.deactivate")
            : t("branches.detail.shared.activate")
        const ToggleIcon = item.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="table-action-content">
            <BranchActionButton
              icon={EyeIcon}
              label={t("common.view")}
              onClick={() => onView(item)}
            />
            {permissions.canManageTranslators ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label={t("common.edit")}
                  onClick={() => onEdit(item)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label={t("common.delete")}
                  variant="destructive"
                  onClick={() => onDelete(item)}
                />
                <BranchActionButton
                  icon={ToggleIcon}
                  label={toggleLabel}
                  onClick={() => onToggleStatus(item)}
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
        <CardTitle>{t("branches.view.tabs.translators")}</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("branches.detail.shared.searchTranslators")}
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
          getRowId={(item) => item.id}
          emptyTitle={t("branches.detail.empty.translators.title")}
          emptyDescription={t("branches.detail.empty.translators.description")}
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[700px]"
        />
      </CardContent>
    </Card>
  )
}

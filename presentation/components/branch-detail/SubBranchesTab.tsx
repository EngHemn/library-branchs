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
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import { BranchAdminLink } from "@/presentation/components/branch-management/BranchAdminLink"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()

  const columns: DataTableColumn<Branch, SubBranchColumnKey>[] = [
    {
      key: "branchName",
      header: t("branches.table.branchName"),
      sortable: true,
      sortValue: (b) => b.branchName,
      cell: (b) => <span className="font-medium">{b.branchName}</span>,
    },
    {
      key: "adminName",
      header: t("branches.requests.branchAdmin"),
      sortable: true,
      sortValue: (b) => b.adminName,
      cell: (b) => <BranchAdminLink branchId={b.id} adminName={b.adminName} />,
    },
    {
      key: "email",
      header: t("branches.create.fields.email"),
      cell: (b) => b.email,
    },
    {
      key: "phone",
      header: t("branches.phone"),
      cell: (b) => b.phone,
    },
    {
      key: "address",
      header: t("branches.create.fields.address"),
      cell: (b) => (
        <span className="block max-w-[200px] truncate">{b.address}</span>
      ),
    },
    {
      key: "status",
      header: t("common.status"),
      sortable: true,
      sortValue: (b) => t(`common.${b.status}` as TranslationKey),
      cell: (b) => (
        <Badge variant={b.status === "active" ? "default" : "outline"}>
          {t(`common.${b.status}` as TranslationKey)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (b) => {
        const toggleLabel =
          b.status === "active"
            ? t("branches.detail.shared.deactivate")
            : t("branches.detail.shared.activate")
        const ToggleIcon = b.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="table-action-content">
            <BranchActionButton
              icon={EyeIcon}
              label={t("common.view")}
              onClick={() => onView(b)}
            />
            {permissions.canManageSubBranches ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label={t("common.edit")}
                  onClick={() => onEdit(b)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label={t("common.delete")}
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
        <CardTitle>{t("branches.view.tabs.subBranches")}</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("branches.detail.shared.searchSubBranches")}
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
          emptyTitle={t("branches.detail.empty.subBranches.title")}
          emptyDescription={t("branches.detail.empty.subBranches.description")}
          initialSort={{ key: "branchName", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[900px]"
        />
      </CardContent>
    </Card>
  )
}

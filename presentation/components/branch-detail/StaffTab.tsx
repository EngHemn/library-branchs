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
import {
  getPermissionRoleLabel,
  type PermissionStaffRole,
} from "@/domain/entities/permission/Permission"
import type {
  StaffMember,
  StaffRole,
} from "@/domain/entities/staff/StaffMember"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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

const roleVariants: Record<
  PermissionStaffRole,
  "default" | "secondary" | "outline"
> = {
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
  const { t } = useTranslation()

  const columns: DataTableColumn<StaffMember, StaffColumnKey>[] = [
    {
      key: "staffName",
      header: t("branches.detail.shared.staffName"),
      sortable: true,
      sortValue: (s) => s.staffName,
      cell: (s) => <span className="font-medium">{s.staffName}</span>,
    },
    {
      key: "staffId",
      header: t("branches.detail.shared.staffId"),
      cell: (s) => <span className="font-mono text-xs">{s.staffId}</span>,
    },
    {
      key: "role",
      header: t("branches.detail.shared.role"),
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
      header: t("branches.detail.shared.branch"),
      sortable: true,
      sortValue: (s) => s.branch,
      cell: (s) => (
        <span className="block max-w-[180px] truncate">{s.branch}</span>
      ),
    },
    {
      key: "email",
      header: t("branches.create.fields.email"),
      cell: (s) => s.email,
    },
    {
      key: "phone",
      header: t("branches.phone"),
      cell: (s) => s.phone,
    },
    {
      key: "status",
      header: t("common.status"),
      sortable: true,
      sortValue: (s) => t(`common.${s.status}` as TranslationKey),
      cell: (s) => (
        <Badge variant={s.status === "active" ? "default" : "outline"}>
          {t(`common.${s.status}` as TranslationKey)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (s) => {
        const toggleLabel =
          s.status === "active"
            ? t("branches.detail.shared.deactivate")
            : t("branches.detail.shared.activate")
        const ToggleIcon = s.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="table-action-content">
            <BranchActionButton
              icon={EyeIcon}
              label={t("common.view")}
              onClick={() => onView(s)}
            />
            {permissions.canManageStaff ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label={t("common.edit")}
                  onClick={() => onEdit(s)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label={t("common.delete")}
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
        <CardTitle>{t("branches.view.tabs.staff")}</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("branches.detail.shared.searchStaff")}
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
          emptyTitle={t("branches.detail.empty.staff.title")}
          emptyDescription={t("branches.detail.empty.staff.description")}
          initialSort={{ key: "staffName", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[1050px]"
        />
      </CardContent>
    </Card>
  )
}

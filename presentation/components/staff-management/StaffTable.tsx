"use client"

import {
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PowerOffIcon,
  Trash2Icon,
  UsersRoundIcon,
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
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import type { PermissionStaffRole } from "@/domain/entities/permission/Permission"
import type {
  StaffMember,
  StaffRole,
} from "@/domain/entities/staff/StaffMember"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import { StaffActionButton } from "@/presentation/components/staff-management/StaffActionButton"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type StaffTableProps = {
  staff: StaffMember[]
  showBranchColumn?: boolean
  onView: (member: StaffMember) => void
  onEdit: (member: StaffMember) => void
  onDelete: (member: StaffMember) => void
  onToggleStatus: (member: StaffMember) => void
}

type StaffColumnKey =
  | "staffName"
  | "phone"
  | "role"
  | "branch"
  | "status"
  | "actions"

const STAFF_ROLE_KEYS: Record<PermissionStaffRole, TranslationKey> = {
  branch_admin: "staff.roles.branchAdmin",
  sub_branch_admin: "staff.roles.subBranchAdmin",
  staff: "staff.roles.staff",
}

function StaffRoleBadge({ role }: { role: StaffRole }) {
  const { t } = useTranslation()
  const variant = role === "branch_admin" ? "default" : "secondary"
  const label = STAFF_ROLE_KEYS[role as PermissionStaffRole]
    ? t(STAFF_ROLE_KEYS[role as PermissionStaffRole])
    : role
  return <Badge variant={variant}>{label}</Badge>
}

function StaffStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  const label =
    status === "active" || status === "inactive"
      ? t(`common.${status}` as TranslationKey)
      : status
  return (
    <Badge variant={status === "active" ? "default" : "outline"}>{label}</Badge>
  )
}

export function StaffTable({
  staff,
  showBranchColumn = true,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: StaffTableProps) {
  const { t } = useTranslation()

  const columns: DataTableColumn<StaffMember, StaffColumnKey>[] = [
    {
      key: "staffName",
      header: t("staff.table.name"),
      sortable: true,
      sortValue: (member) => member.staffName,
      cell: (member) => (
        <div className="flex items-center gap-3">
          <EntityImage
            src={member.imageUrl}
            alt={member.staffName}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full"
            imageClassName="rounded-full"
            fallback={
              <UsersRoundIcon className="size-5 text-muted-foreground" />
            }
          />
          <span className="font-medium">{member.staffName}</span>
        </div>
      ),
    },
    {
      key: "phone",
      header: t("staff.table.phone"),
      cell: (member) => member.phone,
    },
    {
      key: "role",
      header: t("staff.table.role"),
      sortable: true,
      sortValue: (member) =>
        STAFF_ROLE_KEYS[member.role as PermissionStaffRole]
          ? t(STAFF_ROLE_KEYS[member.role as PermissionStaffRole])
          : member.role,
      cell: (member) => <StaffRoleBadge role={member.role} />,
    },
    ...(showBranchColumn
      ? [
          {
            key: "branch" as const,
            header: t("staff.table.branch"),
            sortable: true,
            sortValue: (member: StaffMember) => member.branch,
            cell: (member: StaffMember) => (
              <BranchLink
                branchId={member.branchId}
                branchName={member.branch}
                className="block max-w-[180px] truncate font-medium text-primary underline-offset-4 hover:underline"
              />
            ),
          },
        ]
      : []),
    {
      key: "status",
      header: t("common.status"),
      sortable: true,
      sortValue: (member) => t(`common.${member.status}` as TranslationKey),
      cell: (member) => <StaffStatusBadge status={member.status} />,
    },
    {
      key: "actions",
      header: t("common.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (member) => {
        const toggleLabel =
          member.status === "active"
            ? t("staff.table.deactivateStaff")
            : t("staff.table.activateStaff")
        const ToggleIcon = member.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="table-action-content">
            <StaffActionButton
              icon={EyeIcon}
              label={t("staff.table.viewStaff")}
              onClick={() => onView(member)}
            />
            <StaffActionButton
              icon={PencilIcon}
              label={t("staff.table.editStaff")}
              onClick={() => onEdit(member)}
            />
            <StaffActionButton
              icon={Trash2Icon}
              label={t("staff.table.deleteStaff")}
              variant="destructive"
              onClick={() => onDelete(member)}
            />
            <StaffActionButton
              icon={ToggleIcon}
              label={toggleLabel}
              onClick={() => onToggleStatus(member)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("staff.table.title")}</CardTitle>
        <CardDescription>
          {t("staff.table.recordCount", {
            count: staff.length.toLocaleString(),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={staff}
          columns={columns}
          getRowId={(member) => member.id}
          emptyTitle={t("staff.table.emptyTitle")}
          emptyDescription={t("staff.table.emptyDescription")}
          initialSort={{ key: "staffName", direction: "asc" }}
          initialPageSize={10}
          tableClassName=""
        />
      </CardContent>
    </Card>
  )
}

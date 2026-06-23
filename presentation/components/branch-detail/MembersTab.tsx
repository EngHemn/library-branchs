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
import type { Member, MemberStatus } from "@/domain/entities/member/Member"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type MembersTabProps = {
  members: Member[]
  permissions: BranchPermissions
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onView: (member: Member) => void
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
  onToggleStatus: (member: Member) => void
}

type MemberColumnKey =
  | "memberName"
  | "registerBranch"
  | "allBranchesUsed"
  | "email"
  | "phone"
  | "activeBookings"
  | "status"
  | "actions"

const memberStatusVariants: Record<
  MemberStatus,
  "default" | "outline" | "destructive"
> = {
  active: "default",
  inactive: "outline",
  suspended: "destructive",
}

export function MembersTab({
  members,
  permissions,
  searchQuery,
  onSearchQueryChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: MembersTabProps) {
  const { t } = useTranslation()

  function memberStatusLabel(status: MemberStatus): string {
    if (status === "suspended") {
      return t("branches.detail.shared.suspended")
    }
    return t(`common.${status}` as TranslationKey)
  }

  const columns: DataTableColumn<Member, MemberColumnKey>[] = [
    {
      key: "memberName",
      header: t("branches.detail.shared.memberName"),
      sortable: true,
      sortValue: (m) => m.memberName,
      cell: (m) => <span className="font-medium">{m.memberName}</span>,
    },
    {
      key: "registerBranch",
      header: t("branches.detail.shared.registerBranch"),
      sortable: true,
      sortValue: (m) => m.registerBranch,
      cell: (m) => (
        <span className="block max-w-[180px] truncate">{m.registerBranch}</span>
      ),
    },
    {
      key: "allBranchesUsed",
      header: t("branches.detail.shared.branchesUsed"),
      sortable: true,
      sortValue: (m) => m.allBranchesUsed.length,
      cell: (m) => m.allBranchesUsed.length.toLocaleString(),
    },
    {
      key: "email",
      header: t("branches.create.fields.email"),
      cell: (m) => m.email,
    },
    {
      key: "phone",
      header: t("branches.phone"),
      cell: (m) => m.phone,
    },
    {
      key: "activeBookings",
      header: t("branches.detail.shared.activeBookings"),
      sortable: true,
      sortValue: (m) => m.activeBookings,
      cell: (m) => m.activeBookings.toLocaleString(),
    },
    {
      key: "status",
      header: t("common.status"),
      sortable: true,
      sortValue: (m) => memberStatusLabel(m.status),
      cell: (m) => (
        <Badge variant={memberStatusVariants[m.status]}>
          {memberStatusLabel(m.status)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (m) => {
        const toggleLabel =
          m.status === "active"
            ? t("branches.detail.shared.deactivate")
            : t("branches.detail.shared.activate")
        const ToggleIcon = m.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="table-action-content">
            <BranchActionButton
              icon={EyeIcon}
              label={t("common.view")}
              onClick={() => onView(m)}
            />
            {permissions.canManageMembers ? (
              <>
                <BranchActionButton
                  icon={PencilIcon}
                  label={t("common.edit")}
                  onClick={() => onEdit(m)}
                />
                <BranchActionButton
                  icon={Trash2Icon}
                  label={t("common.delete")}
                  variant="destructive"
                  onClick={() => onDelete(m)}
                />
                <BranchActionButton
                  icon={ToggleIcon}
                  label={toggleLabel}
                  onClick={() => onToggleStatus(m)}
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
        <CardTitle>{t("branches.view.tabs.members")}</CardTitle>
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("branches.detail.shared.searchMembers")}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={members}
          columns={columns}
          getRowId={(m) => m.id}
          emptyTitle={t("branches.detail.empty.members.title")}
          emptyDescription={t("branches.detail.empty.members.description")}
          initialSort={{ key: "memberName", direction: "asc" }}
          initialPageSize={5}
          tableClassName="min-w-[1050px]"
        />
      </CardContent>
    </Card>
  )
}

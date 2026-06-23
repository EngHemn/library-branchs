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
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import type { Branch } from "@/domain/entities/branch/Branch"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import { BranchAdminLink } from "@/presentation/components/branch-management/BranchAdminLink"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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

function BranchTypeBadge({ branch }: { branch: Branch }) {
  const { t } = useTranslation()

  return (
    <Badge variant={branch.type === "main" ? "default" : "secondary"}>
      {t(`branches.types.${branch.type}` as TranslationKey)}
    </Badge>
  )
}

function BranchStatusBadge({ branch }: { branch: Branch }) {
  const { t } = useTranslation()

  return (
    <Badge variant={branch.status === "active" ? "default" : "outline"}>
      {t(`common.${branch.status}` as TranslationKey)}
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
  const { t } = useTranslation()

  const columns: DataTableColumn<Branch, BranchColumnKey>[] = [
    {
      key: "photo",
      header: t("branches.table.photo"),
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
      header: t("branches.table.id"),
      sortable: true,
      sortValue: (branch) => branch.id,
      cell: (branch) => <span className="font-medium">{branch.id}</span>,
    },
    {
      key: "branchName",
      header: t("branches.table.branchName"),
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
            header: t("branches.table.type"),
            sortable: true,
            sortValue: (branch: Branch) =>
              t(`branches.types.${branch.type}` as TranslationKey),
            cell: (branch: Branch) => <BranchTypeBadge branch={branch} />,
          },
        ]
      : []),
    {
      key: "adminName",
      header: t("branches.table.adminName"),
      sortable: true,
      sortValue: (branch) => branch.adminName,
      cell: (branch) => (
        <BranchAdminLink branchId={branch.id} adminName={branch.adminName} />
      ),
    },
    {
      key: "bookCount",
      header: t("branches.table.bookCount"),
      sortable: true,
      sortValue: (branch) => branch.bookCount,
      cell: (branch) => branch.bookCount.toLocaleString(),
    },
    {
      key: "status",
      header: t("common.status"),
      sortable: true,
      sortValue: (branch) => t(`common.${branch.status}` as TranslationKey),
      cell: (branch) => <BranchStatusBadge branch={branch} />,
    },
    {
      key: "actions",
      header: t("common.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (branch) => {
        const toggleLabel =
          branch.status === "active"
            ? t("branches.table.deactivateBranch")
            : t("branches.table.activateBranch")
        const ToggleIcon = branch.status === "active" ? PowerOffIcon : PowerIcon

        return (
          <div className="table-action-content">
            <BranchActionButton
              icon={EyeIcon}
              label={t("branches.table.viewBranch")}
              onClick={() => onView(branch)}
            />
            <BranchActionButton
              icon={PencilIcon}
              label={t("branches.table.editBranch")}
              onClick={() => onEdit(branch)}
            />
            <BranchActionButton
              icon={Trash2Icon}
              label={t("branches.table.deleteBranch")}
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
        <CardTitle>{t("branches.table.title")}</CardTitle>
        <CardDescription>
          {t("branches.table.recordCount", {
            count: branches.length.toLocaleString(),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={branches}
          columns={columns}
          getRowId={(branch) => branch.id}
          emptyTitle={t("branches.table.emptyTitle")}
          emptyDescription={t("branches.table.emptyDescription")}
          initialSort={{ key: "branchName", direction: "asc" }}
          initialPageSize={5}
          tableClassName=""
        />
      </CardContent>
    </Card>
  )
}

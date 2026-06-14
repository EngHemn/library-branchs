"use client"

import { CheckIcon, MapPinIcon, MessageSquareReplyIcon, MessageSquareTextIcon, XIcon } from "lucide-react"

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
import type { MainBranchRequest } from "@/domain/entities/branch/Branch"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import { BranchRequestExpandedDetails } from "@/presentation/components/branch-management/BranchRequestExpandedDetails"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type MainBranchRequestsTableProps = {
  requests: MainBranchRequest[]
  expandedRequestIds: string[]
  onApprove: (request: MainBranchRequest) => void
  onReject: (request: MainBranchRequest) => void
  onReply: (request: MainBranchRequest) => void
  onViewLocation: (request: MainBranchRequest) => void
  onToggleNote: (request: MainBranchRequest) => void
}

type MainBranchRequestColumnKey =
  | "id"
  | "branchName"
  | "phone"
  | "branchAdmin"
  | "submittedDate"
  | "actions"

function BranchAdminCell({
  name,
  email,
}: {
  name: string
  email: string
}) {
  return (
    <div>
      <div className="font-medium">{name}</div>
      <div className="text-xs text-muted-foreground">{email}</div>
    </div>
  )
}

export function MainBranchRequestsTable({
  requests,
  expandedRequestIds,
  onApprove,
  onReject,
  onReply,
  onViewLocation,
  onToggleNote,
}: MainBranchRequestsTableProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  function formatSubmittedDate(submittedDate: string): string {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${submittedDate}T00:00:00`))
  }

  function submittedDateTime(submittedDate: string): number {
    return new Date(`${submittedDate}T00:00:00`).getTime()
  }

  const columns: DataTableColumn<
    MainBranchRequest,
    MainBranchRequestColumnKey
  >[] = [
    {
      key: "id",
      header: t("branches.table.id"),
      sortable: true,
      sortValue: (request) => request.id,
      cell: (request) => <span className="font-medium">{request.id}</span>,
    },
    {
      key: "branchName",
      header: t("branches.table.branchName"),
      sortable: true,
      sortValue: (request) => request.branchName,
      cell: (request) => (
        <span className="font-medium">{request.branchName}</span>
      ),
    },
    {
      key: "phone",
      header: t("branches.phone"),
      sortValue: (request) => request.phone,
      cell: (request) => request.phone,
    },
    {
      key: "branchAdmin",
      header: t("branches.requests.branchAdmin"),
      sortable: true,
      sortValue: (request) => request.adminName,
      cell: (request) => (
        <BranchAdminCell
          name={request.adminName}
          email={request.adminEmail}
        />
      ),
    },
    {
      key: "submittedDate",
      header: t("branches.requests.submittedDate"),
      sortable: true,
      sortValue: (request) => submittedDateTime(request.submittedDate),
      cell: (request) => formatSubmittedDate(request.submittedDate),
    },
    {
      key: "actions",
      header: t("common.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (request) => {
        const isExpanded = expandedRequestIds.includes(request.id)
        const noteLabel = isExpanded
          ? t("branches.requests.hideNote")
          : t("branches.requests.viewNote")

        return (
          <div className="table-action-content">
            <BranchActionButton
              icon={CheckIcon}
              label={t("branches.requests.approve")}
              onClick={() => onApprove(request)}
            />
            <BranchActionButton
              icon={MapPinIcon}
              label={t("branches.requests.location")}
              onClick={() => onViewLocation(request)}
            />
            <BranchActionButton
              icon={XIcon}
              label={t("branches.requests.reject")}
              variant="destructive"
              onClick={() => onReject(request)}
            />
            <BranchActionButton
              icon={MessageSquareReplyIcon}
              label={t("branches.requests.reply")}
              onClick={() => onReply(request)}
            />
            <BranchActionButton
              icon={MessageSquareTextIcon}
              label={noteLabel}
              onClick={() => onToggleNote(request)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("branches.requests.mainTitle")}</CardTitle>
        <CardDescription>
          {t("branches.requests.pendingCount", { count: requests.length.toLocaleString() })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={requests}
          columns={columns}
          getRowId={(request) => request.id}
          emptyTitle={t("branches.requests.mainEmptyTitle")}
          emptyDescription={t("branches.requests.mainEmptyDescription")}
          initialSort={{ key: "submittedDate", direction: "desc" }}
          initialPageSize={5}
          tableClassName="min-w-[920px]"
          isRowExpanded={(request) => expandedRequestIds.includes(request.id)}
          renderExpandedRow={(request) => (
            <BranchRequestExpandedDetails
              note={request.note}
              replies={request.replies}
            />
          )}
        />
      </CardContent>
    </Card>
  )
}

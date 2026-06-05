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
import type { SubBranchRequest } from "@/domain/entities/branch/Branch"
import { BranchActionButton } from "@/presentation/components/branch-management/BranchActionButton"
import { BranchRequestExpandedDetails } from "@/presentation/components/branch-management/BranchRequestExpandedDetails"

type SubBranchRequestsTableProps = {
  requests: SubBranchRequest[]
  expandedRequestIds: string[]
  onApprove: (request: SubBranchRequest) => void
  onReject: (request: SubBranchRequest) => void
  onReply: (request: SubBranchRequest) => void
  onViewLocation: (request: SubBranchRequest) => void
  onToggleNote: (request: SubBranchRequest) => void
}

type SubBranchRequestColumnKey =
  | "id"
  | "branchName"
  | "phone"
  | "branchAdmin"
  | "submittedDate"
  | "actions"

function formatSubmittedDate(submittedDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${submittedDate}T00:00:00`))
}

function submittedDateTime(submittedDate: string): number {
  return new Date(`${submittedDate}T00:00:00`).getTime()
}

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

export function SubBranchRequestsTable({
  requests,
  expandedRequestIds,
  onApprove,
  onReject,
  onReply,
  onViewLocation,
  onToggleNote,
}: SubBranchRequestsTableProps) {
  const columns: DataTableColumn<
    SubBranchRequest,
    SubBranchRequestColumnKey
  >[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      sortValue: (request) => request.id,
      cell: (request) => <span className="font-medium">{request.id}</span>,
    },
    {
      key: "branchName",
      header: "Branch Name",
      sortable: true,
      sortValue: (request) => request.branchName,
      cell: (request) => (
        <span className="font-medium">{request.branchName}</span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      sortValue: (request) => request.phone,
      cell: (request) => request.phone,
    },
    {
      key: "branchAdmin",
      header: "Branch Admin",
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
      header: "Submitted Date",
      sortable: true,
      sortValue: (request) => submittedDateTime(request.submittedDate),
      cell: (request) => formatSubmittedDate(request.submittedDate),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (request) => {
        const isExpanded = expandedRequestIds.includes(request.id)
        const noteLabel = isExpanded ? "Hide Note" : "View Note"

        return (
          <div className="flex justify-end gap-1">
            <BranchActionButton
              icon={CheckIcon}
              label="Approve"
              onClick={() => onApprove(request)}
            />
            <BranchActionButton
              icon={MapPinIcon}
              label="Location"
              onClick={() => onViewLocation(request)}
            />
            <BranchActionButton
              icon={XIcon}
              label="Reject"
              variant="destructive"
              onClick={() => onReject(request)}
            />
            <BranchActionButton
              icon={MessageSquareReplyIcon}
              label="Reply"
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
        <CardTitle>Sub Branch Requests</CardTitle>
        <CardDescription>
          {requests.length.toLocaleString()} pending requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={requests}
          columns={columns}
          getRowId={(request) => request.id}
          emptyTitle="No sub branch requests"
          emptyDescription="New sub branch requests will appear here."
          initialSort={{ key: "submittedDate", direction: "desc" }}
          initialPageSize={5}
          tableClassName="min-w-[880px]"
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

"use client"

import {
  Building2Icon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Member, MemberStatus } from "@/domain/entities/member/Member"
import { MemberActionButton } from "@/presentation/components/members/MemberActionButton"

type MembersTableProps = {
  members: Member[]
  onView: (member: Member) => void
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
}

type MemberColumnKey =
  | "memberName"
  | "registerBranch"
  | "allBranchesUsed"
  | "registrationDate"
  | "activeBookings"
  | "status"
  | "actions"

const memberStatusLabels: Record<MemberStatus, string> = {
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
}

function MemberStatusBadge({ status }: { status: MemberStatus }) {
  return (
    <Badge
      variant="outline"
      className={
        status === "active"
          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
          : status === "suspended"
            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            : "border-muted bg-muted text-muted-foreground"
      }
    >
      {memberStatusLabels[status]}
    </Badge>
  )
}

const branchBadgeClassName =
  "bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-950"

function MemberBranchesUsedDropdown({ branches }: { branches: string[] }) {
  if (branches.length === 0) {
    return <span className="text-sm text-muted-foreground">None</span>
  }

  if (branches.length === 1) {
    return (
      <Badge
        variant="secondary"
        className={`max-w-[200px] truncate font-normal ${branchBadgeClassName}`}
      >
        <Building2Icon className="size-3 shrink-0" />
        <span className="truncate">{branches[0]}</span>
      </Badge>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex h-7 max-w-[200px] items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${branchBadgeClassName}`}
        >
          <Building2Icon className="size-3.5 shrink-0" />
          <span>{branches.length} branches</span>
          <ChevronDownIcon className="size-3 shrink-0 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <PopoverHeader className="border-b px-3 py-2.5">
          <PopoverTitle className="text-sm">Branches Used</PopoverTitle>
          <PopoverDescription>
            {branches.length} branch{branches.length === 1 ? "" : "es"} visited
          </PopoverDescription>
        </PopoverHeader>
        <ul className="max-h-48 overflow-y-auto p-1.5">
          {branches.map((branch) => (
            <li
              key={branch}
              className="flex items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted/60"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                <Building2Icon className="size-3.5" />
              </span>
              <span className="min-w-0 leading-snug font-medium">{branch}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export function MembersTable({
  members,
  onView,
  onEdit,
  onDelete,
}: MembersTableProps) {
  const columns: DataTableColumn<Member, MemberColumnKey>[] = [
    {
      key: "memberName",
      header: "Full Name",
      sortable: true,
      sortValue: (member) => member.memberName,
      cell: (member) => (
        <span className="font-semibold">{member.memberName}</span>
      ),
    },
    {
      key: "registerBranch",
      header: "Registered Branch",
      sortable: true,
      sortValue: (member) => member.registerBranch,
      cell: (member) => (
        <span className="block max-w-[180px] truncate">
          {member.registerBranch}
        </span>
      ),
    },
    {
      key: "allBranchesUsed",
      header: "Branches Used",
      sortable: true,
      sortValue: (member) => member.allBranchesUsed.length,
      cell: (member) => (
        <MemberBranchesUsedDropdown branches={member.allBranchesUsed} />
      ),
    },
    {
      key: "registrationDate",
      header: "Registration",
      sortable: true,
      sortValue: (member) => member.registrationDate,
      cell: (member) => member.registrationDate,
    },
    {
      key: "activeBookings",
      header: "Active Bookings",
      sortable: true,
      sortValue: (member) => member.activeBookings,
      cell: (member) => (
        <Badge
          variant="secondary"
          className="size-6 justify-center rounded-full bg-sky-100 p-0 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
        >
          {member.activeBookings}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (member) => memberStatusLabels[member.status],
      cell: (member) => <MemberStatusBadge status={member.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (member) => (
        <div className="flex justify-end gap-1">
          <MemberActionButton
            icon={EyeIcon}
            label="View"
            variant="outline"
            onClick={() => onView(member)}
          />
          <MemberActionButton
            icon={PencilIcon}
            label="Edit"
            variant="outline"
            onClick={() => onEdit(member)}
          />
          <MemberActionButton
            icon={Trash2Icon}
            label="Delete"
            variant="destructive"
            onClick={() => onDelete(member)}
          />
        </div>
      ),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          {members.length.toLocaleString()} member records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={members}
          columns={columns}
          getRowId={(member) => member.id}
          emptyTitle="No members found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "memberName", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[1100px]"
        />
      </CardContent>
    </Card>
  )
}

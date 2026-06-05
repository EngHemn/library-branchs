"use client"

import Link from "next/link"
import {
  BookOpenIcon,
  Building2Icon,
  CalendarIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserRoundIcon,
  UserPlusIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MemberDetail } from "@/domain/entities/member/MemberDetail"
import type { MemberStatus } from "@/domain/entities/member/Member"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"

type MemberDetailsTabProps = {
  member: MemberDetail
  branchNameToId?: Record<string, string>
  showBranchesUsedSection?: boolean
}

const statusLabels: Record<MemberStatus, string> = {
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
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
      {statusLabels[status]}
    </Badge>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  className: string
}) {
  return (
    <Card className="rounded-lg">
      <CardContent className="flex items-center gap-4 py-4">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${className}`}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm font-medium">{children}</div>
      </div>
    </div>
  )
}

export function MemberDetailsTab({
  member,
  branchNameToId,
  showBranchesUsedSection = true,
}: MemberDetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={BookOpenIcon}
          label="Active Bookings"
          value={member.bookings.active.length}
          className="bg-sky-100 text-sky-600"
        />
        <StatCard
          icon={BookOpenIcon}
          label="Late Returns"
          value={member.bookings.lateReturns.length}
          className="bg-red-100 text-red-600"
        />
        <StatCard
          icon={BookOpenIcon}
          label="Borrowing History"
          value={member.bookings.history.length}
          className="bg-violet-100 text-violet-600"
        />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRoundIcon className="size-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold">{member.memberName}</h3>
              <div className="mt-1">
                <MemberStatusBadge status={member.status} />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow icon={UserRoundIcon} label="Full Name">
              {member.memberName}
            </InfoRow>
            <InfoRow icon={MailIcon} label="Email">
              {member.email}
            </InfoRow>
            <InfoRow icon={PhoneIcon} label="Phone">
              {member.phone}
            </InfoRow>
            <InfoRow icon={Building2Icon} label="Registered Branch">
              <BranchLink
                branchId={member.branchId}
                branchName={member.registerBranch}
              />
            </InfoRow>
            {showBranchesUsedSection ? (
              <InfoRow icon={Building2Icon} label="Branches Used">
                <div className="flex flex-wrap gap-1">
                  {member.allBranchesUsed.map((branch) => {
                    const branchId = branchNameToId?.[branch]

                    if (branchId) {
                      return (
                        <Link
                          key={branch}
                          href={`/dashboard/branches/${branchId}`}
                          className="inline-flex items-center rounded-md bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-900"
                        >
                          {branch}
                        </Link>
                      )
                    }

                    return (
                      <Badge
                        key={branch}
                        variant="secondary"
                        className="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                      >
                        {branch}
                      </Badge>
                    )
                  })}
                </div>
              </InfoRow>
            ) : null}
            <InfoRow icon={MapPinIcon} label="Address">
              {member.address}
            </InfoRow>
            <InfoRow icon={CalendarIcon} label="Registered">
              {member.registrationDate}
            </InfoRow>
            <InfoRow icon={UserPlusIcon} label="Added By">
              <Link
                href={`/dashboard/staff/${member.addedBy.staffId}`}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-muted hover:underline"
              >
                <Avatar className="size-6">
                  <AvatarFallback className="text-[10px]">
                    {getInitials(member.addedBy.staffName)}
                  </AvatarFallback>
                </Avatar>
                {member.addedBy.staffName}
              </Link>
            </InfoRow>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

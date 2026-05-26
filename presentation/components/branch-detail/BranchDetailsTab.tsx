"use client"

import {
  BookOpenIcon,
  Building2Icon,
  CalendarIcon,
  GitBranchIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BranchDetail } from "@/domain/entities/branch/BranchDetail"

type BranchDetailsTabProps = {
  branchDetail: BranchDetail
}

const branchTypeLabels = {
  main: "Main Branch",
  sub: "Sub Branch",
}

const branchStatusLabels = {
  active: "Active",
  inactive: "Inactive",
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
}) {
  return (
    <Card className="rounded-lg">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
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

export function BranchDetailsTab({ branchDetail }: BranchDetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpenIcon}
          label="Total Books"
          value={branchDetail.bookCount}
        />
        <StatCard
          icon={UsersIcon}
          label="Total Members"
          value={branchDetail.totalMembers}
        />
        <StatCard
          icon={UsersIcon}
          label="Total Staff"
          value={branchDetail.staffCount}
        />
        <StatCard
          icon={GitBranchIcon}
          label="Sub Branches"
          value={branchDetail.totalSubBranches}
        />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2Icon className="size-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold">{branchDetail.branchName}</h3>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={branchDetail.type === "main" ? "default" : "secondary"}
                >
                  {branchTypeLabels[branchDetail.type]}
                </Badge>
                <Badge
                  variant={branchDetail.status === "active" ? "default" : "outline"}
                >
                  {branchStatusLabels[branchDetail.status]}
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow icon={MailIcon} label="Email">
              {branchDetail.email}
            </InfoRow>
            <InfoRow icon={PhoneIcon} label="Phone">
              {branchDetail.phone}
            </InfoRow>
            <InfoRow icon={MapPinIcon} label="Address">
              {branchDetail.address}
            </InfoRow>
            <InfoRow icon={UsersIcon} label="Admin">
              {branchDetail.adminName}
            </InfoRow>
            <InfoRow icon={CalendarIcon} label="Created Date">
              {new Date(branchDetail.createdDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </InfoRow>
            {branchDetail.type === "sub" && branchDetail.parentBranch ? (
              <InfoRow icon={Building2Icon} label="Parent Branch">
                {branchDetail.parentBranch}
              </InfoRow>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

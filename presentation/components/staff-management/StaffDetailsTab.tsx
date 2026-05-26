"use client"

import {
  BookOpenIcon,
  Building2Icon,
  HashIcon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type {
  StaffMember,
  StaffPermission,
  StaffRole,
} from "@/domain/entities/staff/StaffMember"

type StaffDetailsTabProps = {
  staffMember: StaffMember
  bookCount: number
  authorCount: number
  translatorCount: number
}

const roleLabels: Record<StaffRole, string> = {
  manager: "Manager",
  librarian: "Librarian",
  assistant: "Assistant",
  clerk: "Clerk",
  security: "Security",
}

const statusLabels = {
  active: "Active",
  inactive: "Inactive",
}

const permissionLabels: Record<StaffPermission, string> = {
  read: "Read",
  write: "Write",
  delete: "Delete",
  manage_staff: "Manage Staff",
  manage_books: "Manage Books",
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

export function StaffDetailsTab({
  staffMember,
  bookCount,
  authorCount,
  translatorCount,
}: StaffDetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={BookOpenIcon}
          label="Branch Books"
          value={bookCount}
          className="bg-sky-100 text-sky-600"
        />
        <StatCard
          icon={UsersIcon}
          label="Branch Authors"
          value={authorCount}
          className="bg-violet-100 text-violet-600"
        />
        <StatCard
          icon={UsersIcon}
          label="Branch Translators"
          value={translatorCount}
          className="bg-orange-100 text-orange-600"
        />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UsersIcon className="size-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold">
                {staffMember.staffName}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={
                    staffMember.role === "manager" ? "default" : "secondary"
                  }
                >
                  {roleLabels[staffMember.role]}
                </Badge>
                <Badge
                  variant={
                    staffMember.status === "active" ? "default" : "outline"
                  }
                >
                  {statusLabels[staffMember.status]}
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow icon={HashIcon} label="Staff ID">
              {staffMember.staffId}
            </InfoRow>
            <InfoRow icon={MailIcon} label="Email">
              {staffMember.email}
            </InfoRow>
            <InfoRow icon={PhoneIcon} label="Phone">
              {staffMember.phone}
            </InfoRow>
            <InfoRow icon={Building2Icon} label="Branch">
              {staffMember.branch}
            </InfoRow>
            <InfoRow icon={ShieldCheckIcon} label="Permissions">
              <div className="flex flex-wrap gap-1">
                {staffMember.permissions.length === 0 ? (
                  <span className="text-muted-foreground">None</span>
                ) : (
                  staffMember.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="text-xs">
                      {permissionLabels[perm]}
                    </Badge>
                  ))
                )}
              </div>
            </InfoRow>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

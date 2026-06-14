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
import { EntityImage } from "@/components/ui/entity-image"
import type { PermissionStaffRole } from "@/domain/entities/permission/Permission"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type StaffDetailsTabProps = {
  staffMember: StaffMember
  bookCount: number
  authorCount: number
  translatorCount: number
}

const STAFF_ROLE_KEYS: Record<PermissionStaffRole, TranslationKey> = {
  branch_admin: "staff.roles.branchAdmin",
  sub_branch_admin: "staff.roles.subBranchAdmin",
  staff: "staff.roles.staff",
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
  const { t } = useTranslation()
  const roleLabel = STAFF_ROLE_KEYS[staffMember.role as PermissionStaffRole]
    ? t(STAFF_ROLE_KEYS[staffMember.role as PermissionStaffRole])
    : staffMember.role

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={BookOpenIcon}
          label={t("staff.details.branchBooks")}
          value={bookCount}
          className="bg-sky-100 text-sky-600"
        />
        <StatCard
          icon={UsersIcon}
          label={t("staff.details.branchAuthors")}
          value={authorCount}
          className="bg-violet-100 text-violet-600"
        />
        <StatCard
          icon={UsersIcon}
          label={t("staff.details.branchTranslators")}
          value={translatorCount}
          className="bg-orange-100 text-orange-600"
        />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <EntityImage
              src={staffMember.imageUrl}
              alt={staffMember.staffName}
              fill
              sizes="48px"
              className="size-12 rounded-lg"
              imageClassName="rounded-lg"
              fallback={
                <div className="flex size-full items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UsersIcon className="size-6" />
                </div>
              }
            />
            <div className="min-w-0">
              <h3 className="text-lg font-semibold">
                {staffMember.staffName}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={
                    staffMember.role === "branch_admin" ? "default" : "secondary"
                  }
                >
                  {roleLabel}
                </Badge>
                <Badge
                  variant={
                    staffMember.status === "active" ? "default" : "outline"
                  }
                >
                  {t(`common.${staffMember.status}` as TranslationKey)}
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow icon={HashIcon} label={t("staff.details.staffId")}>
              {staffMember.staffId}
            </InfoRow>
            <InfoRow icon={MailIcon} label={t("staff.details.email")}>
              {staffMember.email}
            </InfoRow>
            <InfoRow icon={PhoneIcon} label={t("staff.details.phone")}>
              {staffMember.phone}
            </InfoRow>
            <InfoRow icon={Building2Icon} label={t("staff.details.branch")}>
              {staffMember.branch}
            </InfoRow>
            <InfoRow icon={ShieldCheckIcon} label={t("staff.details.access")}>
              <span className="text-muted-foreground">
                {t("staff.details.accessDescription", { role: roleLabel })}
              </span>
            </InfoRow>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

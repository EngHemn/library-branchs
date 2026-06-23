"use client"

import { SearchIcon } from "lucide-react"

const STAFF_ROLE_VALUES = new Set<string>(
  Object.keys(PERMISSION_ROLE_LABELS).concat(["all"])
)
function isStaffRoleFilter(value: string): value is StaffRoleFilter {
  return STAFF_ROLE_VALUES.has(value)
}

const STAFF_STATUS_VALUES = new Set<string>(["all", "active", "inactive"])
function isStaffStatusFilter(value: string): value is StaffStatusFilter {
  return STAFF_STATUS_VALUES.has(value)
}

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PERMISSION_ROLE_LABELS } from "@/domain/entities/permission/Permission"
import type { PermissionStaffRole } from "@/domain/entities/permission/Permission"
import type {
  StaffRole,
  StaffStatus,
} from "@/domain/entities/staff/StaffMember"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type { StaffBranchFilterOption } from "@/presentation/viewmodels/staff-management/StaffManagementViewModelState"

type StaffRoleFilter = "all" | StaffRole
type StaffStatusFilter = "all" | StaffStatus
type StaffBranchFilter = "all" | string

type StaffFiltersProps = {
  searchQuery: string
  roleFilter: StaffRoleFilter
  branchFilter: StaffBranchFilter
  statusFilter: StaffStatusFilter
  branchFilterOptions: StaffBranchFilterOption[]
  showBranchFilter?: boolean
  showBranchAdminRole?: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onRoleFilterChange: (roleFilter: StaffRoleFilter) => void
  onBranchFilterChange: (branchFilter: StaffBranchFilter) => void
  onStatusFilterChange: (statusFilter: StaffStatusFilter) => void
}

const STAFF_ROLE_KEYS: Record<PermissionStaffRole, TranslationKey> = {
  branch_admin: "staff.roles.branchAdmin",
  sub_branch_admin: "staff.roles.subBranchAdmin",
  staff: "staff.roles.staff",
}

export function StaffFilters({
  searchQuery,
  roleFilter,
  branchFilter,
  statusFilter,
  branchFilterOptions,
  showBranchFilter = true,
  showBranchAdminRole = true,
  onSearchQueryChange,
  onRoleFilterChange,
  onBranchFilterChange,
  onStatusFilterChange,
}: StaffFiltersProps) {
  const { t } = useTranslation()

  const roleOptions: { value: string; label: string }[] = [
    { value: "all", label: t("staff.filters.allRoles") },
    ...Object.keys(PERMISSION_ROLE_LABELS)
      .filter((value) => showBranchAdminRole || value !== "branch_admin")
      .map((value) => ({
        value,
        label: t(STAFF_ROLE_KEYS[value as PermissionStaffRole]),
      })),
  ]

  const statusOptions: { value: StaffStatusFilter; label: string }[] = [
    { value: "all", label: t("staff.filters.allStatus") },
    { value: "active", label: t("common.active") },
    { value: "inactive", label: t("common.inactive") },
  ]

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("staff.filters.searchPlaceholder")}
          className="pl-9"
        />
      </div>
      <div className="flex gap-3">
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            if (isStaffRoleFilter(value)) onRoleFilterChange(value)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showBranchFilter ? (
          <Select value={branchFilter} onValueChange={onBranchFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {branchFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.value === "all"
                    ? t("staff.filters.allBranches")
                    : option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            if (isStaffStatusFilter(value)) onStatusFilterChange(value)
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

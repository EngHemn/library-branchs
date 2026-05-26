"use client"

import { RotateCcwIcon, SaveIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PermissionStaffMember } from "@/domain/entities/permission/Permission"

type RoleLabelMap = {
  branch_admin: string
  sub_branch_admin: string
  staff: string
}

const roleLabels: RoleLabelMap = {
  branch_admin: "Branch Admin",
  sub_branch_admin: "Sub-Branch Admin",
  staff: "Staff",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

type PermissionContentHeaderProps = {
  staff: PermissionStaffMember
  selectedCount: number
  totalCount: number
  isSaving: boolean
  onReset: () => void
  onSave: () => void
}

export function PermissionContentHeader({
  staff,
  selectedCount,
  totalCount,
  isSaving,
  onReset,
  onSave,
}: PermissionContentHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {getInitials(staff.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">{staff.name}</p>
          <p className="text-xs text-muted-foreground">
            {roleLabels[staff.role]} • {staff.branch}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="whitespace-nowrap">
          Selected: {selectedCount} / {totalCount}
        </Badge>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcwIcon className="h-3.5 w-3.5" />
          Reset
        </Button>
        {!staff.isRoleLocked && (
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
          >
            <SaveIcon className="h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save Permissions"}
          </Button>
        )}
      </div>
    </div>
  )
}

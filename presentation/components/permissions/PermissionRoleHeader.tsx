"use client"

import {
  PencilIcon,
  RotateCcwIcon,
  SaveIcon,
  ShieldIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PermissionRole } from "@/domain/entities/permission/Permission"

type PermissionRoleHeaderProps = {
  role: PermissionRole
  selectedCount: number
  totalCount: number
  isSaving: boolean
  isDirty: boolean
  onEditRole: () => void
  onDeleteRole: () => void
  onReset: () => void
  onSave: () => void
}

export function PermissionRoleHeader({
  role,
  selectedCount,
  totalCount,
  isSaving,
  isDirty,
  onEditRole,
  onDeleteRole,
  onReset,
  onSave,
}: PermissionRoleHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          <ShieldIcon className="size-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{role.name}</p>
            {role.isSystem ? (
              <Badge variant="outline" className="text-[10px] uppercase">
                System
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            {role.description || "No description"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="whitespace-nowrap">
          Selected: {selectedCount} / {totalCount}
        </Badge>
        <Button variant="outline" size="sm" onClick={onEditRole}>
          <PencilIcon className="h-3.5 w-3.5" />
          Edit Role
        </Button>
        <Button variant="destructive" size="sm" onClick={onDeleteRole}>
          <Trash2Icon className="h-3.5 w-3.5" />
          Delete Role
        </Button>
        <Button variant="outline" size="sm" onClick={onReset} disabled={!isDirty}>
          <RotateCcwIcon className="h-3.5 w-3.5" />
          Reset
        </Button>
        <Button size="sm" onClick={onSave} disabled={isSaving || !isDirty}>
          <SaveIcon className="h-3.5 w-3.5" />
          {isSaving ? "Saving..." : "Save Permissions"}
        </Button>
      </div>
    </div>
  )
}

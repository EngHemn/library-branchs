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
import {
  getPermissionRoleDescription,
  getPermissionRoleName,
} from "@/presentation/components/permissions/permissionI18n"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()
  const roleName = getPermissionRoleName(role, t)
  const roleDescription = getPermissionRoleDescription(role, t)

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          <ShieldIcon className="size-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{roleName}</p>
            {role.isSystem ? (
              <Badge variant="outline" className="text-[10px] uppercase">
                {t("permissions.system")}
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            {roleDescription ?? t("permissions.noDescription")}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="whitespace-nowrap">
          {t("permissions.header.selectedCount", {
            selected: selectedCount,
            total: totalCount,
          })}
        </Badge>
        <Button variant="outline" size="sm" onClick={onEditRole}>
          <PencilIcon className="h-3.5 w-3.5" />
          {t("permissions.header.editRole")}
        </Button>
        <Button variant="destructive" size="sm" onClick={onDeleteRole}>
          <Trash2Icon className="h-3.5 w-3.5" />
          {t("permissions.header.deleteRole")}
        </Button>
        <Button variant="outline" size="sm" onClick={onReset} disabled={!isDirty}>
          <RotateCcwIcon className="h-3.5 w-3.5" />
          {t("permissions.header.reset")}
        </Button>
        <Button size="sm" onClick={onSave} disabled={isSaving || !isDirty}>
          <SaveIcon className="h-3.5 w-3.5" />
          {isSaving ? t("common.saving") : t("permissions.header.savePermissions")}
        </Button>
      </div>
    </div>
  )
}

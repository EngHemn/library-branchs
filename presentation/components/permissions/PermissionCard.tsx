"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type {
  PermissionCategory,
  PermissionCode,
} from "@/domain/entities/permission/Permission"

type PermissionCardProps = {
  category: PermissionCategory
  selectedPermissions: PermissionCode[]
  onTogglePermission: (permission: PermissionCode) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function PermissionCard({
  category,
  selectedPermissions,
  onTogglePermission,
  onSelectAll,
  onDeselectAll,
}: PermissionCardProps) {
  const selectedCount = category.permissions.filter((p) =>
    selectedPermissions.includes(p)
  ).length
  const totalCount = category.permissions.length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            {category.name}{" "}
            <span className="font-normal text-muted-foreground">
              ({selectedCount}/{totalCount})
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-xs font-medium text-primary hover:underline"
            >
              All
            </button>
            <button
              type="button"
              onClick={onDeselectAll}
              className="text-xs font-medium text-muted-foreground hover:underline"
            >
              None
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {category.permissions.map((permission) => (
          <label
            key={permission}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <Checkbox
              checked={selectedPermissions.includes(permission)}
              onCheckedChange={() => onTogglePermission(permission)}
            />
            <span className="text-sm font-mono text-muted-foreground">
              {permission}
            </span>
          </label>
        ))}
      </CardContent>
    </Card>
  )
}

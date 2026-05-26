"use client"

import { ShieldIcon } from "lucide-react"

export function PermissionLockedAlert() {
  return (
    <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-6">
      <ShieldIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        This role&apos;s permissions are managed by role rules and cannot be
        edited individually.
      </p>
    </div>
  )
}

"use client"

import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PermissionRole } from "@/domain/entities/permission/Permission"
import { cn } from "@/lib/utils"

type PermissionRoleSidebarProps = {
  roles: PermissionRole[]
  selectedRoleId: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectRole: (roleId: string) => void
  onAddRole: () => void
}

export function PermissionRoleSidebar({
  roles,
  selectedRoleId,
  searchQuery,
  onSearchChange,
  onSelectRole,
  onAddRole,
}: PermissionRoleSidebarProps) {
  const hasSearchQuery = searchQuery.trim().length > 0
  const showEmptyState = roles.length === 0

  return (
    <div className="flex h-full w-full flex-col rounded-lg border bg-card">
      <div className="border-b p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Roles</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure permissions for each role. Assign roles to users in Staff Management.
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="mt-3 w-full"
          onClick={onAddRole}
        >
          <PlusIcon className="size-4" />
          Add Role
        </Button>
        <div className="relative mt-3">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={cn(
                "w-full rounded-md px-3 py-2.5 text-left transition-colors",
                role.id === selectedRoleId
                  ? "bg-primary/10 ring-1 ring-primary/20"
                  : "hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{role.name}</p>
                {role.isSystem ? (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    System
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {role.description || "No description"}
              </p>
            </button>
          ))}
          {showEmptyState ? (
            <div className="flex flex-col items-center gap-3 px-3 py-6">
              <p className="text-center text-sm text-muted-foreground">
                {hasSearchQuery
                  ? "No roles match your search."
                  : "No roles configured yet."}
              </p>
              {!hasSearchQuery ? (
                <Button type="button" variant="secondary" size="sm" onClick={onAddRole}>
                  <PlusIcon className="size-4" />
                  Add Role
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  )
}

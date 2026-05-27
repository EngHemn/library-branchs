"use client"

import { useRouter } from "next/navigation"
import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PermissionStaffMember } from "@/domain/entities/permission/Permission"
import { cn } from "@/lib/utils"

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

type PermissionStaffSidebarProps = {
  staff: PermissionStaffMember[]
  selectedStaffId: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectStaff: (staffId: string) => void
  addStaffHref: string
  addStaffLabel: string
}

export function PermissionStaffSidebar({
  staff,
  selectedStaffId,
  searchQuery,
  onSearchChange,
  onSelectStaff,
  addStaffHref,
  addStaffLabel,
}: PermissionStaffSidebarProps) {
  const router = useRouter()
  const hasSearchQuery = searchQuery.trim().length > 0
  const showEmptyState = staff.length === 0

  return (
    <div className="flex h-full w-full flex-col rounded-lg border bg-card">
      <div className="border-b p-4">
        <h2 className="text-base font-semibold">Staff Members</h2>
        <div className="relative mt-3">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {staff.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelectStaff(member.id)}
              className={cn(
                "w-full rounded-md px-3 py-2.5 text-left transition-colors",
                member.id === selectedStaffId
                  ? "bg-primary/10 ring-1 ring-primary/20"
                  : "hover:bg-muted"
              )}
            >
              <p className="text-sm font-medium">{member.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {roleLabels[member.role]} • {member.branch}
              </p>
            </button>
          ))}
          {showEmptyState ? (
            <div className="flex flex-col items-center gap-3 px-3 py-6">
              <p className="text-center text-sm text-muted-foreground">
                {hasSearchQuery
                  ? "No staff members match your search."
                  : "No staff members yet."}
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full py-3.5"
                onClick={() => router.push(addStaffHref)}
              >
                <PlusIcon className="mr-2 size-4" />
                {addStaffLabel}
              </Button>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  )
}

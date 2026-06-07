"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { getPermissionRoleLabel } from "@/domain/entities/permission/Permission"
import type { GroupStaffOption } from "@/domain/repositories/GroupRepository"

type GroupStaffSelectorProps = {
  staffOptions: GroupStaffOption[]
  selectedStaffIds: string[]
  onSelectedStaffIdsChange: (staffIds: string[]) => void
  disabled?: boolean
}

function matchesStaff(member: GroupStaffOption, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return (
    member.staffName.toLowerCase().includes(normalized) ||
    member.email.toLowerCase().includes(normalized) ||
    member.phone.toLowerCase().includes(normalized) ||
    getPermissionRoleLabel(member.role).toLowerCase().includes(normalized)
  )
}

export function GroupStaffSelector({
  staffOptions,
  selectedStaffIds,
  onSelectedStaffIdsChange,
  disabled = false,
}: GroupStaffSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStaff = useMemo(
    () => staffOptions.filter((member) => matchesStaff(member, searchQuery)),
    [staffOptions, searchQuery]
  )

  function toggleStaff(staffId: string, checked: boolean): void {
    if (checked) {
      onSelectedStaffIdsChange([...selectedStaffIds, staffId])
      return
    }

    onSelectedStaffIdsChange(selectedStaffIds.filter((id) => id !== staffId))
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search staff by name, role, email, or phone..."
          disabled={disabled}
          className="pl-9"
        />
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-3">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((member) => {
            const isChecked = selectedStaffIds.includes(member.id)

            return (
              <label
                key={member.id}
                className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50"
              >
                <Checkbox
                  checked={isChecked}
                  disabled={disabled}
                  onCheckedChange={(checked) =>
                    toggleStaff(member.id, checked === true)
                  }
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{member.staffName}</span>
                  <span className="text-xs text-muted-foreground">
                    {getPermissionRoleLabel(member.role)} · {member.email}
                  </span>
                </span>
              </label>
            )
          })
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {searchQuery.trim()
              ? "No staff match your search."
              : "No staff available."}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {selectedStaffIds.length} staff member
        {selectedStaffIds.length === 1 ? "" : "s"} assigned
      </p>
    </div>
  )
}

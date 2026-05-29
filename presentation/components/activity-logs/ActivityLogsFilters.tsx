"use client"

import { useCallback, useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  ActivityLogAction,
  ActivityLogBranchOption,
  ActivityLogStaffOption,
} from "@/domain/entities/activity-log/ActivityLog"

type ActivityActionFilter = "all" | ActivityLogAction
type ActivityBranchFilter = "all" | string
type ActivityStaffFilter = "all" | string

type FilterOption = {
  value: string
  label: string
}

type ActivityLogsFiltersProps = {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  actionFilter: ActivityActionFilter
  onActionFilterChange: (value: ActivityActionFilter) => void
  branchFilter: ActivityBranchFilter
  onBranchFilterChange: (value: ActivityBranchFilter) => void
  staffFilter: ActivityStaffFilter
  onStaffFilterChange: (value: ActivityStaffFilter) => void
  branchOptions: ActivityLogBranchOption[]
  staffOptions: ActivityLogStaffOption[]
}

const actionOptions: FilterOption[] = [
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "sale", label: "Sale" },
  { value: "booking", label: "Booking" },
  { value: "stock_update", label: "Stock Update" },
  { value: "transfer", label: "Transfer" },
  { value: "permission_change", label: "Permission Change" },
  { value: "export", label: "Export" },
  { value: "import", label: "Import" },
]

type FilterOptionComboboxProps = {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  allLabel: string
  options: FilterOption[]
}

function FilterOptionCombobox({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  allLabel,
  options,
}: FilterOptionComboboxProps) {
  const [inputValue, setInputValue] = useState("")

  const allOptions = useMemo(
    () => [{ value: "all", label: allLabel }, ...options],
    [allLabel, options]
  )

  const optionMap = useMemo(() => {
    const map = new Map<string, FilterOption>()
    for (const option of allOptions) {
      map.set(option.value, option)
    }
    return map
  }, [allOptions])

  const selectedOption = optionMap.get(value)

  const filteredOptions = useMemo(() => {
    const normalizedQuery = inputValue.trim().toLowerCase()
    if (!normalizedQuery) {
      return allOptions
    }

    return allOptions.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery)
    )
  }, [allOptions, inputValue])

  const itemToStringLabel = useCallback(
    (itemValue: string) => optionMap.get(itemValue)?.label ?? itemValue,
    [optionMap]
  )

  const handleValueChange = useCallback(
    (nextValue: string | null) => {
      onValueChange(nextValue ?? "all")
    },
    [onValueChange]
  )

  const handleInputValueChange = useCallback(
    (nextInput: string, eventDetails?: { reason?: string }) => {
      setInputValue(nextInput)

      if (
        eventDetails?.reason === "input-change" &&
        value !== "all" &&
        selectedOption &&
        nextInput.trim().toLowerCase() !==
          selectedOption.label.trim().toLowerCase()
      ) {
        onValueChange("all")
      }
    },
    [onValueChange, selectedOption, value]
  )

  return (
    <div className="w-full">
      <Label htmlFor={id} className="mb-1.5 block text-sm">
        {label}
      </Label>
      <Combobox
        value={value}
        onValueChange={handleValueChange}
        onInputValueChange={handleInputValueChange}
        itemToStringLabel={itemToStringLabel}
        filter={null}
      >
        <ComboboxInput id={id} className="w-full" placeholder={placeholder} />
        <ComboboxContent>
          {filteredOptions.length > 0 ? (
            <ComboboxList>
              {filteredOptions.map((option) => (
                <ComboboxItem key={option.value} value={option.value}>
                  {option.label}
                </ComboboxItem>
              ))}
            </ComboboxList>
          ) : (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export function ActivityLogsFilters({
  searchQuery,
  onSearchQueryChange,
  actionFilter,
  onActionFilterChange,
  branchFilter,
  onBranchFilterChange,
  staffFilter,
  onStaffFilterChange,
  branchOptions,
  staffOptions,
}: ActivityLogsFiltersProps) {
  const branchFilterOptions = useMemo(
    () =>
      branchOptions.map((branch) => ({
        value: branch.id,
        label: branch.name,
      })),
    [branchOptions]
  )

  const staffFilterOptions = useMemo(
    () =>
      staffOptions.map((staff) => ({
        value: staff.id,
        label: staff.name,
      })),
    [staffOptions]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1">
        <Label htmlFor="activity-log-search" className="sr-only">
          Search activity logs
        </Label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="activity-log-search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by description, entity, staff, or branch..."
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <FilterOptionCombobox
          id="activity-action-filter"
          label="Action"
          value={actionFilter}
          onValueChange={(value) =>
            onActionFilterChange(value as ActivityActionFilter)
          }
          placeholder="Search actions..."
          allLabel="All actions"
          options={actionOptions}
        />

        <FilterOptionCombobox
          id="activity-branch-filter"
          label="Branch"
          value={branchFilter}
          onValueChange={(value) =>
            onBranchFilterChange(value as ActivityBranchFilter)
          }
          placeholder="Search branches..."
          allLabel="All branches"
          options={branchFilterOptions}
        />

        <FilterOptionCombobox
          id="activity-staff-filter"
          label="Staff"
          value={staffFilter}
          onValueChange={(value) =>
            onStaffFilterChange(value as ActivityStaffFilter)
          }
          placeholder="Search staff..."
          allLabel="All staff"
          options={staffFilterOptions}
        />
      </div>
    </div>
  )
}

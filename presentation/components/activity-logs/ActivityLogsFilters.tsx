"use client"

import { useState } from "react"
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
  ActivityLogStaffOption,
} from "@/domain/entities/activity-log/ActivityLog"
import type {
  ActivityActionFilter,
  ActivityBranchFilter,
  ActivityBranchFilterOption,
  ActivityStaffFilter,
} from "@/presentation/viewmodels/activityLogs/ActivityLogsViewModelState"

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
  branchFilterOptions: ActivityBranchFilterOption[]
  showBranchFilter?: boolean
  staffOptions: ActivityLogStaffOption[]
}

const ACTION_OPTIONS: FilterOption[] = [
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

type FilterOptionComboboxProps<T extends string> = {
  id: string
  label: string
  value: T
  onValueChange: (value: T) => void
  placeholder: string
  options: FilterOption[]
  prependAllOption?: boolean
  allLabel?: string
}

function FilterOptionCombobox<T extends string>({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  options,
  prependAllOption = true,
  allLabel = "All",
}: FilterOptionComboboxProps<T>) {
  const [inputValue, setInputValue] = useState("")

  const allOptions = prependAllOption
    ? [{ value: "all", label: allLabel }, ...options]
    : options
  const optionMap = new Map(allOptions.map((o) => [o.value, o]))
  const selectedOption = optionMap.get(value)

  const normalizedQuery = inputValue.trim().toLowerCase()
  const filteredOptions = normalizedQuery
    ? allOptions.filter((o) => o.label.toLowerCase().includes(normalizedQuery))
    : allOptions

  function itemToStringLabel(itemValue: string): string {
    return optionMap.get(itemValue)?.label ?? itemValue
  }

  function handleValueChange(nextValue: string | null): void {
    onValueChange((nextValue ?? "all") as T)
  }

  function handleInputValueChange(nextInput: string, eventDetails?: { reason?: string }): void {
    setInputValue(nextInput)
    if (
      eventDetails?.reason === "input-change" &&
      value !== "all" &&
      selectedOption &&
      nextInput.trim().toLowerCase() !== selectedOption.label.trim().toLowerCase()
    ) {
      onValueChange("all" as T)
    }
  }

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
  branchFilterOptions,
  showBranchFilter = true,
  staffOptions,
}: ActivityLogsFiltersProps) {
  const branchOptions = branchFilterOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }))
  const staffFilterOptions = staffOptions.map((s) => ({ value: s.id, label: s.name }))

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

      <div
        className={
          showBranchFilter
            ? "grid gap-3 sm:grid-cols-3"
            : "grid gap-3 sm:grid-cols-2"
        }
      >
        <FilterOptionCombobox<ActivityActionFilter>
          id="activity-action-filter"
          label="Action"
          value={actionFilter}
          onValueChange={onActionFilterChange}
          placeholder="Search actions..."
          allLabel="All actions"
          options={ACTION_OPTIONS}
        />

        {showBranchFilter ? (
          <FilterOptionCombobox<ActivityBranchFilter>
            id="activity-branch-filter"
            label="Branch"
            value={branchFilter}
            onValueChange={onBranchFilterChange}
            placeholder="Search branches..."
            prependAllOption={false}
            options={branchOptions}
          />
        ) : null}

        <FilterOptionCombobox<ActivityStaffFilter>
          id="activity-staff-filter"
          label="Staff"
          value={staffFilter}
          onValueChange={onStaffFilterChange}
          placeholder="Search staff..."
          allLabel="All staff"
          options={staffFilterOptions}
        />
      </div>
    </div>
  )
}

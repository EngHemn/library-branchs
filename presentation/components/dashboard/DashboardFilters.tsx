"use client"

import { useState } from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DashboardBranch } from "@/domain/entities/dashboard/DashboardSummary"
import type { DateRangeFilter } from "@/presentation/viewmodels/dashboard/useDashboardViewModel"

type DashboardFiltersProps = {
  branches: DashboardBranch[]
  selectedBranchId: string
  dateRange: DateRangeFilter
  allowAllBranches?: boolean
  showBranchFilter?: boolean
  onBranchChange: (branchId: string) => void
  onDateRangeChange: (range: DateRangeFilter) => void
}

const DATE_RANGE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
]

const DATE_RANGE_VALUES = new Set<string>(DATE_RANGE_OPTIONS.map((o) => o.value))

function isDateRangeFilter(value: string): value is DateRangeFilter {
  return DATE_RANGE_VALUES.has(value)
}

export function DashboardFilters({
  branches,
  selectedBranchId,
  dateRange,
  allowAllBranches = true,
  showBranchFilter = true,
  onBranchChange,
  onDateRangeChange,
}: DashboardFiltersProps) {
  const [inputValue, setInputValue] = useState("")

  const allBranchOptions = [
    ...(allowAllBranches ? [{ value: "all", label: "All branches" }] : []),
    ...branches.map((b) => ({ value: b.id, label: b.name })),
  ]

  const optionMap = new Map(allBranchOptions.map((o) => [o.value, o]))
  const selectedOption = optionMap.get(selectedBranchId)

  const query = inputValue.trim().toLowerCase()
  const filteredOptions = query
    ? allBranchOptions.filter((o) => o.label.toLowerCase().includes(query))
    : allBranchOptions

  function itemToStringLabel(value: string): string {
    return optionMap.get(value)?.label ?? value
  }

  function handleValueChange(nextValue: string | null): void {
    onBranchChange(nextValue ?? "all")
  }

  function handleInputValueChange(nextInput: string, eventDetails?: { reason?: string }): void {
    setInputValue(nextInput)
    if (
      eventDetails?.reason === "input-change" &&
      selectedBranchId !== "all" &&
      selectedOption &&
      nextInput.trim().toLowerCase() !== selectedOption.label.trim().toLowerCase()
    ) {
      onBranchChange(allowAllBranches ? "all" : (branches[0]?.id ?? selectedBranchId))
    }
  }

  function handleDateRangeChange(value: string): void {
    if (isDateRangeFilter(value)) {
      onDateRangeChange(value)
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      {showBranchFilter ? (
        <div className="min-w-[220px] flex-1">
          <Label
            htmlFor="dashboard-branch-filter"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Branch
          </Label>
          <Combobox
            value={selectedBranchId}
            onValueChange={handleValueChange}
            onInputValueChange={handleInputValueChange}
            itemToStringLabel={itemToStringLabel}
            filter={null}
          >
            <ComboboxInput
              id="dashboard-branch-filter"
              className="h-9 w-full"
              placeholder="Search branches..."
              showClear={allowAllBranches && selectedBranchId !== "all"}
            />
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
                  No branches found
                </div>
              )}
            </ComboboxContent>
          </Combobox>
        </div>
      ) : null}

      <div className="w-40">
        <Label
          htmlFor="dashboard-date-filter"
          className="mb-1.5 block text-xs font-medium text-muted-foreground"
        >
          Date range
        </Label>
        <Select value={dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger id="dashboard-date-filter" className="h-9 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

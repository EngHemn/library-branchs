"use client"

import { useCallback, useMemo, useState } from "react"

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
  onBranchChange: (branchId: string) => void
  onDateRangeChange: (range: DateRangeFilter) => void
}

type BranchOption = {
  value: string
  label: string
}

const dateRangeOptions: { value: DateRangeFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
]

export function DashboardFilters({
  branches,
  selectedBranchId,
  dateRange,
  onBranchChange,
  onDateRangeChange,
}: DashboardFiltersProps) {
  const [inputValue, setInputValue] = useState("")

  const allBranchOptions: BranchOption[] = useMemo(
    () => [
      { value: "all", label: "All branches" },
      ...branches.map((b) => ({ value: b.id, label: b.name })),
    ],
    [branches]
  )

  const optionMap = useMemo(() => {
    const map = new Map<string, BranchOption>()
    for (const option of allBranchOptions) {
      map.set(option.value, option)
    }
    return map
  }, [allBranchOptions])

  const selectedOption = optionMap.get(selectedBranchId)

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase()
    if (!query) return allBranchOptions
    return allBranchOptions.filter((o) => o.label.toLowerCase().includes(query))
  }, [allBranchOptions, inputValue])

  const itemToStringLabel = useCallback(
    (value: string) => optionMap.get(value)?.label ?? value,
    [optionMap]
  )

  const handleValueChange = useCallback(
    (nextValue: string | null) => {
      onBranchChange(nextValue ?? "all")
    },
    [onBranchChange]
  )

  const handleInputValueChange = useCallback(
    (nextInput: string, eventDetails?: { reason?: string }) => {
      setInputValue(nextInput)
      if (
        eventDetails?.reason === "input-change" &&
        selectedBranchId !== "all" &&
        selectedOption &&
        nextInput.trim().toLowerCase() !== selectedOption.label.trim().toLowerCase()
      ) {
        onBranchChange("all")
      }
    },
    [onBranchChange, selectedBranchId, selectedOption]
  )

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[220px] flex-1">
        <Label htmlFor="dashboard-branch-filter" className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
            showClear={selectedBranchId !== "all"}
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

      <div className="w-40">
        <Label htmlFor="dashboard-date-filter" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Date range
        </Label>
        <Select value={dateRange} onValueChange={(v) => onDateRangeChange(v as DateRangeFilter)}>
          <SelectTrigger id="dashboard-date-filter" className="h-9 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((option) => (
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

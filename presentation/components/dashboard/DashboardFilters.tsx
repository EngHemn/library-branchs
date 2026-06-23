"use client"

import { useState } from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DashboardBranch } from "@/domain/entities/dashboard/DashboardSummary"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardFiltersProps = {
  branches: DashboardBranch[]
  selectedBranchId: string
  dateFrom: string | null
  dateTo: string | null
  allowAllBranches?: boolean
  showBranchFilter?: boolean
  onBranchChange: (branchId: string) => void
  onDateFromChange: (value: string | null) => void
  onDateToChange: (value: string | null) => void
}

export function DashboardFilters({
  branches,
  selectedBranchId,
  dateFrom,
  dateTo,
  allowAllBranches = true,
  showBranchFilter = true,
  onBranchChange,
  onDateFromChange,
  onDateToChange,
}: DashboardFiltersProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState("")

  const allBranchOptions = [
    ...(allowAllBranches
      ? [{ value: "all", label: t("dashboard.filters.allBranches") }]
      : []),
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

  function handleInputValueChange(
    nextInput: string,
    eventDetails?: { reason?: string }
  ): void {
    setInputValue(nextInput)
    if (
      eventDetails?.reason === "input-change" &&
      selectedBranchId !== "all" &&
      selectedOption &&
      nextInput.trim().toLowerCase() !==
        selectedOption.label.trim().toLowerCase()
    ) {
      onBranchChange(
        allowAllBranches ? "all" : (branches[0]?.id ?? selectedBranchId)
      )
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
            {t("dashboard.filters.branch")}
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
              placeholder={t("dashboard.filters.searchBranches")}
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
                  {t("dashboard.filters.noBranchesFound")}
                </div>
              )}
            </ComboboxContent>
          </Combobox>
        </div>
      ) : null}

      <div className="w-40">
        <Label
          htmlFor="dashboard-date-from"
          className="mb-1.5 block text-xs font-medium text-muted-foreground"
        >
          {t("dashboard.filters.dateFrom")}
        </Label>
        <Input
          id="dashboard-date-from"
          type="date"
          className="h-9"
          value={dateFrom ?? ""}
          max={dateTo ?? undefined}
          onChange={(event) => onDateFromChange(event.target.value || null)}
        />
      </div>

      <div className="w-40">
        <Label
          htmlFor="dashboard-date-to"
          className="mb-1.5 block text-xs font-medium text-muted-foreground"
        >
          {t("dashboard.filters.dateTo")}
        </Label>
        <Input
          id="dashboard-date-to"
          type="date"
          className="h-9"
          value={dateTo ?? ""}
          min={dateFrom ?? undefined}
          onChange={(event) => onDateToChange(event.target.value || null)}
        />
      </div>
    </div>
  )
}
